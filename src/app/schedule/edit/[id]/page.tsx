import { createClient } from "@/lib/supabase/server";
import { updateSchedule } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";

function toLocalInputValue(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: schedule } = await supabase
    .from("schedules")
    .select("*")
    .eq("id", id)
    .single();

  if (!schedule) notFound();

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">일정 수정</h1>
      <form action={updateSchedule} className="space-y-3 rounded border p-4">
        <input type="hidden" name="id" value={schedule.id} />
        <input name="title" placeholder="제목" defaultValue={schedule.title} required
          className="w-full rounded border px-3 py-2" />
        <textarea name="description" placeholder="설명" defaultValue={schedule.description ?? ""}
          className="w-full rounded border px-3 py-2" />
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-sm">시작</label>
            <input name="start_at" type="datetime-local" required
              defaultValue={toLocalInputValue(schedule.start_at)}
              className="w-full rounded border px-3 py-2" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-sm">종료 (선택)</label>
            <input name="end_at" type="datetime-local"
              defaultValue={toLocalInputValue(schedule.end_at)}
              className="w-full rounded border px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
            저장
          </button>
          <Link href="/schedule" className="rounded border px-4 py-2">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
