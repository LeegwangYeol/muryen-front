"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "../context/theme-context";

declare global {
  interface Window {
    VANTA: any;
  }
}

/**
 * Vanta CELLS 배경 — 데스크탑 한정.
 * - 모바일(<= 768px): 배터리/성능을 위해 로드하지 않음
 * - prefers-reduced-motion: 사용자 환경 존중, 로드하지 않음
 * - 두 경우 모두 정적 그라데이션 배경(globals.css)이 노출됨
 */
export default function VantaBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const vantaEffect = useRef<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isMobile || reducedMotion) return;

    let cancelled = false;

    const initVanta = () => {
      if (cancelled) return;
      if (!window.VANTA) return;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      vantaEffect.current = window.VANTA.CELLS({
        el: "#vanta-bg",
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        speed: 0.3,
        color1: theme === "dark" ? 0x1a1a1a : 0xffffff,
        color2: theme === "dark" ? 0x646027 : 0x4e7b00,
      });
    };

    const ensureScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if ((existing as HTMLScriptElement).dataset.loaded === "true")
            return resolve();
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => {
          s.dataset.loaded = "true";
          resolve();
        };
        s.onerror = () => reject();
        document.body.appendChild(s);
      });

    (async () => {
      try {
        await ensureScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        );
        await ensureScript(
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js"
        );
        initVanta();
      } catch {
        // CDN 실패 시 그냥 정적 배경
      }
    })();

    return () => {
      cancelled = true;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [theme]);

  return (
    <>
      <div
        id="vanta-bg"
        aria-hidden="true"
        className="fixed inset-0 z-[-1] pointer-events-none"
      />
      <div className="relative z-0">{children}</div>
    </>
  );
}
