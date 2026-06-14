import { createClient } from "@/lib/supabase/server";
import { addSchedule, bulkDeleteSchedules, deleteSchedule, getFileUrl, toggleCompleted } from "./actions";
import { logout } from "../login/actions";
import { CATEGORIES, colorForCategory } from "./categories";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; sort?: string }>;
}) {
  const { q, category, status, sort } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from("schedules").select("*");

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (status === "completed") query = query.eq("completed", true);
  if (status === "active" || status === "overdue") query = query.eq("completed", false);

  const ascending = sort !== "desc";
  query = query.order("start_at", { ascending });

  const { data: allSchedules } = await query;

  const now = new Date();
  const isOverdue = (s: { completed: boolean; end_at: string | null; start_at: string }) =>
    !s.completed && new Date(s.end_at ?? s.start_at) < now;

  const schedules = status === "overdue"
    ? allSchedules?.filter(isOverdue)
    : allSchedules;

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 일정</h1>
        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          <Link href="/schedule/calendar" className="underline">캘린더</Link>
          <Link href="/account" className="underline">계정설정</Link>
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
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-sm">카테고리</label>
            <select name="category" defaultValue="일반"
              className="w-full rounded border px-3 py-2 bg-transparent dark:bg-zinc-900 dark:text-white">
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm">색상</label>
            <input name="color" type="color" defaultValue="#6b7280"
              className="h-10 w-16 rounded border px-1 py-1" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-sm">반복</label>
            <select name="repeat" defaultValue="none"
              className="w-full rounded border px-3 py-2 bg-transparent dark:bg-zinc-900 dark:text-white">
              <option value="none">반복 안 함</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-sm">반복 횟수</label>
            <input name="repeat_count" type="number" min={1} max={52} defaultValue={1}
              className="w-full rounded border px-3 py-2" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm">첨부파일 (선택, 여러 개 가능)</label>
          <input name="files" type="file" multiple
            className="w-full rounded border px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-black file:px-3 file:py-1 file:text-white dark:file:bg-white dark:file:text-black" />
        </div>
        <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          추가
        </button>
      </form>

      <form className="flex flex-wrap gap-2 items-end rounded border p-4 text-sm">
        <div className="space-y-1">
          <label className="text-sm block">검색</label>
          <input name="q" defaultValue={q ?? ""} placeholder="제목 검색"
            className="rounded border px-2 py-1" />
        </div>
        <div className="space-y-1">
          <label className="text-sm block">카테고리</label>
          <select name="category" defaultValue={category ?? ""} className="rounded border px-2 py-1 bg-transparent dark:bg-zinc-900 dark:text-white">
            <option value="">전체</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm block">상태</label>
          <select name="status" defaultValue={status ?? ""} className="rounded border px-2 py-1 bg-transparent dark:bg-zinc-900 dark:text-white">
            <option value="">전체</option>
            <option value="active">진행중</option>
            <option value="overdue">지연</option>
            <option value="completed">완료</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm block">정렬</label>
          <select name="sort" defaultValue={sort ?? "asc"} className="rounded border px-2 py-1 bg-transparent dark:bg-zinc-900 dark:text-white">
            <option value="asc">날짜 오름차순</option>
            <option value="desc">날짜 내림차순</option>
          </select>
        </div>
        <button className="rounded border px-3 py-1">적용</button>
      </form>

      <form action={bulkDeleteSchedules} className="space-y-3">
        {schedules?.length === 0 && (
          <p className="text-zinc-500">등록된 일정이 없습니다.</p>
        )}
        {schedules && schedules.length > 0 && (
          <button className="text-sm text-red-600 underline">선택한 일정 삭제</button>
        )}
        {schedules?.map((s) => {
          const filePaths: string[] = s.file_paths ?? (s.file_path ? [s.file_path] : []);
          return (
            <div key={s.id} className="rounded border p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" name="ids" value={s.id} title="삭제 선택" className="mt-2 size-4" />
                  <button
                    type="submit"
                    formAction={toggleCompleted.bind(null, s.id, !s.completed)}
                    title="완료 표시"
                    className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                      s.completed
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-zinc-400 dark:border-zinc-500"
                    }`}
                  >
                    {s.completed ? "✓" : ""}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded px-2 py-0.5 text-xs text-white"
                        style={{ backgroundColor: s.color ?? colorForCategory(s.category ?? "일반") }}
                      >
                        {s.category ?? "일반"}
                      </span>
                      {isOverdue(s) ? (
                        <span className="rounded bg-red-600 px-2 py-0.5 text-xs text-white">지연</span>
                      ) : s.completed ? (
                        <span className="rounded bg-zinc-500 px-2 py-0.5 text-xs text-white">완료</span>
                      ) : (
                        <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">진행중</span>
                      )}
                      <h3 className={`font-semibold ${s.completed ? "line-through text-zinc-400" : ""}`}>
                        {s.title}
                      </h3>
                    </div>
                    {s.description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>}
                    <p className="text-sm text-zinc-500">
                      {new Date(s.start_at).toLocaleString("ko-KR")}
                      {s.end_at && ` ~ ${new Date(s.end_at).toLocaleString("ko-KR")}`}
                    </p>
                    {filePaths.length > 0 && (
                      <div className="space-y-1 mt-1">
                        {filePaths.map((fp) => (
                          <FileLink key={fp} filePath={fp} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link href={`/schedule/edit/${s.id}`} className="text-sm text-blue-600 underline">수정</Link>
                  <button
                    type="submit"
                    formAction={deleteSchedule.bind(null, s.id, filePaths)}
                    className="text-sm text-red-600 underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
}

async function FileLink({ filePath }: { filePath: string }) {
  const url = await getFileUrl(filePath);
  const name = filePath.split("/").slice(1).join("/");
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 underline">
      첨부파일: {name}
    </a>
  );
}
