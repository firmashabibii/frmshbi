import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";

const SKILLS = [
  { label: "REACT / FRONTEND ARCHITECTURE", value: 80 },
  { label: "NODE.JS / BACKEND ARCHITECTURE", value: 65 },
  { label: "DATABASE SYSTEMS (SQL/NOSQL)", value: 75 },
  { label: "TAILWIND CSS / UI ENGINEERING", value: 70 },
];

export function ServicesSection() {
  return (
    <section
      id="mastery"
      className="relative bg-[#0C0C0C] px-6 md:px-12 py-20 sm:py-28"
    >
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <h2
            className="hero-heading font-orbitron font-black uppercase text-center mb-12 sm:mb-16"
            style={{ fontSize: "clamp(2rem, 6vw, 72px)", lineHeight: 1 }}
          >
            Tech Mastery
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-7 sm:gap-8">
          {SKILLS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-space text-xs sm:text-sm uppercase tracking-wider text-[#FFB3B3]">
                    {s.label}
                  </span>
                  <span className="font-space text-xs sm:text-sm text-[#FF0000] tabular-nums">
                    {s.value}%
                  </span>
                </div>
                <div
                  className="relative h-[3px] w-full overflow-hidden"
                  style={{
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 0, 0, 0.15)",
                  }}
                >
                  <motion.div
                    className="h-full"
                    style={{
                      backgroundColor: "#FF0000",
                      boxShadow: "0 0 8px #FF0000, 0 0 16px rgba(255, 0, 0, 0.6)",
                    }}
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${s.value}%` }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}