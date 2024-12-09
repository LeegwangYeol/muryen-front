"use client";
import { useEffect, useState } from "react";
import { downladaudio } from "./wma";

export default function TestPage() {
  const [myvad, setMyvad] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const vad = (window as any).vad;
      const vadInstance = await vad.MicVAD.new({
        onSpeechStart: () => {
          console.log("Speech start detected");
        },
        onSpeechEnd: (audio: Float32Array) => {
          console.log("Speech ended", audio.length);
          downladaudio(audio);
        },
      });
      await vadInstance.start();
      setMyvad(vadInstance);
      setIsRecording(true);
      console.log("VAD started successfully");
    } catch (error) {
      console.error("Error initializing VAD:", error);
    }
  };

  const stopRecording = async () => {
    if (myvad) {
      await myvad.pause();
      setIsRecording(false);
      console.log("VAD stopped");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Activity Detection Test</h1>
      <p className="mb-4">
        말씀해주세요. 음성이 감지되면 자동으로 WAV 파일로 저장됩니다.
      </p>
      <div className="space-x-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-4 py-2 rounded ${
            isRecording
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          녹음 시작
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`px-4 py-2 rounded ${
            !isRecording
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          } text-white`}
        >
          녹음 정지
        </button>
      </div>
    </div>
  );
}
