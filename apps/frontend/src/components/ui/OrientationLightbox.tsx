"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export default function OrientationLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <div
        className="relative h-full cursor-zoom-in overflow-hidden rounded-xl"
        onClick={() => setOpen(true)}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80"
          onClick={() => setOpen(false)}
        >
          <div className="relative h-[90vh] w-[90vw] max-w-4xl">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
