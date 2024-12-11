"use client";

import React from "react";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Techniques Video</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%" // 플레이어 너비를 부모 요소에 맞춤
            height="100%" // 플레이어 높이를 부모 요소에 맞춤
            playing={true} // 자동 재생 활성화
            controls={true} // 기본 컨트롤바 표시
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1, // 자동 재생 활성화 (1: 켜기, 0: 끄기)
                  modestbranding: 1, // YouTube 로고 최소화 (1: 최소화, 0: 기본)
                  rel: 0, // 관련 동영상 표시 안 함 (0: 끄기, 1: 켜기)
                  showinfo: 1, // 동영상 제목과 업로더 정보 표시 (1: 표시, 0: 숨김)
                  controls: 2, // 컨트롤바 표시 (0: 숨김, 1: 기본, 2: 향상된 컨트롤)
                  cc_load_policy: 1, // 자막 기능 활성화 (1: 켜기, 0: 끄기)
                  fs: 1, // 전체 화면 버튼 표시 (1: 표시, 0: 숨김)
                  iv_load_policy: 1, // 동영상 주석 표시 (1: 표시, 3: 숨김)
                  playsinline: 0, // 모바일에서 전체화면으로 재생 (0: 전체화면, 1: 인라인)
                },
              },
            }}
            className="w-full h-full" // Tailwind 클래스로 크기 조절
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
