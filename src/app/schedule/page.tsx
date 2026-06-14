import { createClient } from "@/lib/supabase/server";
import { addSchedule, deleteSchedule, getFileUrl } from "./actions";
import { logout } from "../login/actions";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .order("start_at", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 일정</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-500">{user?.email}</span>
          <form action={logout}>
            <button className="underline">로그아웃</button>
          </form>
        </div>
      </div>

      <form action={addSchedule} className="space-y-3 rounded border p-4">
        <h2 className="font-semibold">새 일정 추가</h2>
        <input name="title" placeholder="제목" required
          className="w-full rounded border px-3 py-2" />
        <textarea name="description" placeholder="설명"
          className="w-full rounded border px-3 py-2" />
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-sm">시작</label>
            <input name="start_at" type="datetime-local" required
              className="w-full rounded border px-3 py-2" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-sm">종료 (선택)</label>
            <input name="end_at" type="datetime-local"
              className="w-full rounded border px-3 py-2" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm">첨부파일 (선택)</label>
          <input name="file" type="file" className="w-full" />
        </div>
        <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          추가
        </button>
      </form>

      <div className="space-y-3">
        {schedules?.length === 0 && (
          <p className="text-zinc-500">등록된 일정이 없습니다.</p>
        )}
        {schedules?.map((s) => (
          <div key={s.id} className="rounded border p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                {s.description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>}
                <p className="text-sm text-zinc-500">
                  {new Date(s.start_at).toLocaleString("ko-KR")}
                  {s.end_at && ` ~ ${new Date(s.end_at).toLocaleString("ko-KR")}`}
                </p>
                {s.file_path && (
                  <FileLink filePath={s.file_path} />
                )}
              </div>
              <form action={async () => {
                "use server";
                await deleteSchedule(s.id, s.file_path);
              }}>
                <button className="text-sm text-red-600 underline">삭제</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function FileLink({ filePath }: { filePath: string }) {
  const url = await getFileUrl(filePath);
  const name = filePath.split("/").slice(1).join("/");
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
      첨부파일: {name}
    </a>
  );
}
