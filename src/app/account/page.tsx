import { createClient } from "@/lib/supabase/server";
import { updateEmail, updateAccountPassword } from "./actions";
import Link from "next/link";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">계정 설정</h1>
        <Link href="/schedule" className="text-sm underline">목록으로</Link>
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <form action={updateEmail} className="space-y-3 rounded border p-4">
        <h2 className="font-semibold">이메일 변경</h2>
        <p className="text-sm text-zinc-500">현재: {user?.email}</p>
        <input name="email" type="email" placeholder="새 이메일" required
          className="w-full rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          변경
        </button>
      </form>

      <form action={updateAccountPassword} className="space-y-3 rounded border p-4">
        <h2 className="font-semibold">비밀번호 변경</h2>
        <input name="password" type="password" placeholder="새 비밀번호" required minLength={6}
          className="w-full rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          변경
        </button>
      </form>
    </div>
  );
}
