import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
}

const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    set({ theme: newTheme });
    
    // Apply theme to document
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
  
  setTheme: (theme: "dark" | "light") => {
    set({ theme });
    
    // Apply theme to document
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
}));

// Initialize theme from localStorage
if (typeof window !== "undefined") {
  const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  
  useThemeStore.getState().setTheme(initialTheme);
}

export default useThemeStore;