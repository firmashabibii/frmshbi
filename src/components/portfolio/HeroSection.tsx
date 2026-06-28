import { motion, Variants } from "framer-motion";
import { Magnet } from "./Magnet";
import { ContactButton } from "./ContactButton";
import logoAsset from "@/assets/logo.png";

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 0.15, ease: "easeOut" } 
  }
};

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } 
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
      <div className="flex-1 relative flex flex-col items-center justify-center py-8">
        <div className="w-full overflow-hidden px-6 md:px-12">
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-normal sm:whitespace-nowrap w-full text-center text-4xl sm:text-[6.5vw] md:text-[7vw] lg:text-[7.5vw]"
          >
            Hi, i&apos;m frmshbi
          </motion.h1>
        </div>

        <Magnet
          padding={120}
          strength={3.5}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.5s ease-in-out"
          className="relative z-10 mt-6 sm:mt-8 flex justify-center w-auto"
        >
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src={logoAsset}
              alt="frmshbi emblem"
              className="w-[80px] sm:w-[120px] md:w-[150px] lg:w-[180px] select-none"
              draggable={false}
            />
          </motion.div>
        </Magnet>
      </div>

      <div className="relative z-20 flex flex-col gap-6 md:flex-row md:justify-between md:items-end pb-6 md:pb-10 px-6 md:px-12">
        <motion.div 
          variants={descVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-auto"
        >
          <p
            className="font-space font-light uppercase tracking-wide leading-snug text-[#A69595] text-center md:text-left max-w-[280px] sm:max-w-[320px] md:max-w-[280px] mx-auto md:mx-0"
            style={{ fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)" }}
          >
            a fullstack engineer driven by crafting striking, high-performance, and unforgettable digital systems
          </p>
        </motion.div>
        <motion.div 
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-auto flex justify-center md:justify-start"
        >
          <ContactButton />
        </motion.div>
      </div>
    </section>
  );
}