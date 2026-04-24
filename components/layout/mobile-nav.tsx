"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Info,
  Feather,
  BookOpen,
  Waypoints,
  Scissors,
  Shield,
  Dumbbell,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  Youtube,
  Instagram,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/app/context/theme-context";
import { CONTACT } from "@/lib/contact";

const menuItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/about", icon: Info, label: "소개" },
  { href: "/basic-sense", icon: Feather, label: "24반" },
  { href: "/basic", icon: BookOpen, label: "기본기" },
  { href: "/pattern", icon: Waypoints, label: "투로" },
  { href: "/cutting", icon: Scissors, label: "베기" },
  { href: "/sparring", icon: Shield, label: "대련" },
  { href: "/daily", icon: Dumbbell, label: "수련일지" },
  { href: "/#inquiry", icon: Mail, label: "입회 안내" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("accessToken"));
  }, []);

  // Close drawer when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("로그아웃 실패");
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  const glass =
    theme === "dark"
      ? "bg-[#280505] border-white/10"
      : "bg-[#d9d0d0] border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const hoverBg =
    theme === "dark"
      ? "hover:bg-primary/80 hover:text-primary-foreground"
      : "hover:bg-secondary/80 hover:text-secondary-foreground";

  return (
    <>
      {/* Top bar */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-50 ${glass} ${textColor} h-14 flex items-center justify-between px-4 border-b ${
          theme === "dark" ? "border-white/10" : "border-gray-200"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 font-semibold text-base tracking-wide">
          <Home size={18} />
          무련
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="메뉴 열기"
          className={`p-2 rounded-lg transition-colors ${hoverBg}`}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-[55]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              className={`md:hidden fixed top-0 left-0 bottom-0 z-[60] w-72 max-w-[85vw] ${glass} ${textColor} p-5 flex flex-col overflow-y-auto`}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 font-semibold text-base tracking-wide"
                >
                  <Home size={18} /> 무련
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleTheme}
                    aria-label="테마 전환"
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${hoverBg}`}
                  >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="메뉴 닫기"
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${hoverBg}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${hoverBg}`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <a
                    href={CONTACT.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube @muryeon"
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                      theme === "dark"
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-gray-900/5 hover:bg-gray-900/10"
                    }`}
                  >
                    <Youtube size={18} />
                  </a>
                  {CONTACT.instagram ? (
                    <a
                      href={CONTACT.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-900/5 hover:bg-gray-900/10"
                      }`}
                    >
                      <Instagram size={18} />
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Instagram 준비 중"
                      className={`flex items-center justify-center w-10 h-10 rounded-full opacity-40 ${
                        theme === "dark" ? "bg-white/10" : "bg-gray-900/5"
                      }`}
                    >
                      <Instagram size={18} />
                    </span>
                  )}
                </div>
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={18} /> 로그아웃
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
