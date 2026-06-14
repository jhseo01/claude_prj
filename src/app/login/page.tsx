import { login } from "./actions";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <form className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">로그인</h1>
        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm">이메일</label>
          <input id="email" name="email" type="email" required
            className="w-full rounded border px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm">비밀번호</label>
          <input id="password" name="password" type="password" required
            className="w-full rounded border px-3 py-2" />
        </div>
        <button formAction={login}
          className="w-full rounded bg-black px-3 py-2 text-white dark:bg-white dark:text-black">
          로그인
        </button>
        <p className="text-sm text-center">
          계정이 없으신가요? <Link href="/signup" className="underline">회원가입</Link>
        </p>
        <p className="text-sm text-center">
          <Link href="/forgot-password" className="underline">비밀번호를 잊으셨나요?</Link>
        </p>
      </form>
    </div>
  );
}
