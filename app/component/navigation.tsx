"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Feather, Swords, Dumbbell } from "lucide-react";
import VideoModal from "./VideoModal";

export default function Navigation() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <nav className="w-64 bg-slate-800 text-white h-screen p-4">
        <div className="text-2xl font-bold mb-8">武</div>
        <ul className="space-y-2">
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700"
            >
              <Feather size={20} />
              <span>Philosophy</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full text-left flex items-center space-x-2 p-2 rounded hover:bg-slate-700"
            >
              <Swords size={20} />
              <span>Techniques</span>
            </button>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700"
            >
              <Dumbbell size={20} />
              <span>Training</span>
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
