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
} from "lucide-react";
import VideoModal from "./VideoModal";
import { useTheme } from "../context/theme-context";

const menuItems = [
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
    // 쿠키에서 accessToken 확인
    console.log("accessToken", document.cookie);
    const hasToken = document.cookie.includes("accessToken");
    console.log("hasToken", hasToken);
    setIsLoggedIn(hasToken);
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

  return (
    <>
      <nav
        className={`${isExpanded ? "w-44" : "w-24"} ${
          theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
        } text-${
          theme === "dark" ? "white" : "gray-900"
        } h-screen p-4 fixed top-0 left-0 z-50 transition-all duration-300 rounded-r-lg`}
      >
        <button
          onClick={() => handleExpand(!isExpanded)}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 ${
            theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
          } rounded-full p-1 hover:scale-110 transition-all duration-300`}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className={`flex items-center gap-4 p-4 rounded-lg mb-2 transition-all duration-300 group ${
              theme === "dark"
                ? "hover:bg-primary/90 hover:text-primary-foreground"
                : "hover:bg-secondary/90 hover:text-secondary-foreground"
            }`}
          >
            <div className="group-hover:animate-shake">
              <Home size={24} />
            </div>
            {isExpanded && (
              <span className="group-hover:animate-shake">홈</span>
            )}
          </Link>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group ${
              theme === "dark"
                ? "bg-primary/10 hover:bg-primary/20 text-primary"
                : "bg-secondary/10 hover:bg-secondary/20 text-secondary"
            }`}
          >
            <div className="group-hover:animate-shake">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-4 p-4 rounded-lg mb-2 transition-all duration-300 group ${
                  theme === "dark"
                    ? "hover:bg-primary/90 hover:text-primary-foreground"
                    : "hover:bg-secondary/90 hover:text-secondary-foreground"
                }`}
              >
                <div className="group-hover:animate-shake">{item.icon}</div>
                {isExpanded && (
                  <span className="group-hover:animate-shake">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-4 p-4 rounded-lg mb-2 transition-all duration-300 group ${
                  theme === "dark"
                    ? "hover:bg-primary/90 hover:text-primary-foreground"
                    : "hover:bg-secondary/90 hover:text-secondary-foreground"
                }`}
              >
                <div className="group-hover:animate-shake">
                  <LogOut size={24} />
                </div>
                {isExpanded && (
                  <span className="group-hover:animate-shake">로그아웃</span>
                )}
              </button>
            </li>
          )}
        </ul>
      </nav>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="uEy7aQjDlnw"
      />
    </>
  );
}
