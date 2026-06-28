import { Github } from "lucide-react";

export function ContactButton() {
  return (
    <button
      className="font-orbitron uppercase tracking-widest rounded-full text-xs sm:text-sm px-6 py-2.5 sm:px-9 sm:py-3.5 text-white border-2 border-[#FF0000] transition-transform hover:scale-[1.03]"
      style={{
        background:
          "linear-gradient(123deg, #3A0000 7%, #FF0000 37%, #990000 72%, #1A0000 100%)",
        boxShadow:
          "0px 4px 10px rgba(255, 0, 0, 0.25), 4px 4px 12px #CC0000 inset",
        outlineOffset: "-3px",
      }}
    >
      Contact Me
    </button>
  );
}

export function LiveProjectButton({ href = "#" }: { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-orbitron uppercase tracking-widest rounded-full border-2 border-[#FF0000] text-[#FF0000] px-4 py-2 text-xs sm:text-sm inline-flex items-center transition-all hover:bg-[#FF0000]/10"
      style={{ filter: "drop-shadow(0 0 8px rgba(255,0,0,0.4))" }}
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
      className="font-orbitron uppercase tracking-widest rounded-full border-2 border-[#FF0000] text-[#FF0000] px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-2 transition-all hover:bg-[#FF0000]/10"
      style={{ filter: "drop-shadow(0 0 8px rgba(255,0,0,0.4))" }}
    >
      <Github className="w-4 h-4" />
      Github
    </a>
  );
}