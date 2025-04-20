"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Noto_Sans_KR } from "next/font/google";
import Navigation from "@/app/component/navigation";
import { useTheme } from "@/app/context/theme-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const { theme } = useTheme();

  return (
    <motion.div
      className={`min-h-screen ${theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex">
        <Navigation onExpand={setIsNavExpanded} />
        <main
          className={`flex-1 transition-all duration-300 ${
            isNavExpanded ? "ml-64" : "ml-24"
          }`}
        >
          {children}
        </main>
      </div>
    </motion.div>
  );
}
