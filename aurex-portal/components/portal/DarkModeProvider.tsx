"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = { dark: boolean; toggle: () => void };

const DarkModeContext = createContext<DarkModeContextType>({ dark: false, toggle: () => {} });

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("portal-dark-mode");
    if (stored === "true") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  function toggle() {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("portal-dark-mode", String(next));
      return next;
    });
  }

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
