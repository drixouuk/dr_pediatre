"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsHidden(currentY > lastY.current && currentY > 100);
      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const show = () => {
    setIsHidden(false);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lastY.current = window.scrollY;
    lockTimer.current = setTimeout(() => {
      lastY.current = window.scrollY;
    }, 400);
  };

  return { isHidden, show };
}
