import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/logo.png";

const links = [
  { label: "About", to: "/about" },
  { label: "Mastery", to: "/mastery" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-30 flex justify-between items-center px-6 md:px-12 pt-6 md:pt-8">
      <Link
        to="/"
        className="flex items-center gap-2.5 font-orbitron uppercase tracking-widest text-sm md:text-base text-white transition-all group font-bold z-50"
      >
        <img
          src={logoAsset}
          alt="FH Logo"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_10px_rgba(0,210,255,0.6)] group-hover:scale-105 transition-transform"
        />
        <span className="bg-gradient-to-r from-[#fdfdfd] via-[#00d2ff] to-[#0066b1] bg-clip-text text-transparent group-hover:drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]">
          frmshbi
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-10">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeProps={{ className: "text-[#00d2ff] [text-shadow:0_0_12px_rgba(0,210,255,0.85)] font-semibold" }}
            className="font-orbitron uppercase tracking-widest font-medium text-sm text-[#999999] transition-all duration-200 hover:text-[#00d2ff] hover:[text-shadow:0_0_8px_rgba(0,210,255,0.5)]"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-[#999999] hover:text-[#00d2ff] z-50 transition-colors p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#080B10]/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {links.map((l, index) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={l.to}
                  onClick={() => setIsOpen(false)}
                  activeProps={{ className: "text-[#00d2ff] [text-shadow:0_0_12px_rgba(0,210,255,0.85)]" }}
                  className="font-orbitron uppercase tracking-widest font-semibold text-2xl text-[#999999] transition-colors duration-200 hover:text-[#00d2ff]"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
