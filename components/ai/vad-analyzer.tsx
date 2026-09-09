"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Activity } from "lucide-react";
import { useTheme } from "@/app/context/theme-context";
import { motion, AnimatePresence } from "framer-motion";

// @ricky0123/vad-web is loaded via script tag in layout.tsx as a global
declare global {
  interface Window {
    vad: any;
  }
}

export function VadAnalyzer() {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0);
  const { theme } = useTheme();
  const [myVad, setMyVad] = useState<any>(null);

  // Helper for complete AudioContext and MediaStream teardown
  const teardownVad = (vadInstance: any) => {
    if (!vadInstance) return;
    try {
      if (typeof vadInstance.destroy === "function") {
        vadInstance.destroy();
      } else if (typeof vadInstance.pause === "function") {
        vadInstance.pause();
      }
      if (vadInstance.stream) {
        vadInstance.stream.getTracks?.().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
      if (
        vadInstance.audioContext &&
        vadInstance.audioContext.state !== "closed"
      ) {
        vadInstance.audioContext.close?.();
      }
    } catch (err) {
      console.error("VAD teardown error:", err);
    }
  };

  useEffect(() => {
    return () => {
      teardownVad(myVad);
    };
  }, [myVad]);

  const toggleListening = async () => {
    if (isListening) {
      teardownVad(myVad);
      setMyVad(null);
      setIsListening(false);
      setFeedback(null);
      setIntensity(0);
      return;
    }

    try {
      if (!window.vad) {
        setFeedback("VAD 모듈이 아직 로드되지 않았습니다.");
        return;
      }
      
      const newVad = await window.vad.MicVAD.new({
        onSpeechStart: () => {
          setFeedback("기합 소리 감지중...");
          setIntensity(Math.random() * 50 + 50); // mock intensity
        },
        onSpeechEnd: (audio: Float32Array) => {
          // Calculate max amplitude for a mock "decibel" score
          let maxVal = 0;
          for (let i = 0; i < audio.length; i++) {
            if (Math.abs(audio[i]) > maxVal) maxVal = Math.abs(audio[i]);
          }
          const score = Math.min(100, Math.floor(maxVal * 1000));
          
          if (score > 80) {
            setFeedback("Perfect! 완벽한 기합입니다! 🔥");
          } else if (score > 40) {
            setFeedback("Good! 소리가 조금 더 크면 좋겠어요. 👍");
          } else {
            setFeedback("조금 더 단전에서부터 소리를 내보세요!");
          }
          setIntensity(0);
        },
        onVADMisfire: () => {
          setFeedback("소리가 너무 작거나 짧습니다.");
          setIntensity(0);
        }
      });
      
      newVad.start();
      setMyVad(newVad);
      setIsListening(true);
      setFeedback("준비 완료! 베기와 함께 기합을 넣어보세요.");
    } catch (err) {
      console.error("VAD init error", err);
      setFeedback("마이크 접근에 실패했습니다.");
    }
  };

  return (
    <div className={`p-6 rounded-xl border transition-colors ${theme === "dark" ? "bg-[#1a0f0f] border-red-900/30" : "bg-red-50 border-red-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Activity className={isListening ? "text-red-500 animate-pulse" : "text-gray-400"} />
          AI 기합(Kihap) 측정기
        </h3>
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
            isListening 
              ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:bg-red-600" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {isListening ? (
            <><MicOff size={18} /> 측정 중지</>
          ) : (
            <><Mic size={18} /> 마이크 켜기</>
          )}
        </button>
      </div>

      <div className="relative h-32 flex items-center justify-center rounded-lg bg-black/5 dark:bg-black/20 overflow-hidden">
        {isListening && intensity > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute w-32 h-32 rounded-full bg-red-500/20"
          />
        )}
        
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.p
              key={feedback}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-lg font-semibold z-10 text-center px-4 ${
                feedback.includes("Perfect") ? "text-green-600 dark:text-green-400 text-2xl" :
                feedback.includes("Good") ? "text-blue-600 dark:text-blue-400" :
                "text-gray-700 dark:text-gray-300"
              }`}
            >
              {feedback}
            </motion.p>
          ) : (
            <p className="text-gray-400 dark:text-gray-500">
              마이크를 켜고 기합 소리를 들려주세요.
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
