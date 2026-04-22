"use client";

import { useState } from "react";
import Navigation from "@/app/component/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useTheme } from "@/app/context/theme-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
      }`}
    >
      <MobileNav />
      <div className="flex">
        <div className="hidden md:block">
          <Navigation onExpand={setIsNavExpanded} />
        </div>
        <main
          className={`flex-1 transition-all duration-300 pt-14 md:pt-0 ${
            isNavExpanded ? "md:ml-64" : "md:ml-24"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
