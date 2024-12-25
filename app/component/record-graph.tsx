"use client";

import React from "react";
import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CommitData = {
  [date: string]: number;
};

const mockCommitData: CommitData = {
  // Generate some mock data for the last 3 years
  ...Object.fromEntries(
    Array.from({ length: 365 * 3 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return [format(date, "yyyy-MM-dd"), Math.floor(Math.random() * 10)];
    })
  ),
};

const colorGradient = [
  "bg-emerald-50",
  "bg-emerald-100",
  "bg-emerald-200",
  "bg-emerald-300",
  "bg-emerald-400",
  "bg-emerald-500",
  "bg-emerald-600",
  "bg-emerald-700",
  "bg-emerald-800",
];

const getColorClass = (count: number) => {
  if (count === 0) return "bg-gray-100";
  const index = Math.min(Math.floor(count / 2), colorGradient.length - 1);
  return colorGradient[index];
};

const RecordGraph: React.FC = () => {
  const years = Array.from(
    new Set(Object.keys(mockCommitData).map((date) => date.split("-")[0]))
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Commit History</h2>
      <div className="flex flex-col space-y-4">
        {years.map((year) => (
          <div key={year} className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{year}</h3>
            <div className="flex flex-wrap">
              {eachDayOfInterval({
                start: startOfYear(parseISO(`${year}-01-01`)),
                end: endOfYear(parseISO(`${year}-12-31`)),
              }).map((date) => {
                const dateString = format(date, "yyyy-MM-dd");
                const count = mockCommitData[dateString] || 0;
                return (
                  <TooltipProvider key={dateString}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={`w-3 h-3 m-[1px] rounded-sm ${getColorClass(
                            count
                          )}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {count} commits on {format(date, "MMM d, yyyy")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordGraph;
