'use client'

import { useState, useEffect } from 'react'

export function useScrollDirection() {
  const [isHidden, setIsHidden] = useState(false)
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setIsHidden(currentY > lastY && currentY > 80)
      setLastY(currentY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastY])

  return isHidden
}
