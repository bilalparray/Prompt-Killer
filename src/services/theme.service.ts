import { BaseService } from "./base.service";

export type Theme = "light" | "dark";

export class ThemeService extends BaseService {
  private readonly THEME_KEY = "app-theme";

  getCurrentTheme(): Theme {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem(this.THEME_KEY) as Theme;
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  setTheme(theme: Theme): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  toggleTheme(): Theme {
    const current = this.getCurrentTheme();
    const newTheme = current === "light" ? "dark" : "light";
    this.setTheme(newTheme);
    return newTheme;
  }
}
