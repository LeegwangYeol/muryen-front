import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-64 flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.jpeg"
        alt="Martial Arts"
        width={1820}
        height={980}
        className="absolute z-0"
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl font-bold mb-2">발끝에서 손끝까지 잇다</h1>
        <p className="text-sm">' 자연스럽게, 깊이 있게, 부드럽게 '</p>
      </div>
    </section>
  );
}
