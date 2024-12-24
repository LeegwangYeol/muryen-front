import Image from "next/image";
import ReactPlayer from "react-player";
import { useState, useEffect } from "react";
import { useTheme } from "../context/theme-context";

interface VideoCircleProps {
  videos: any[];
}

export default function VideoCircle({ videos }: VideoCircleProps) {
  const radius = 250;
  const totalVideos = videos.length;
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [rotation, setRotation] = useState(0);
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [currentRadius, setCurrentRadius] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    // 초기 애니메이션
    if (initialAnimation) {
      const startTime = Date.now();
      const duration = 1500; // 2초 동안 진행
      const fastRotationDuration = 1000; // 빠른 회전 1초

      const animateInitial = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < fastRotationDuration) {
          // 첫 1초: 빠른 회전과 중앙으로 모이기
          setRotation((prev) => (prev + 5) % 360);
          setCurrentRadius(radius * (1 - elapsed / fastRotationDuration));
          requestAnimationFrame(animateInitial);
        } else if (elapsed < duration) {
          // 다음 1초: 원래 위치로 돌아가기
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
      // 일반 회전 애니메이션
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 0.2) % 360);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [initialAnimation, radius]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-[800px] h-[450px]">
            <ReactPlayer
              url={selectedVideo.url}
              width="100%"
              height="100%"
              controls
              playing
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="relative w-[600px] h-[600px]">
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
              onClick={() => setSelectedVideo(video)}
            >
              <div
                className={`relative w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-lg ${
                  theme === "dark"
                    ? "glassmorphism-dark"
                    : "glassmorphism-light"
                }`}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
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
