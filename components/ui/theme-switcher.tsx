"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { MoonIcon } from "@/components/icons/moon";
import { SunDimIcon } from "@/components/icons/sun-dim";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Toggle
      variant="outline"
      className="group size-9 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted rounded-full"
      pressed={theme === "dark"}
      onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <MoonIcon
        className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 size-4"
        aria-hidden="true"
        size={20}
      />
      <SunDimIcon
        className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0 size-4"
        aria-hidden="true"
        size={20}
      />
    </Toggle>
  );
};

export default ThemeSwitcher;
