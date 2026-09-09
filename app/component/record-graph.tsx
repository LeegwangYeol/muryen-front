"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  parseISO,
  subDays,
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MainLayout } from "@/components/layout/main-layout";

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

const ANCHOR_DATE = parseISO("2024-12-31");

const generateMockCommitData = (): CommitData => {
  const data: CommitData = {};
  const totalDays = 365 * 3;
  for (let i = 0; i < totalDays; i++) {
    const date = subDays(ANCHOR_DATE, i);
    const dateString = format(date, "yyyy-MM-dd");
    // Deterministic arithmetic formula based on day index
    const count = (i * 7 + (i % 3) * 5 + 3) % 10;
    const recordCount = count > 0 ? ((i * 3 + 1) % 4) + 1 : 0;
    const records = Array.from({ length: recordCount }, (_, j) => {
      const hour = String(9 + ((i * 2 + j * 3) % 12)).padStart(2, "0");
      const minute = String((i * 13 + j * 17) % 60).padStart(2, "0");
      return {
        id: `record-${i}-${j}`,
        title: `수련 기록 ${j + 1}`,
        content: `이날의 수련 내용입니다. ${j + 1}번째 기록`,
        timestamp: `${hour}:${minute}:00`,
      };
    });
    data[dateString] = { count, records };
  }
  return data;
};

const mockCommitData: CommitData = generateMockCommitData();

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
  };

  const selectedDateData = selectedDate ? mockCommitData[selectedDate] : null;

  const years = useMemo(
    () =>
      Array.from(
        new Set(Object.keys(mockCommitData).map((date) => date.split("-")[0]))
      ).sort().reverse(),
    []
  );

  const yearIntervals = useMemo(() => {
    return years.map((year) => ({
      year,
      days: eachDayOfInterval({
        start: startOfYear(parseISO(`${year}-01-01`)),
        end: endOfYear(parseISO(`${year}-12-31`)),
      }),
    }));
  }, [years]);

  return (
    <MainLayout>
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Commit History</h2>
        <TooltipProvider delayDuration={100}>
          <div className="flex flex-col space-y-4">
            {yearIntervals.map(({ year, days }) => (
              <div key={year} className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{year}</h3>
                <div className="flex flex-wrap">
                  {days.map((date) => {
                    const dateString = format(date, "yyyy-MM-dd");
                    const data = mockCommitData[dateString] || {
                      count: 0,
                      records: [],
                    };
                    return (
                      <Tooltip key={dateString}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleDateClick(dateString)}
                            aria-label={`${format(date, "yyyy-MM-dd")}: ${data.count}회 수련`}
                            className={`w-3 h-3 m-[1px] rounded-sm ${getColorClass(
                              data.count
                            )} cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 focus:outline-none`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {data.count} commits on{" "}
                            {format(date, "MMM d, yyyy")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>

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
              <DialogDescription className="sr-only">
                선택된 일자의 수련 기록 상세 내역입니다.
              </DialogDescription>
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
    </MainLayout>
  );
};

export default RecordGraph;
