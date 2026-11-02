import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Copy, Check, Mail, Wifi, MessageSquare, Github, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AnimatedText } from "./AnimatedText";
import { FadeIn } from "./FadeIn";
import profileCutout from "@/assets/mass_transparent.png";
import logoAsset from "@/assets/logo.png";

const BIODATA = [
  { k: "FULL NAME", v: "FIRMAS HABIBI" },
  { k: "ROLE", v: "FULLSTACK ENGINEER" },
  { k: "CORE STACK", v: "REACT • NODE.JS" },
  { k: "LOCATION", v: "INDONESIA • SUMATERA UTARA" },
  { k: "FOCUS", v: "HIGH-PERFORMANCE SYSTEMS & INTERACTIVE APPS" },
] as const;

function ProfileBadge3D({ onOpenCard }: { onOpenCard: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth physics-based 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  // Dynamic shadow displacement based on light angle
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], ["22px", "-22px"]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], ["25px", "-10px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: "1000px" }}
      className="relative shrink-0 flex items-center justify-center py-4 px-2"
    >
      <motion.div
        ref={cardRef}
        onClick={onOpenCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="group relative cursor-pointer select-none flex flex-col items-center"
        title="Klik untuk membuka Kartu Nama Digital"
      >
        {/* Holographic Glowing Aura behind the body */}
        <div
          className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#0066b1]/35 via-[#00d2ff]/30 to-transparent blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"
          style={{ transform: "translateZ(-20px)" }}
        />

        {/* Dynamic 3D Floor Shadow under the cutout */}
        <motion.div
          className="absolute bottom-10 w-36 sm:w-48 h-8 rounded-full bg-black/90 blur-xl pointer-events-none"
          style={{
            transform: "translateZ(-30px)",
            x: shadowX,
            y: shadowY,
          }}
        />

        {/* Transparent 3D Body Cutout */}
        <div
          className="relative w-48 sm:w-60 h-72 sm:h-88 flex items-end justify-center pointer-events-none"
          style={{ transform: "translateZ(45px)" }}
        >
          <img
            src={profileCutout}
            alt="Firmas Habibi"
            className="w-full h-full object-contain object-bottom select-none filter contrast-[1.05] brightness-[1.02] drop-shadow-[0_0_25px_rgba(0,210,255,0.45)] drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_0_35px_rgba(0,210,255,0.7)] transition-all duration-300"
            draggable={false}
          />
        </div>

        {/* Sleek Interactive 3D Callout Tag (Clickable Trigger) */}
        <div
          className="mt-3 px-3.5 py-1.5 rounded-full bg-[#080B10]/95 border-2 border-[#00d2ff]/60 shadow-[0_0_16px_rgba(0,210,255,0.4)] flex items-center gap-2 group-hover:border-[#00d2ff] group-hover:scale-105 transition-all duration-300 pointer-events-none"
          style={{ transform: "translateZ(70px)" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
          <span className="font-orbitron text-[9px] sm:text-[10px] uppercase tracking-widest text-[#fdfdfd] font-bold">
            KLIK UNTUK KARTU NAMA
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function DigitalBusinessCardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("firmashabibi71@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
        >
          {/* Animated 3D Business Card matching user's layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotateY: -15, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotateY: 15, y: 30 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#00d2ff] bg-[#090D12] overflow-hidden select-none"
            style={{
              boxShadow:
                "0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 210, 255, 0.4), inset 0 0 35px rgba(0, 102, 177, 0.15)",
            }}
          >
            {/* Ambient Card Background Glow */}
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#00d2ff]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-[#0066b1]/20 blur-3xl pointer-events-none" />

            {/* Card Header matching screenshot */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#00d2ff]/20">
              <span className="font-orbitron uppercase tracking-widest text-xs sm:text-sm text-[#00d2ff] font-bold">
                // BIODATA
              </span>
              <div className="flex items-center gap-3">
                <span className="font-space text-xs sm:text-sm text-[#999999] tabular-nums">
                  ID_FRM205
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-[#999999] hover:text-[#00d2ff] hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Tutup Kartu Nama"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card Body: Left Photo Cutout & Right Biodata Details */}
            <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-center md:items-start">
              {/* Left Column: 3D Photo Cutout */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="relative w-44 sm:w-56 h-68 sm:h-80 flex items-end justify-center">
                  {/* Holographic Glowing Aura */}
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#0066b1]/35 via-[#00d2ff]/30 to-transparent blur-2xl pointer-events-none" />
                  <img
                    src={profileCutout}
                    alt="Firmas Habibi"
                    className="relative z-10 w-full h-full object-contain object-bottom select-none filter contrast-[1.05] brightness-[1.02] drop-shadow-[0_0_20px_rgba(0,210,255,0.45)] drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
                    draggable={false}
                  />
                </div>
                {/* ID Tag */}
                <div className="mt-3 px-3.5 py-1.5 rounded-full bg-[#080B10]/95 border border-[#00d2ff]/60 shadow-[0_0_14px_rgba(0,210,255,0.35)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
                  <span className="font-orbitron text-[9px] sm:text-[10px] uppercase tracking-widest text-[#fdfdfd] font-bold">
                    FRMSHBI // VERIFIED ID
                  </span>
                </div>
              </div>

              {/* Right Column: Biodata list + Action Buttons */}
              <div className="flex-1 w-full flex flex-col justify-between">
                <dl className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-4 gap-x-6">
                  {BIODATA.map((row) => (
                    <div key={row.k} className="contents">
                      <dt className="font-orbitron uppercase tracking-widest text-[11px] sm:text-xs text-[#00d2ff]/90 font-semibold">
                        {row.k} //
                      </dt>
                      <dd className="font-space text-sm sm:text-[15px] text-[#fdfdfd] font-medium leading-snug break-words">
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Quick Action Buttons Row */}
                <div className="mt-8 pt-4 border-t border-[#00d2ff]/20 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 min-w-[120px] py-2.5 px-3 rounded-full border border-[#00d2ff]/50 bg-white/[0.03] hover:bg-[#00d2ff]/10 text-xs font-orbitron uppercase tracking-wider text-[#fdfdfd] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-[#00d2ff]" />
                        <span className="text-[#00d2ff]">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#00d2ff]" />
                        <span>Salin Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/6289518476014/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3.5 rounded-full border border-[#00d2ff]/50 bg-white/[0.03] hover:bg-[#00d2ff]/15 text-[#fdfdfd] hover:text-[#00d2ff] text-xs font-orbitron flex items-center justify-center gap-1.5 transition-all"
                    title="WhatsApp Chat"
                  >
                    <MessageSquare className="w-4 h-4 text-[#00d2ff]" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="flex-1 min-w-[130px] py-2.5 px-4 rounded-full border-2 border-[#00d2ff] text-xs font-orbitron uppercase tracking-wider text-white font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.03]"
                    style={{
                      background:
                        "linear-gradient(135deg, #0066b1 0%, #00d2ff 50%, #fdfdfd 100%)",
                      boxShadow: "0 0 16px rgba(0, 210, 255, 0.4)",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Hubungi</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AboutSection() {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <section id="about" className="relative px-6 sm:px-12 py-20 md:py-28 min-h-screen flex flex-col items-center justify-center gap-14 md:gap-20">
      {/* Decorative ambient glow blobs */}
      <div className="hidden sm:block absolute top-10 left-10 w-48 h-48 bg-[#00d2ff]/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 left-10 w-56 h-56 bg-[#0066b1]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="hidden sm:block absolute top-10 right-10 w-48 h-48 bg-[#00d2ff]/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-56 h-56 bg-[#0066b1]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Digital Business Card Modal (Appears when clicking the photo) */}
      <DigitalBusinessCardModal isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl">
        <h2 className="hero-heading font-orbitron font-black uppercase leading-none" style={{ fontSize: "clamp(2rem, 6vw, 72px)", lineHeight: 1 }}>
          About me
        </h2>
        <AnimatedText
          className="font-space text-[#999999] max-w-[500px] mx-auto leading-relaxed"
          text="With intensive expertise in end-to-end web architecture, i focus on engineering powerful backend systems, designing pixel-perfect user interfaces, and optimizing database layers. I build robust digital products engineered to scale and stand out. Let's deploy something incredible together!"
        />
      </div>

      {/* Prior to clicking: Only the 3D Profile Body is displayed in the section! */}
      <FadeIn y={30}>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <ProfileBadge3D onOpenCard={() => setIsCardOpen(true)} />
        </div>
      </FadeIn>
    </section>
  );
}
