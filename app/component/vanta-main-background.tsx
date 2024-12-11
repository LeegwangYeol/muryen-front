"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function VantaBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  useEffect(() => {
    const loadVanta = async () => {
      const initVanta = () => {
        if (window.VANTA) {
          window.VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0,
            points: 11.0,
            maxDistance: 29.0,
            color: 0xd227bd,
            spacing: 20.0,
            showDots: false,
          });
        }
      };

      // Three.js 로드
      const threeScript = document.createElement("script");
      threeScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
      threeScript.async = true;
      document.body.appendChild(threeScript);

      // Vanta.js 로드
      threeScript.onload = () => {
        const vantaScript = document.createElement("script");
        vantaScript.src =
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
        vantaScript.async = true;
        vantaScript.onload = initVanta;
        document.body.appendChild(vantaScript);
      };
    };

    loadVanta();

    // 클린업 함수
    return () => {
      if (window.VANTA) {
        window.VANTA.NET?.destroy();
      }
    };
  }, []);

  return (
    <>
      <div
        id="vanta-bg"
        className="fixed inset-0 z-[-1]"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div className="relative z-0">{children}</div>
    </>
  );
}