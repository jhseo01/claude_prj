export const CATEGORIES = [
  { name: "일반", color: "#6b7280" },
  { name: "업무", color: "#2563eb" },
  { name: "개인", color: "#16a34a" },
  { name: "중요", color: "#dc2626" },
  { name: "기타", color: "#9333ea" },
] as const;

export function colorForCategory(category: string) {
  return CATEGORIES.find((c) => c.name === category)?.color ?? "#6b7280";
}
