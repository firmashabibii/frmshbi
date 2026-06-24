import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, y = 25, duration = 0.65, className }: Props) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease: "easeOut" } },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "40px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}