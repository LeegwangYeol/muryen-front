'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimatedImageProps {
  src: string
  isVisible: boolean
}

export default function AnimatedImage({ src, isVisible }: AnimatedImageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isVisible])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-64 overflow-hidden rounded-full"
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </motion.div>
  )
}

