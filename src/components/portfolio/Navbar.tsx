import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        className="font-orbitron uppercase tracking-widest text-sm md:text-base text-[#FFB3B3] transition-colors hover:text-[#FF0000] font-bold z-50"
      >
        frmshbi
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-10">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeProps={{ className: "text-[#FF0000] [text-shadow:0_0_12px_rgba(255,0,0,0.7)]" }}
            className="font-orbitron uppercase tracking-widest font-medium text-sm text-[#FFB3B3] transition-colors duration-200 hover:text-[#FF0000]"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-[#FFB3B3] hover:text-[#FF0000] z-50 transition-colors p-2"
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
            className="fixed inset-0 bg-[#0C0C0C]/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 md:hidden"
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
                  activeProps={{ className: "text-[#FF0000] [text-shadow:0_0_12px_rgba(255,0,0,0.7)]" }}
                  className="font-orbitron uppercase tracking-widest font-semibold text-2xl text-[#FFB3B3] transition-colors duration-200 hover:text-[#FF0000]"
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