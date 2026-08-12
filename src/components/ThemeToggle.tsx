import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stockdine_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stockdine_theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
      title="Toggle Theme"
    >
      {isDark ? (
        <>
          <Sun className="size-4 text-[#D2D0C1]" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="size-4 text-[#2B2B2B]" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};
