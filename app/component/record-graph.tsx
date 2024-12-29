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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CommitData = {
  [date: string]: {
    count: number;
    records: Array<{
      id: string;
      title: string;
      content: string;
      timestamp: string;
    }>;
  };
};

const mockCommitData: CommitData = {
  ...Object.fromEntries(
    Array.from({ length: 365 * 3 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return [
        format(date, "yyyy-MM-dd"),
        {
          count: Math.floor(Math.random() * 10),
          records: Array.from(
            { length: Math.floor(Math.random() * 5) },
            (_, j) => ({
              id: `record-${i}-${j}`,
              title: `수련 기록 ${j + 1}`,
              content: `이날의 수련 내용입니다. ${j + 1}번째 기록`,
              timestamp: format(date, "HH:mm:ss"),
            })
          ),
        },
      ];
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
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
  };

  const selectedDateData = selectedDate ? mockCommitData[selectedDate] : null;

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
                const data = mockCommitData[dateString] || {
                  count: 0,
                  records: [],
                };
                return (
                  <TooltipProvider key={dateString}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          onClick={() => handleDateClick(dateString)}
                          className={`w-3 h-3 m-[1px] rounded-sm ${getColorClass(
                            data.count
                          )} cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {data.count} commits on {format(date, "MMM d, yyyy")}
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

      <Dialog
        open={selectedDate !== null}
        onOpenChange={() => setSelectedDate(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate &&
                format(parseISO(selectedDate), "yyyy년 MM월 dd일")}
              의 수련 기록
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedDateData?.records.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{record.title}</h4>
                  <span className="text-sm text-gray-500">
                    {record.timestamp}
                  </span>
                </div>
                <p className="text-gray-700">{record.content}</p>
              </div>
            ))}
            {selectedDateData?.records.length === 0 && (
              <p className="text-center text-gray-500">
                이 날의 기록이 없습니다.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordGraph;
