"use client";

import { useState } from "react";
import Navigation from "@/app/component/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { useTheme } from "@/app/context/theme-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#410707]/90" : "bg-[#b3a6a6]/90"
      }`}
    >
      {/* 키보드 사용자용 본문 바로가기 — 평소엔 숨겨지고 Tab 키 누르면 등장 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[rgb(var(--accent))] focus:text-white focus:shadow-lg"
      >
        본문으로 건너뛰기
      </a>
      <MobileNav />
      <div className="flex">
        <div className="hidden md:block">
          <Navigation onExpand={setIsNavExpanded} />
        </div>
        <main
          id="main"
          style={{
            paddingTop: "calc(3.5rem + env(safe-area-inset-top))",
          }}
          className={`flex-1 transition-all duration-300 md:!pt-0 ${
            isNavExpanded ? "md:ml-64" : "md:ml-24"
          }`}
        >
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
