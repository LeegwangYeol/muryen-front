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
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
