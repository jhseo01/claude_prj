import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">나의 일정 관리 페이지</h1>
      <p className="text-zinc-500">로그인 후 일정을 등록하고 파일을 첨부할 수 있습니다.</p>
      {user ? (
        <Link href="/schedule" className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          내 일정으로 이동
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link href="/login" className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
            로그인
          </Link>
          <Link href="/signup" className="rounded border px-4 py-2">
            회원가입
          </Link>
        </div>
      )}
    </div>
  );
}
