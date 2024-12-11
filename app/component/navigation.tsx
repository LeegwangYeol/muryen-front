"use client";

import { useState } from "react";
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
} from "lucide-react";
import VideoModal from "./VideoModal";

export default function Navigation() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <nav
        className={`${
          isExpanded ? "w-64" : "w-24"
        } bg-slate-800 text-white h-screen p-4 relative transition-all duration-300`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-800 rounded-full p-1 hover:bg-slate-700"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <Link
          href="/"
          className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700"
        >
          <div className="flex items-center w-full space-x-4  justify-center text-xl font-bold truncate">
            {isExpanded ? "武緣" : "武"}
          </div>
        </Link>
        <ul className="space-y-2">
          <li>
            <Link
              href="/know-how"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <Feather size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">기초배경</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/component/know-how"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <BookOpen size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">기본</span>}
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className={`w-full text-left flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <Swords size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">대련</span>}
            </button>
          </li>
          <li>
            <Link
              href="/pattern"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <Waypoints size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">투로</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/cutting"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <Scissors size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">베기</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/daily"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <Dumbbell size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">수련일지</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/reference"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <FileText size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">참고 자료</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/equipment"
              className={`flex items-center ${
                isExpanded ? "" : "justify-center"
              } p-2 rounded hover:bg-slate-700`}
            >
              <Shield size={isExpanded ? 20 : 24} />
              {isExpanded && <span className="ml-2">장비와 무구</span>}
            </Link>
          </li>
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
