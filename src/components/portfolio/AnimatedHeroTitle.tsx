import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const WORDS = [
  { id: "w1", text: "HI,", chars: ["H", "I", ","] },
  { id: "w2", text: "I'M", chars: ["I", "'", "M"] },
  { id: "w3", text: "FRMSHBI", chars: ["F", "R", "M", "S", "H", "B", "I"] },
];

const CYBER_GLYPHS = "0123456789ABCDEF#$<>/*_";
const ALL_CHARS = WORDS.flatMap((w) => w.chars);

export function AnimatedHeroTitle() {
  const [displayedChars, setDisplayedChars] = useState<string[]>(ALL_CHARS);
  const [isScrambling, setIsScrambling] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect genuine hover support (desktop mouse) vs mobile touch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      setCanHover(mq.matches);
      const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const runScramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const totalChars = ALL_CHARS.length;
    let iteration = 0;
    const maxIterations = totalChars * 2.5;

    const interval = setInterval(() => {
      iteration++;

      setDisplayedChars((prev) =>
        prev.map((target, idx) => {
          if (iteration >= idx * 1.8 + 4) {
            return ALL_CHARS[idx];
          }
          if (ALL_CHARS[idx] === "," || ALL_CHARS[idx] === "'") {
            return ALL_CHARS[idx];
          }
          return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
        })
      );

      if (iteration >= maxIterations + 6) {
        clearInterval(interval);
        setDisplayedChars([...ALL_CHARS]);
        setIsScrambling(false);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [isScrambling]);

  // Initial reveal decode on mount
  useEffect(() => {
    animTimeoutRef.current = setTimeout(() => {
      runScramble();
    }, 350);

    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // Periodic autonomous cyber-glitch loop (perfect for mobile where there is no cursor)
  useEffect(() => {
    const loopInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        runScramble();
      }
    }, 12000);

    return () => clearInterval(loopInterval);
  }, [runScramble]);

  let globalCharIndex = 0;

  return (
    <div className="relative inline-block mx-auto max-w-full">
      {/* 1. Laser Shimmer Light Sweep (Runs continuously on both Mobile & PC) */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-screen opacity-75">
        <motion.div
          className="h-full w-36 sm:w-64 bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.45)] to-transparent -skew-x-20"
          animate={{ x: ["-150%", "350%"] }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 2. Interactive Title (Tap-friendly on Mobile, Hover-interactive on PC) */}
      <h1
        aria-label="Hi, I'm frmshbi"
        className="hero-heading font-orbitron font-black uppercase tracking-tight leading-none w-full text-center text-4xl sm:text-[6.5vw] md:text-[7vw] lg:text-[7.5vw] select-none flex flex-wrap justify-center items-center gap-x-[0.32em] gap-y-[0.1em] pointer-events-auto cursor-pointer active:opacity-90 transition-opacity"
        onClick={runScramble}
        title="Tap or click to trigger cyber decode"
      >
        {WORDS.map((word) => (
          <span
            key={word.id}
            className="inline-flex items-center whitespace-nowrap"
          >
            {word.chars.map((char) => {
              const index = globalCharIndex++;
              const currentChar = displayedChars[index] || char;

              return (
                <motion.span
                  key={`${word.id}-${index}`}
                  aria-hidden="true"
                  className="inline-block relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #fdfdfd 0%, #00d2ff 50%, #0066b1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 22px rgba(0, 210, 255, 0.45))",
                  }}
                  initial={{ opacity: 0, y: 35, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: [0, -4, 0],
                    scale: 1,
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.1 + index * 0.04 },
                    scale: { duration: 0.6, delay: 0.1 + index * 0.04 },
                    y: {
                      duration: 3.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: index * 0.14,
                    },
                  }}
                  // Hover enabled strictly for desktop mouse users to prevent sticky-hover on mobile touch screens
                  whileHover={
                    canHover
                      ? {
                          y: -12,
                          scale: 1.2,
                          filter:
                            "drop-shadow(0 0 35px rgba(0, 210, 255, 1)) drop-shadow(0 0 10px #ffffff) brightness(1.3)",
                          transition: { type: "spring", stiffness: 500, damping: 15 },
                        }
                      : undefined
                  }
                  // Responsive touch/tap feedback for mobile & desktop
                  whileTap={{
                    scale: 0.92,
                    filter: "drop-shadow(0 0 28px rgba(0, 210, 255, 0.9)) brightness(1.2)",
                    transition: { duration: 0.1 },
                  }}
                >
                  {currentChar}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>
    </div>
  );
}
