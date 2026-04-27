"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Feather,
  Swords,
  Dumbbell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield,
  Waypoints,
  Scissors,
  Sun,
  Moon,
  LogOut,
  Mail,
  Youtube,
  Instagram,
  Info,
} from "lucide-react";
import VideoModal from "./VideoModal";
import { useTheme } from "../context/theme-context";
import { CONTACT } from "@/lib/contact";

const menuItems = [
  {
    href: "/about",
    icon: <Info size={24} />,
    label: "소개",
  },
  {
    href: "/basic-sense",
    icon: <Feather size={24} />,
    label: "24반",
  },
  {
    href: "/basic",
    icon: <BookOpen size={24} />,
    label: "기본기",
  },
  {
    href: "/pattern",
    icon: <Waypoints size={24} />,
    label: "투로",
  },
  {
    href: "/cutting",
    icon: <Scissors size={24} />,
    label: "베기",
  },
  {
    href: "/sparring",
    icon: <Shield size={24} />,
    label: "대련",
  },
  {
    href: "/daily",
    icon: <Dumbbell size={24} />,
    label: "수련일지",
  },
  {
    href: "/#inquiry",
    icon: <Mail size={24} />,
    label: "입회 안내",
  },
  // {
  //   href: "/reference",
  //   icon: <FileText size={24} />,
  //   label: "참고 자료",
  // },
  // {
  //   href: "/equipment",
  //   icon: <Shield size={24} />,
  //   label: "장비와 무구",
  // },
];

export default function Navigation({
  onExpand,
}: {
  onExpand?: (expanded: boolean) => void;
}) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("accessToken"));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      // 로그아웃 성공
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  const handleExpand = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpand?.(expanded);
  };

  // theme이 결정되지 않았으면 렌더하지 않음 (SSR/CSR mismatch 방지)
  if (!theme) return null;

  return (
    <>
      <nav
        className={`${isExpanded ? "w-44" : "w-24"} ${
          theme === "dark"
            ? "bg-[#280505] border-r border-white/10"
            : "bg-[#d9d0d0] border-r border-gray-200"
        } text-${
          theme === "dark" ? "white" : "gray-900"
        } h-screen p-4 fixed top-0 left-0 z-50 transition-all duration-300 rounded-r-lg shadow-lg`}
      >
        <button
          onClick={() => handleExpand(!isExpanded)}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 ${
            theme === "dark"
              ? "bg-[#280505] border border-white/10"
              : "bg-[#d9d0d0] border border-gray-200"
          } rounded-full p-1 transition-colors duration-300 shadow`}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className={`flex items-center gap-4 p-4 rounded-lg mb-2 transition-colors duration-300 ${
              theme === "dark"
                ? "hover:bg-primary/90 hover:text-primary-foreground"
                : "hover:bg-secondary/90 hover:text-secondary-foreground"
            }`}
          >
            <Home size={24} />
            {isExpanded && <span>홈</span>}
          </Link>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
              theme === "dark"
                ? "bg-primary/10 hover:bg-primary/20 text-primary"
                : "bg-secondary/10 hover:bg-secondary/20 text-secondary"
            }`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${
                  theme === "dark"
                    ? "hover:bg-primary/80 hover:text-primary-foreground"
                    : "hover:bg-secondary/80 hover:text-secondary-foreground"
                }`}
              >
                {item.icon}
                {isExpanded && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <a
              href={CONTACT.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube @muryeon"
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
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
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-gray-900/5 hover:bg-gray-900/10"
                }`}
              >
                <Instagram size={18} />
              </a>
            ) : (
              <span
                aria-label="Instagram (준비 중)"
                aria-disabled="true"
                title="Instagram 계정 준비 중"
                className={`flex items-center justify-center w-10 h-10 rounded-full opacity-40 cursor-not-allowed ${
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
            >
              <LogOut size={18} /> 로그아웃
            </button>
          )}
          <VideoModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoId=""
          />
        </div>
      </nav>
    </>
  );
}
