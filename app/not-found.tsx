"use client";
export const runtime = "edge";
import VantaBackground from "./component/vanta-background";
import React from "react";

export default function NotFound() {
  return (
    <>
      <VantaBackground>
        <div className="h-screen text-center flex flex-col items-center justify-center relative space-y-4">
          <title>페이지를 찾지 못했어요.</title>
          <div>
            <h1 className="text-white text-[2rem] sm:text-[2.5rem] ">武緣</h1>
            <div className="inline-block" style={styles.error}>
              <h2 className="flex justify-center text-[1rem] leading-[1.5rem] font-normal sm:leading-[2rem]  text-white whitespace-break-spaces">
                없는 페이지에요.
              </h2>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-4 bg-gradient-to-r from-rose-300 to-violet-700 text-white rounded-sm font-semibold text-lg hover:from-violet-600 hover:to-rose-200 transition-all duration-200 transform hover:scale-105"
          >
            武緣 메인으로 이동해요
          </button>
        </div>
      </VantaBackground>
    </>
  );
}

const styles = {
  error: {
    fontFamily:
      'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
  },
} as const;
