"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LevelUpPopupProps {
  level: string
  xp: number
  maxXp: number
  onClose: () => void
}

export default function LevelUpPopup({ level, xp, maxXp, onClose }: LevelUpPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-900 p-8 rounded-lg text-center text-white max-w-md w-full">
        <motion.h1
          className="text-4xl font-bold mb-4 text-yellow-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          LEVEL UP
        </motion.h1>
        <motion.div
          className="mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <img src="/placeholder.svg" alt="Level Badge" className="w-32 h-32 mx-auto mb-2" />
          <h2 className="text-2xl font-semibold">{level}</h2>
        </motion.div>
        <motion.div
          className="mb-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <div className="bg-gray-700 h-4 rounded-full">
            <div
              className="bg-yellow-400 h-full rounded-full"
              style={{ width: `${(xp / maxXp) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2">
            XP: {xp} / {maxXp}
          </p>
        </motion.div>
        <motion.button
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-300 transition-colors"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  )
}