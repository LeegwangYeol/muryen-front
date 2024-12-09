export const downladaudio = (audioData: Float32Array) => {
  // WAV 파일 헤더 생성
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  const sampleRate = 16000; // VAD의 기본 샘플레이트

  // WAV 파일 헤더 작성
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + audioData.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, audioData.length * 2, true);

  // Float32Array를 Int16Array로 변환
  const samples = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  // 최종 WAV 파일 생성
  const blob = new Blob([wavHeader, samples], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);

  // 다운로드 링크 생성 및 클릭
  const a = document.createElement("a");
  a.href = url;
  a.download = `recorded_audio_${new Date().getTime()}.wav`;
  a.click();

  // URL 해제
  URL.revokeObjectURL(url);
};

// WAV 헤더에 문자열을 쓰는 헬퍼 함수
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
