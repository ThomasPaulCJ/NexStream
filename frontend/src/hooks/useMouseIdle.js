import { useState, useEffect, useRef } from "react"

export function useMouseIdle(delayMs = 3000) {
  const [isIdle, setIsIdle] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setIsIdle(true), delayMs)
    }
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("touchstart", resetTimer)
    resetTimer()
    return () => {
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("touchstart", resetTimer)
      clearTimeout(timer.current)
    }
  }, [delayMs])

  return isIdle
}
