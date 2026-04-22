"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-screen">
      <Image
        src="/images/announce/gumiAllone.webp"
        alt="Martial Arts"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center">
          발끝에서 손끝까지 잇다
        </h1>
        <p className="text-white text-xs sm:text-sm text-center">
          &apos; 자연스럽게, 깊이 있게, 부드럽게 &apos;
        </p>
      </div>
    </section>
  );
}
