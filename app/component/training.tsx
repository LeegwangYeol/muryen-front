"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

export default function Training() {
  const trainingPrograms = [
    {
      name: "Beginner's Path",
      description: "Foundation building and basic techniques",
    },
    {
      name: "Warrior's Journey",
      description: "Advanced techniques and mental training",
    },
    {
      name: "Master's Circle",
      description: "Philosophy, teaching, and perfecting the art",
    },
  ];

  return (
    <section className="py-16 px-4 bg-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Embark on Your Journey</h2>
        <p className="text-xl mb-8">
          Discover the power of our martial art and transform your mind, body,
          and spirit.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingPrograms.map((program) => (
            <Dialog key={program.name}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg"
                >
                  {program.name}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{program.name}</DialogTitle>
                <DialogDescription>{program.description}</DialogDescription>
                <p className="text-slate-600">
                  The {program.name} program is designed to{" "}
                  {program.description.toLowerCase()}. Through dedicated
                  practice and guidance from experienced instructors, you'll
                  develop not only physical skills but also mental fortitude and
                  spiritual growth.
                </p>
                <Button className="mt-4">Enroll Now</Button>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
