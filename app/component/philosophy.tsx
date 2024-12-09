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
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">
          The Path of Wisdom
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Our martial art is not just about physical techniques, but a way of
          life that cultivates wisdom, courage, and compassion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {philosophies.map((philosophy) => (
            <Dialog key={philosophy.title}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-32 text-lg">
                  {philosophy.title}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{philosophy.title}</DialogTitle>
                  <DialogDescription>
                    {philosophy.description}
                  </DialogDescription>
                </DialogHeader>
                <p className="text-slate-600">
                  In our practice, we emphasize the importance of{" "}
                  {philosophy.title.toLowerCase()} as a fundamental principle.
                  It guides our actions both in training and in daily life,
                  helping us to become better individuals and contributors to
                  society.
                </p>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
