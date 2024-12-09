"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Techniques() {
  const techniques = [
    {
      name: "Flowing Water",
      description: "Fluid movements that adapt to any situation",
    },
    {
      name: "Mountain Stance",
      description: "Unshakeable stability and grounding",
    },
    { name: "Wind Strike", description: "Swift and precise attacks" },
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-slate-800">
          Master the Art of Movement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techniques.map((technique) => (
            <Dialog key={technique.name}>
              <DialogTrigger asChild>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <Image
                    src={`/images/hero.jpeg?height=200&width=300`}
                    alt={technique.name}
                    width={300}
                    height={200}
                    className="rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">
                    {technique.name}
                  </h3>
                  <p className="text-slate-600">{technique.description}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{technique.name}</DialogTitle>
                  <DialogDescription>{technique.description}</DialogDescription>
                </DialogHeader>
                <Image
                  src={`/images/hero.jpeg?height=300&width=500`}
                  alt={technique.name}
                  width={500}
                  height={300}
                  className="rounded-md mb-4"
                />
                <p className="text-slate-600">
                  The {technique.name} technique is a cornerstone of our martial
                  art. It emphasizes {technique.description.toLowerCase()},
                  allowing practitioners to respond effectively in various
                  situations. Regular practice of this technique enhances
                  overall agility, strength, and mental focus.
                </p>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
