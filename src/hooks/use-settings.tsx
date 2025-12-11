"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

type Settings = {
  theme: Theme;
  fontSize: number;
  lineHeight: number;
};

const defaultSettings: Settings = {
  theme: "dark",
  fontSize: 16,
  lineHeight: 1.5,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("dyslexiapilot-ai-settings");
      if (storedSettings) {
        setSettingsState(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("dyslexiapilot-ai-settings", JSON.stringify(settings));
        
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        
        if (settings.theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          root.classList.add(systemTheme);
        } else {
          root.classList.add(settings.theme);
        }
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, isMounted]);

  const setSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettingsState((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  }, []);

  const value = { settings: isMounted ? settings : defaultSettings, setSettings };

  return (
    <SettingsContext.Provider value={value}>
      <style jsx global>{`
        :root {
          --font-size-base: ${settings.fontSize}px;
          --line-height-base: ${settings.lineHeight};
        }
      `}</style>
      {children}
    </SettingsContext.Provider>
  );
};
