'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedImage from '../components/AnimatedImage'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [isWhiteBackground, setIsWhiteBackground] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const intervalId = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 100) {
          clearInterval(intervalId)
          setIsWhiteBackground(true)
          setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => setShowText(true), 500)
          }, 1000)
          return 100
        }
        return prev + 1
      })
    }, 20) // 20ms * 100 = 2000ms (2 seconds)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <motion.main 
      className="flex min-h-screen flex-col items-center justify-center"
      initial={{ backgroundColor: '#000' }}
      animate={{ backgroundColor: isWhiteBackground ? '#fff' : '#000' }}
      transition={{ duration: 1 }}
    >
      <AnimatePresence>
        {isVisible && (
          <AnimatedImage src="/your-image.webm" isVisible={isVisible} />
        )}
      </AnimatePresence>
      
      {!isWhiteBackground && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 text-white text-2xl font-bold"
        >
          {percentage}%
        </motion.div>
      )}

      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center text-black"
          >
            We make it, do well
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}

