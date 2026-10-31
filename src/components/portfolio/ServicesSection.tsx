import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";

const SKILLS = [
  { label: "IOT ( INTERNET OF THINGS )", value: 85 },
  { label: "REACT / FRONTEND ARCHITECTURE", value: 80 },
  { label: "DATABASE SYSTEMS (SQL/NOSQL)", value: 75 },
  { label: "TAILWIND CSS / UI ENGINEERING", value: 70 },
  { label: "NODE.JS / BACKEND ARCHITECTURE", value: 65 },
];

function SkillBubbleCard({
  skill,
  index,
}: {
  skill: typeof SKILLS[number];
  index: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <FadeIn delay={index * 0.08}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: [-3, 3, -3],
        }}
        transition={{
          y: {
            duration: 4.5 + (index % 3) * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          },
        }}
        whileHover={{
          y: -6,
          scale: 1.02,
          transition: { type: "spring", stiffness: 350, damping: 22 },
        }}
        className="group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 select-none cursor-pointer overflow-hidden"
        style={{
          background: isHovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,210,255,0.06) 50%, rgba(0,102,177,0.14) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,210,255,0.02) 50%, rgba(0,102,177,0.06) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isHovered
            ? "1.5px solid rgba(0, 210, 255, 0.85)"
            : "1.5px solid rgba(255, 255, 255, 0.12)",
          boxShadow: isHovered
            ? "0 20px 40px -10px rgba(0, 210, 255, 0.38), 0 0 25px rgba(0, 210, 255, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -3px 15px rgba(0, 102, 177, 0.35)"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1.5px 2px rgba(255, 255, 255, 0.3), inset 0 -2px 10px rgba(0, 102, 177, 0.15)",
        }}
      >
        {/* Dynamic Cursor-following Specular Luxury Light */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 210, 255, 0.24), rgba(253, 253, 253, 0.12) 20%, transparent 70%)`,
            }}
          />
        )}

        {/* Realistic Bubble Curved Sheen Reflection (Top Highlight) */}
        <div className="pointer-events-none absolute top-0 left-6 right-6 h-1/2 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent rounded-t-2xl blur-[1px]" />

        <div className="relative z-10 flex flex-col gap-3.5">
          {/* Label & Value Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Pulsing Liquid Bubble Indicator */}
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute w-full h-full rounded-full bg-[#00d2ff] opacity-60 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-gradient-to-tr from-[#0066b1] via-[#00d2ff] to-[#fdfdfd] shadow-[0_0_8px_#00d2ff]" />
              </div>

              <span className="font-orbitron text-xs sm:text-[13px] uppercase tracking-wider text-[#999999] group-hover:text-[#fdfdfd] transition-colors duration-300 font-semibold">
                {skill.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-orbitron text-xs sm:text-sm font-bold text-[#00d2ff] group-hover:text-[#fdfdfd] tabular-nums transition-all duration-300 group-hover:[text-shadow:0_0_16px_#00d2ff,0_0_28px_rgba(0,210,255,0.8)]">
                {skill.value}%
              </span>
            </div>
          </div>

          {/* Liquid Bubble Glass Tube Progress Bar */}
          <div
            className="relative h-3 sm:h-3.5 w-full overflow-hidden rounded-full p-[1.5px]"
            style={{
              background: "rgba(3, 7, 13, 0.75)",
              border: isHovered
                ? "1px solid rgba(0, 210, 255, 0.6)"
                : "1px solid rgba(0, 210, 255, 0.22)",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Upper specular reflection along the tube */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

            <motion.div
              className="relative h-full rounded-full overflow-hidden"
              style={{
                background: "linear-gradient(90deg, #0066b1 0%, #00d2ff 65%, #fdfdfd 100%)",
                boxShadow: isHovered
                  ? "0 0 14px #00d2ff, 0 0 24px rgba(0, 210, 255, 0.8)"
                  : "0 0 8px #00d2ff, 0 0 16px rgba(0, 210, 255, 0.5)",
              }}
              initial={{ width: "0%" }}
              whileInView={{ width: `${skill.value}%` }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 + index * 0.08 }}
            >
              {/* Animated Liquid Shimmer Pulse */}
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export function ServicesSection() {
  return (
    <section
      id="mastery"
      className="relative px-6 md:px-12 py-20 sm:py-28 min-h-screen flex flex-col justify-center"
    >
      {/* Atmospheric ambient glow blobs for bubble glass refraction */}
      <div className="hidden sm:block absolute top-16 left-1/4 w-72 h-72 bg-[#00d2ff]/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-16 right-1/4 w-80 h-80 bg-[#0066b1]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto relative z-10">
        <FadeIn>
          <h2
            className="hero-heading font-orbitron font-black uppercase text-center mb-12 sm:mb-16"
            style={{ fontSize: "clamp(2rem, 6vw, 72px)", lineHeight: 1 }}
          >
            Tech Mastery
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-4 sm:gap-5">
          {SKILLS.map((s, i) => (
            <SkillBubbleCard key={s.label} skill={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
