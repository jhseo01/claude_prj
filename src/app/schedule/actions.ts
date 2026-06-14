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
  const file = formData.get("file") as File | null;

  let filePath: string | null = null;

  if (file && file.size > 0) {
    filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }
  }

  const { error } = await supabase.from("schedules").insert({
    user_id: user.id,
    title,
    description,
    start_at: startAt,
    end_at: endAt || null,
    file_path: filePath,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
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

  const { error } = await supabase
    .from("schedules")
    .update({
      title,
      description,
      start_at: startAt,
      end_at: endAt || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
  redirect("/schedule");
}

export async function deleteSchedule(id: string, filePath: string | null) {
  const supabase = await createClient();

  if (filePath) {
    await supabase.storage.from("attachments").remove([filePath]);
  }

  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/schedule");
}

export async function getFileUrl(filePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("attachments")
    .createSignedUrl(filePath, 60 * 60);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}
