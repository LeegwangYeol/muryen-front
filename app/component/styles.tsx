import Image from "next/image";

export default function Styles() {
  const styles = ["Taekwondo", "Hapkido", "Taekkyon"];

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-slate-800">
          Explore Korean Martial Arts Styles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {styles.map((style) => (
            <div
              key={style}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Image
                src={`images/hero.jpeg`}
                alt={style}
                width={300}
                height={200}
                className="rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-slate-800">
                {style}
              </h3>
              <p className="text-slate-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
