import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export function Magnet({
  children,
  padding = 120,
  strength = 3.5,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0,0,0)");
  const [trans, setTrans] = useState(inactiveTransition);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const handle = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < Math.max(rect.width, rect.height) / 2 + padding) {
        setTrans(activeTransition);
        setTransform(`translate3d(${dx / strength}px, ${dy / strength}px, 0)`);
      } else {
        setTrans(inactiveTransition);
        setTransform("translate3d(0,0,0)");
      }
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [padding, strength, activeTransition, inactiveTransition, isTouch]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: isTouch ? undefined : transform, transition: isTouch ? undefined : trans, willChange: "transform" }}
    >
      {children}
    </div>
  );
}