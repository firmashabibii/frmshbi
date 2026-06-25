import { Link } from "@tanstack/react-router";

const links = [
  { label: "About", to: "/about" },
  { label: "Mastery", to: "/mastery" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar() {
  return (
    <nav className="relative z-30 flex justify-between items-center px-6 md:px-12 pt-6 md:pt-8">
      <Link
        to="/"
        className="font-orbitron uppercase tracking-widest text-xs md:text-sm text-[#FFB3B3] transition-colors hover:text-[#FF0000]"
      >
        frmshbi
      </Link>
      <div className="flex gap-5 md:gap-10">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeProps={{ className: "text-[#FF0000] [text-shadow:0_0_12px_rgba(255,0,0,0.7)]" }}
            className="font-orbitron uppercase tracking-widest font-medium text-xs md:text-sm text-[#FFB3B3] transition-colors duration-200 hover:text-[#FF0000]"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}