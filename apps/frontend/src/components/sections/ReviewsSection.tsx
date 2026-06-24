"use client";

import { useRef, useEffect, useState } from "react";
import { reviews } from "@/data/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`size-4 ${i <= rating ? "text-amber-400" : "text-stone-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 120;
  const displayText =
    expanded || !isLong ? review.text : review.text.slice(0, 120) + "…";

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col gap-3 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm md:w-[320px]">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${review.avatarColor} text-sm font-semibold text-white`}
        >
          {review.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-800">
            {review.author}
          </p>
          <StarRating rating={review.rating} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-xs text-stone-400">Google</span>
        </div>
      </div>

      <div className="flex-1">
        <span className="font-serif text-2xl leading-none text-primary-300">
          &ldquo;
        </span>
        <p className="-mt-1 text-sm leading-relaxed text-stone-600">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            {expanded ? "Réduire" : "Lire plus"}
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400">{review.date}</p>
    </div>
  );
}

export default function ReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const interval = setInterval(() => {
      if (paused) return;
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;
      const cardWidth = card.offsetWidth + 24;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section id="reviews" className="scroll-mt-24 bg-cream-100 py-16 md:py-20">
      <div className="mx-auto max-w-container px-4 md:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          Ce que disent nos patients
        </h2>
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <div key={r.id} className="snap-start">
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
