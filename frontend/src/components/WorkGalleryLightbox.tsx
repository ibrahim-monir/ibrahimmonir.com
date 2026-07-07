'use client';

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  title: string;
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function WorkGalleryLightbox({ title, images, initialIndex, onClose }: Props) {
  const [[index, direction], setIndex] = useState<[number, number]>([initialIndex, 0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const go = (delta: number) => {
    setIndex(([current]) => {
      const next = (current + delta + images.length) % images.length;
      return [next, delta];
    });
  };

  // Every time the visible screenshot changes, scroll back to its top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
        style={{ background: "rgba(5,5,8,.92)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.82, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-12 right-0 sm:top-0 sm:-right-12 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}
          >
            <X size={20} />
          </button>

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 40px 90px -20px rgba(0,0,0,.7)" }}
          >
            <div className="relative">
              <div
                ref={scrollRef}
                className="overflow-y-auto overscroll-contain"
                style={{ background: "#0a0a0a", height: "72vh" }}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={index}
                    src={images[index]}
                    alt={`${title} — screenshot ${index + 1}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                    className="block w-full h-auto"
                  />
                </AnimatePresence>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110"
                    style={{ background: "rgba(0,0,0,.5)", color: "#fff" }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110"
                    style={{ background: "rgba(0,0,0,.5)", color: "#fff" }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4" style={{ background: "var(--bg-card, #111)" }}>
              <h3 className="font-semibold text-sm sm:text-base truncate">{title}</h3>
              {images.length > 1 && (
                <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                  {index + 1} / {images.length}
                </span>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex([i, i > index ? 1 : -1])}
                  aria-label={`Go to image ${i + 1}`}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? 22 : 8,
                    height: 8,
                    background: i === index ? "var(--primary)" : "rgba(255,255,255,.25)",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
