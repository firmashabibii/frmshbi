import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const WORDS = [
  { id: "w1", text: "HI,", chars: ["H", "I", ","] },
  { id: "w2", text: "I'M", chars: ["I", "'", "M"] },
  { id: "w3", text: "FRMSHBI", chars: ["F", "R", "M", "S", "H", "B", "I"] },
];

const CYBER_GLYPHS = "01#$*+<>~%&!ΞΔΨ7";
const ALL_CHARS = WORDS.flatMap((w) => w.chars);

export function AnimatedHeroTitle() {
  const [displayedChars, setDisplayedChars] = useState<string[]>(ALL_CHARS);
  const [isScrambling, setIsScrambling] = useState(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    animTimeoutRef.current = setTimeout(() => {
      runScramble();
    }, 350);

    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  let globalCharIndex = 0;

  return (
    <div className="relative inline-block mx-auto max-w-full">
      {/* 1. Laser Shimmer Light Sweep */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-screen opacity-70">
        <motion.div
          className="h-full w-40 sm:w-60 bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.45)] to-transparent -skew-x-20"
          animate={{ x: ["-150%", "350%"] }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 2. Interactive Animated Title */}
      <h1
        aria-label="Hi, I'm frmshbi"
        className="hero-heading font-orbitron font-black uppercase tracking-tight leading-none w-full text-center text-4xl sm:text-[6.5vw] md:text-[7vw] lg:text-[7.5vw] select-none flex flex-wrap justify-center items-center gap-x-[0.32em] gap-y-[0.1em] pointer-events-auto cursor-pointer group"
        onClick={runScramble}
        title="Tap or click to re-decode"
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
                  whileHover={{
                    y: -12,
                    scale: 1.2,
                    filter:
                      "drop-shadow(0 0 35px rgba(0, 210, 255, 1)) drop-shadow(0 0 10px #ffffff) brightness(1.3)",
                    transition: { type: "spring", stiffness: 500, damping: 15 },
                  }}
                  whileTap={{
                    scale: 0.9,
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
