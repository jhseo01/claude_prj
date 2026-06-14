import { updatePassword } from "../login/actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <form className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">새 비밀번호 설정</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm">새 비밀번호</label>
          <input id="password" name="password" type="password" required minLength={6}
            className="w-full rounded border px-3 py-2" />
        </div>
        <button formAction={updatePassword}
          className="w-full rounded bg-black px-3 py-2 text-white dark:bg-white dark:text-black">
          변경하기
        </button>
      </form>
    </div>
  );
}
