import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../context/theme-context";
import { Body, SubHeading } from "@/components/ui/typography";

interface CircleItem {
  id: string;
  title: string;
  description: string;
  story?: string;
  thumbnail: string;
  cta?: { label: string; href: string };
  // optional future video embed
  url?: string;
}

interface VideoCircleProps {
  videos: CircleItem[];
}

export default function VideoCircle({ videos }: VideoCircleProps) {
  const radius = 250;
  const totalVideos = videos.length;
  const [selected, setSelected] = useState<CircleItem | null>(null);
  const [rotation, setRotation] = useState(0);
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [currentRadius, setCurrentRadius] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (initialAnimation) {
      const startTime = Date.now();
      const duration = 1500;
      const fastRotationDuration = 1000;

      const animateInitial = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < fastRotationDuration) {
          setRotation((prev) => (prev + 5) % 360);
          setCurrentRadius(radius * (1 - elapsed / fastRotationDuration));
          requestAnimationFrame(animateInitial);
        } else if (elapsed < duration) {
          const progress =
            (elapsed - fastRotationDuration) / fastRotationDuration;
          setCurrentRadius(radius * progress);
          setRotation((prev) => (prev + 5 * (1 - progress)) % 360);
          requestAnimationFrame(animateInitial);
        } else {
          setInitialAnimation(false);
          setCurrentRadius(radius);
        }
      };

      requestAnimationFrame(animateInitial);
    } else {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 0.2) % 360);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [initialAnimation, radius]);

  // Esc로 모달 닫기
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="circle-modal-title"
        >
          <div
            className={`relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? "bg-[#2a0808] border border-white/10" : "bg-white border border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[16/9] bg-black/10">
              <Image
                src={selected.thumbnail}
                alt={selected.title}
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
                priority
              />
            </div>

            <div className="p-5 sm:p-7">
              <SubHeading size="md" id="circle-modal-title" className="mb-3">
                {selected.title}
              </SubHeading>
              <Body size="sm" className="mb-4">
                {selected.story || selected.description}
              </Body>

              <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-current/10">
                {selected.cta ? (
                  <Link
                    href={selected.cta.href}
                    onClick={() => setSelected(null)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${
                      isDark
                        ? "bg-white text-gray-900 hover:bg-gray-100"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {selected.cta.label} →
                  </Link>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => setSelected(null)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    isDark
                      ? "border border-white/20 text-white/80 hover:bg-white/10"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-[600px] h-[600px] scale-[0.55] sm:scale-75 md:scale-100 origin-center">
        {videos.map((video, index) => {
          const angle =
            (index / totalVideos) * 2 * Math.PI + (rotation * Math.PI) / 180;
          const x = currentRadius * Math.cos(angle);
          const y = currentRadius * Math.sin(angle);

          return (
            <div
              key={video.id}
              className="absolute group cursor-pointer hover:scale-105 transition-transform duration-300"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                left: "50%",
                top: "50%",
                transition: initialAnimation ? "none" : "transform 0.2s linear",
              }}
              onClick={() => setSelected(video)}
            >
              <div
                className={`relative w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-lg ${
                  isDark
                    ? "glassmorphism-dark animate-[shine_3s_ease-in-out_infinite]"
                    : "glassmorphism-light animate-[shineDark_3s_ease-in-out_infinite]"
                }`}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className={`object-cover ${
                    isDark
                      ? "animate-[imageGlow_3s_ease-in-out_infinite]"
                      : "animate-[imageGlowDark_3s_ease-in-out_infinite]"
                  }`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <h3 className="font-bold text-base mb-2">{video.title}</h3>
                    <p className="text-sm">{video.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
