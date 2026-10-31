import { motion, Variants } from "framer-motion";
import { ContactButton } from "./ContactButton";
import { FloatingWaterLogo } from "./FloatingWaterLogo";

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 0.15, ease: "easeOut" } 
  }
};

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

      {/* 2. Top Title Header */}
      <div className="relative z-10 w-full overflow-hidden px-6 md:px-12 pt-6 sm:pt-10 pointer-events-none">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="hero-heading font-black uppercase tracking-tight leading-none whitespace-normal sm:whitespace-nowrap w-full text-center text-4xl sm:text-[6.5vw] md:text-[7vw] lg:text-[7.5vw]"
        >
          Hi, i&apos;m frmshbi
        </motion.h1>
      </div>

      {/* Middle open water space for roaming */}
      <div className="flex-1 pointer-events-none" />

      {/* 3. Bottom Bio & CTA Area */}
      <div className="relative z-20 flex flex-col gap-6 md:flex-row md:justify-between md:items-end pb-6 md:pb-10 px-6 md:px-12 pointer-events-none">
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
        <motion.div 
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-auto flex justify-center md:justify-start pointer-events-auto"
        >
          <ContactButton />
        </motion.div>
      </div>
    </section>
  );
}
