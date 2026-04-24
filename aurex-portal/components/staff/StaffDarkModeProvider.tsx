"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = { dark: boolean; toggle: () => void };

const StaffDarkModeContext = createContext<DarkModeContextType>({ dark: false, toggle: () => {} });

export function StaffDarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("staff-dark-mode") === "true";
    setDark(stored);
    if (stored) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggle() {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("staff-dark-mode", String(next));
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }

  return (
    <StaffDarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </StaffDarkModeContext.Provider>
  );
}

export function useStaffDarkMode() {
  return useContext(StaffDarkModeContext);
}
