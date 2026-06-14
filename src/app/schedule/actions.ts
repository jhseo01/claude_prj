"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addSchedule(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startAt = formData.get("start_at") as string;
  const endAt = formData.get("end_at") as string;
  const category = (formData.get("category") as string) || "일반";
  const color = (formData.get("color") as string) || "#6b7280";
  const files = formData.getAll("files") as File[];

  const filePaths: string[] = [];

  for (const file of files) {
    if (file && file.size > 0) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(path, file);

      if (uploadError) throw new Error(uploadError.message);
      filePaths.push(path);
    }
  }

  const { error } = await supabase.from("schedules").insert({
    user_id: user.id,
    title,
    description,
    start_at: startAt,
    end_at: endAt || null,
    category,
    color,
    file_paths: filePaths,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
  revalidatePath("/schedule/calendar");
}

export async function updateSchedule(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startAt = formData.get("start_at") as string;
  const endAt = formData.get("end_at") as string;
  const category = (formData.get("category") as string) || "일반";
  const color = (formData.get("color") as string) || "#6b7280";

  const { error } = await supabase
    .from("schedules")
    .update({
      title,
      description,
      start_at: startAt,
      end_at: endAt || null,
      category,
      color,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
  revalidatePath("/schedule/calendar");
  redirect("/schedule");
}

export async function toggleCompleted(id: string, completed: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("schedules")
    .update({ completed })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
  revalidatePath("/schedule/calendar");
}

export async function deleteSchedule(id: string, filePaths: string[]) {
  const supabase = await createClient();

  if (filePaths.length > 0) {
    await supabase.storage.from("attachments").remove(filePaths);
  }

  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
  revalidatePath("/schedule/calendar");
}

export async function getFileUrl(filePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("attachments")
    .createSignedUrl(filePath, 60 * 60);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}
