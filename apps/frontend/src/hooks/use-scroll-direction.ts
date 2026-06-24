"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (locked.current) return;
      const currentY = window.scrollY;
      setIsHidden(currentY > lastY.current && currentY > 100);
      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const show = () => {
    locked.current = true;
    setIsHidden(false);
    lastY.current = window.scrollY;

    const unlock = () => {
      requestAnimationFrame(() => {
        lastY.current = window.scrollY;
        locked.current = false;
      });
    };

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", unlock, { once: true });
    }
    setTimeout(unlock, 2000);
  };

  return { isHidden, show };
}
