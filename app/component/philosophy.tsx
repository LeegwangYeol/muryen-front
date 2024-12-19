"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Philosophy() {
  const philosophies = [
    {
      title: "Harmony",
      description: "Achieving balance in body, mind, and spirit",
    },
    {
      title: "Respect",
      description: "Honoring traditions, masters, and fellow practitioners",
    },
    {
      title: "Discipline",
      description: "Cultivating self-control and dedication",
    },
  ];

  return (
    <section className="py-16 w-full px-4 bg-gradient-to-b from-slate-50 to-white min-h-[calc(79vh-8rem)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-slate-800 text-center">
          The Path of Wisdom
        </h2>
        <p className="text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto leading-relaxed">
          Our martial art is not just about physical techniques, but a way of
          life that cultivates wisdom, courage, and compassion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophies.map((philosophy) => (
            <Dialog key={philosophy.title}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-40 text-xl font-semibold hover:bg-slate-50 hover:scale-105 transition-all duration-300 rounded-xl border-2 shadow-sm hover:shadow-md"
                >
                  {philosophy.title}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    {philosophy.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg mt-2">
                    {philosophy.description}
                  </DialogDescription>
                </DialogHeader>
                <p className="text-slate-600 leading-relaxed mt-4">
                  In our practice, we emphasize the importance of{" "}
                  <span className="font-semibold text-slate-700">
                    {philosophy.title.toLowerCase()}
                  </span>{" "}
                  as a fundamental principle. It guides our actions both in
                  training and in daily life, helping us to become better
                  individuals and contributors to society.
                </p>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
