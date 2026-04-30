"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-screen">
      <Image
        src="/images/announce/gumiAllone.webp"
        alt="무련 — 조선 24반 무예 갑주 대련 수련"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
          무련 <span className="opacity-80 font-bold">武緣</span>
        </h1>
        <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium mb-1 drop-shadow">
          발끝에서 손끝까지 잇다
        </p>
        <p className="text-white/80 text-xs sm:text-sm">
          &apos; 자연스럽게, 깊이 있게, 부드럽게 &apos;
        </p>
      </div>
    </section>
  );
}
