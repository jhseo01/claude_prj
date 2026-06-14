import { createClient } from "@/lib/supabase/server";
import { colorForCategory } from "../categories";
import Link from "next/link";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const { y, m } = await searchParams;
  const now = new Date();
  const year = y ? parseInt(y, 10) : now.getFullYear();
  const month = m ? parseInt(m, 10) : now.getMonth() + 1; // 1-12

  const supabase = await createClient();

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);

  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .gte("start_at", monthStart.toISOString())
    .lt("start_at", monthEnd.toISOString())
    .order("start_at", { ascending: true });

  const byDay = new Map<number, typeof schedules>();
  for (const s of schedules ?? []) {
    const day = new Date(s.start_at).getDate();
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(s);
  }

  const firstWeekday = monthStart.getDay(); // 0=Sun
  const daysInMonth = monthEnd.getDate() === 1
    ? new Date(year, month, 0).getDate()
    : new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{year}년 {month}월</h1>
        <div className="flex gap-3 text-sm">
          <Link href={`/schedule/calendar?y=${prev.y}&m=${prev.m}`} className="underline">이전</Link>
          <Link href={`/schedule/calendar?y=${next.y}&m=${next.m}`} className="underline">다음</Link>
          <Link href="/schedule" className="underline">목록으로</Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div key={i} className="min-h-24 rounded border p-1 text-xs space-y-1">
            {day && <div className="text-sm font-semibold">{day}</div>}
            {day && byDay.get(day)?.map((s) => (
              <Link
                key={s.id}
                href={`/schedule/edit/${s.id}`}
                className="block truncate rounded px-1 py-0.5 text-white"
                style={{ backgroundColor: s.color ?? colorForCategory(s.category ?? "일반") }}
                title={s.title}
              >
                {s.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
