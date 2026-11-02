import { Github, Terminal } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ContactButton() {
  return (
    <Link
      to="/contact"
      className="font-orbitron uppercase tracking-widest rounded-full text-xs sm:text-sm px-6 py-2.5 sm:px-9 sm:py-3.5 text-white border-2 border-[#00d2ff] transition-all duration-300 hover:scale-[1.03] inline-flex items-center justify-center font-bold tracking-wider"
      style={{
        background:
          "linear-gradient(135deg, #0066b1 0%, #00d2ff 50%, #fdfdfd 100%)",
        boxShadow:
          "0px 4px 18px rgba(0, 210, 255, 0.4), inset 0px 2px 8px rgba(253, 253, 253, 0.5)",
        outlineOffset: "-3px",
      }}
    >
      Contact Me
    </Link>
  );
}

export function TerminalButton({ onClick }: { onClick?: () => void }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-cyber-terminal"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-orbitron uppercase tracking-widest rounded-full text-xs sm:text-sm px-5 py-2.5 sm:px-8 sm:py-3.5 text-white border-2 border-[#00d2ff] transition-all duration-300 hover:scale-[1.03] inline-flex items-center justify-center gap-2 font-bold tracking-wider cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(135deg, #090F1B 0%, #002b54 50%, #00d2ff 100%)",
        boxShadow:
          "0px 4px 18px rgba(0, 210, 255, 0.4), inset 0px 2px 8px rgba(253, 253, 253, 0.3)",
        outlineOffset: "-3px",
      }}
      title="Buka Cyber Terminal (Ctrl + K)"
    >
      <Terminal className="w-4 h-4 text-cyan-300" />
      <span>Terminal</span>
      <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 bg-white/10 rounded border border-white/20">
        Ctrl K
      </kbd>
    </button>
  );
}

export function LiveProjectButton({ href = "#" }: { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-orbitron uppercase tracking-widest rounded-full border-2 border-[#00d2ff] text-[#00d2ff] px-4 py-2 text-xs sm:text-sm inline-flex items-center transition-all hover:bg-[#00d2ff]/10 hover:text-[#fdfdfd] hover:border-[#fdfdfd]"
      style={{ filter: "drop-shadow(0 0 8px rgba(0,210,255,0.45))" }}
    >
      Live Project
    </a>
  );
}

export function GithubButton({ href = "#" }: { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-orbitron uppercase tracking-widest rounded-full border-2 border-[#00d2ff] text-[#00d2ff] px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-2 transition-all hover:bg-[#00d2ff]/10 hover:text-[#fdfdfd] hover:border-[#fdfdfd]"
      style={{ filter: "drop-shadow(0 0 8px rgba(0,210,255,0.45))" }}
    >
      <Github className="w-4 h-4" />
      Github
    </a>
  );
}
