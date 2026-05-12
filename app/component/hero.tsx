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
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-6 text-center [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)]">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 drop-shadow-2xl leading-tight">
          무련 <span className="opacity-80 font-bold">武緣</span>
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl font-medium mb-2 drop-shadow-lg max-w-md">
          발끝에서 손끝까지 잇다
        </p>
        <p className="text-white/85 text-xs sm:text-sm tracking-wide">
          &apos; 자연스럽게, 깊이 있게, 부드럽게 &apos;
        </p>
      </div>
    </section>
  );
}
