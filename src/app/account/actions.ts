"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${origin}/account` }
  );

  if (error) {
    redirect(`/account?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/account?message=${encodeURIComponent("확인 이메일을 보냈습니다. 새 이메일에서 확인 링크를 클릭해주세요.")}`);
}

export async function updateAccountPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/account?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/account?message=${encodeURIComponent("비밀번호가 변경되었습니다.")}`);
}
