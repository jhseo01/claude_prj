"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button onClick={toggle} className="rounded border px-2 py-1 text-sm" aria-label="다크모드 전환">
      {isDark ? "☀️ 라이트모드" : "🌙 다크모드"}
    </button>
  );
}
