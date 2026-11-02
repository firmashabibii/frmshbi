import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const TARGET_TEXT = "HI, I'M FRMSHBI";
const CYBER_GLYPHS = "0123456789ABCDEF#$<>/*_";

export function AnimatedHeroTitle() {
  const [displayedText, setDisplayedText] = useState(TARGET_TEXT);
  const [isScrambling, setIsScrambling] = useState(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const runScramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const totalChars = TARGET_TEXT.length;
    let iteration = 0;
    const maxIterations = totalChars * 2.2;

    const interval = setInterval(() => {
      iteration++;

      const updated = TARGET_TEXT.split("")
        .map((char, idx) => {
          if (char === " " || char === "," || char === "'") {
            return char;
          }
          if (iteration >= idx * 1.5 + 3) {
            return char;
          }
          return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
        })
        .join("");

      setDisplayedText(updated);

      if (iteration >= maxIterations + 4) {
        clearInterval(interval);
        setDisplayedText(TARGET_TEXT);
        setIsScrambling(false);
      }
    }, 40);

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

  // Periodic autonomous cyber-glitch loop (runs smoothly on both Mobile & PC)
  useEffect(() => {
    const loopInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        runScramble();
      }
    }, 14000);

    return () => clearInterval(loopInterval);
  }, [runScramble]);

  return (
    <div className="relative inline-block mx-auto max-w-full">
      {/* 1. Laser Shimmer Light Sweep (Runs continuously on both Mobile & PC) */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-screen opacity-70">
        <motion.div
          className="h-full w-36 sm:w-64 bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.4)] to-transparent -skew-x-20"
          animate={{ x: ["-150%", "350%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 2. Unified Hero Title (Smooth, continuous gradient; zero boxed letters, zero jumping hover distortion) */}
      <motion.h1
        aria-label="Hi, I'm frmshbi"
        initial={{ opacity: 0, y: 25 }}
        animate={{ 
          opacity: 1, 
          y: [0, -5, 0] 
        }}
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" },
          y: {
            duration: 4.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        onClick={runScramble}
        className="hero-heading font-orbitron font-black uppercase tracking-tight leading-none whitespace-normal sm:whitespace-nowrap w-full text-center text-4xl sm:text-[6.5vw] md:text-[7vw] lg:text-[7.5vw] select-none pointer-events-auto cursor-pointer transition-[filter] duration-300 hover:drop-shadow-[0_0_35px_rgba(0,210,255,0.7)]"
        title="Tap or click to trigger cyber decode"
      >
        {displayedText}
      </motion.h1>
    </div>
  );
}
