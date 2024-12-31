"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Noto_Sans_KR } from "next/font/google";
import Navigation from "@/app/component/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  return (
    <motion.div
      className={`min-h-screen bg-transparent `}
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
