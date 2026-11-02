import { motion, Variants } from "framer-motion";
import { ContactButton, TerminalButton } from "./ContactButton";
import { FloatingWaterLogo } from "./FloatingWaterLogo";
import { AnimatedHeroTitle } from "./AnimatedHeroTitle";

const descVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 0.6, ease: "easeOut" } 
  }
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 0.75, ease: "easeOut" } 
  }
};

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-between overflow-hidden">
      {/* 1. Full-Surface Liquid Water Canvas & Roaming FH Logo (Mobile & Desktop) */}
      <FloatingWaterLogo />

      {/* 2. Top Title Header with Interactive Cyber Decode & Physics Animation */}
      <div className="relative z-10 w-full overflow-hidden px-6 md:px-12 pt-6 sm:pt-10 flex justify-center pointer-events-none">
        <AnimatedHeroTitle />
      </div>

      {/* Middle open water space for roaming */}
      <div className="flex-1 pointer-events-none" />

      {/* 3. Bottom Bio & CTA Area */}
      <div className="relative z-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-6 md:pb-10 px-6 md:px-12 pointer-events-none">
        {/* Left: Bio Text */}
        <motion.div 
          variants={descVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-auto"
        >
          <p
            className="font-space font-light uppercase tracking-wide leading-snug text-[#999999] text-center md:text-left max-w-[280px] sm:max-w-[320px] md:max-w-[280px] mx-auto md:mx-0"
            style={{ fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)" }}
          >
            a fullstack engineer driven by crafting striking, high-performance, and unforgettable digital systems
          </p>
        </motion.div>

        {/* Buttons: On mobile side-by-side in center / On desktop Terminal in exact center & Contact Me on right */}
        <div className="w-full md:w-auto flex flex-row items-center justify-center gap-3 sm:gap-4 md:contents">
          {/* Center: Terminal Button (Sejajar dengan Contact Me di Tengah) */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-6 lg:bottom-10 flex justify-center pointer-events-auto"
          >
            <TerminalButton />
          </motion.div>

          {/* Right: Contact Me Button */}
          <motion.div 
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center md:justify-end pointer-events-auto"
          >
            <ContactButton />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
