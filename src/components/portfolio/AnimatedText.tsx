import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <motion.p ref={ref} style={{ opacity }} className={className}>
      {text}
    </motion.p>
  );
}