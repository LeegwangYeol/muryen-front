import Image from "next/image";
import { useTheme } from "../context/theme-context";

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section className="relative w-full h-screen">
      <Image
        src="/images/announce/gumiAllone.webp"
        alt="Martial Arts"
        fill
        priority
        className="object-cover"
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center        }`}
      >
        <h1 className="text-white text-4xl font-bold mb-2">
          발끝에서 손끝까지 잇다
        </h1>
        <p className="text-white text-sm">
          ' 자연스럽게, 깊이 있게, 부드럽게 '
        </p>
      </div>
    </section>
  );
}
