import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/shared/stores/theme.store";

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="grid size-9 place-items-center rounded-lg text-text-muted transition hover:bg-surface-muted hover:text-text"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
