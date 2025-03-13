// ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";
import { themes } from "theme";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  backgroundColor
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  const backgroundColor =
    theme === "light" ? themes.light.gray1 : themes.dark.gray1;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, backgroundColor }}>
      {children}
    </ThemeContext.Provider>
  );
};



export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
