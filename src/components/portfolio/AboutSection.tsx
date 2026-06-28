import { AnimatedText } from "./AnimatedText";
import { FadeIn } from "./FadeIn";
import profileImg from "@/assets/profile.png";

const BIODATA = [
  { k: "FULL NAME", v: "FIRMAS HABIBI" },
  { k: "ROLE", v: "FULLSTACK ENGGINEER" },
  { k: "CORE STACK", v: "REACT • NODE.JS" },
  { k: "LOCATION", v: "INDONESIA • SUMATERA UTARA" },
  { k: "FOCUS", v: "HIGH-PERFORMANCE SYSTEMS & INTERACTIVE APPS" },
] as const;

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 sm:px-12 py-20 md:py-28 min-h-screen flex flex-col items-center justify-center gap-16 md:gap-24">
      {/* Decorative ambient glow blobs replacing the broken external images */}
      <div className="hidden sm:block absolute top-10 left-10 w-48 h-48 bg-[#FF0000]/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 left-10 w-56 h-56 bg-[#FF0000]/3 rounded-full blur-[80px] pointer-events-none" />
      <div className="hidden sm:block absolute top-10 right-10 w-48 h-48 bg-[#FF0000]/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-56 h-56 bg-[#FF0000]/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl">
        <h2 className="hero-heading font-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 10vw, 120px)" }}>
          About me
        </h2>
        <AnimatedText
          className="font-space text-[#E5D9D9] max-w-[500px] mx-auto leading-relaxed"
          text="With intensive expertise in end-to-end web architecture, i focus on engineering powerful backend systems, designing pixel-perfect user interfaces, and optimizing database layers. I build robust digital products engineered to scale and stand out. Let's deploy something incredible together!"
        />
      </div>

      <FadeIn y={30}>
        <div
          className="relative z-10 w-full max-w-3xl mx-auto bg-black border border-[#FF0000]/20 p-6 sm:p-8"
          style={{ boxShadow: "0 0 40px -10px rgba(255,0,0,0.25), inset 0 0 30px rgba(255,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#FF0000]/20">
            <span className="font-orbitron uppercase tracking-widest text-[10px] sm:text-xs text-[#FF0000]/80">
              // BIODATA
            </span>
            <span className="font-space text-[10px] sm:text-xs text-[#FF0000]/50 tabular-nums">
              ID_FRM205
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Image container */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF0000] to-[#aa0000] rounded-2xl blur-sm opacity-50 group-hover:opacity-85 transition duration-300" />
              <img
                src={profileImg}
                alt="Firmas Habibi"
                className="relative w-36 h-36 md:w-44 md:h-44 object-cover rounded-2xl border-2 border-[#FF0000]/50 bg-neutral-900 animate-fade-in"
              />
            </div>

            {/* Biodata list */}
            <dl className="flex-1 w-full grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-4 gap-x-6">
              {BIODATA.map((row) => (
                <div key={row.k} className="contents">
                  <dt className="font-orbitron uppercase tracking-widest text-[11px] sm:text-xs text-[#FF0000]/70">
                    {row.k} //
                  </dt>
                  <dd className="font-space text-sm sm:text-[15px] text-white leading-snug break-words">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}