import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 px-4  w-full bg-red-600 text-white min-h-[calc(77vh-8rem)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          Begin Your Martial Arts Journey Today
        </h2>
        <p className="text-xl mb-8">
          Discover the power of Korean martial arts and transform your mind,
          body, and spirit.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-red-600 hover:bg-slate-100"
        >
          Find a Dojang Near You
        </Button>
      </div>
    </section>
  );
}
