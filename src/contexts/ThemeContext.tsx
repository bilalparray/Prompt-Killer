"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeService, Theme } from "@/services/theme.service";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeService = new ThemeService();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme = themeService.getCurrentTheme();
    setThemeState(currentTheme);
    themeService.setTheme(currentTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    themeService.setTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = themeService.toggleTheme();
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
