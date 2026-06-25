import { FadeIn } from "./FadeIn";
import { Magnet } from "./Magnet";
import { ContactButton } from "./ContactButton";
import skullAsset from "@/assets/tengkorak12.png.asset.json";

const navLinks = ["About", "Projects", "Contact"];

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex flex-col overflow-hidden">
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between items-center px-6 md:px-12 pt-6 md:pt-8">
          <span className="font-orbitron uppercase tracking-widest text-xs md:text-sm text-[#FFB3B3]">
            frmshbi
          </span>
          <div className="flex gap-5 md:gap-10">
            {navLinks.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="font-orbitron uppercase tracking-widest font-medium text-xs md:text-sm text-[#FFB3B3] transition-colors duration-200 hover:text-[#FF0000]"
                style={{ transitionDuration: "200ms" }}
              >
                {l}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      <div className="flex-1 relative flex items-center">
        <Magnet
          padding={120}
          strength={3.5}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.5s ease-in-out"
          className="absolute left-1/2 -translate-x-1/2 z-10 top-[62%] sm:top-auto sm:bottom-0 sm:mb-4 md:mb-6"
        >
          <FadeIn delay={0.6} y={30}>
            <img
              src={skullAsset.url}
              alt="frmshbi skull emblem"
              className="w-[190px] sm:w-[250px] md:w-[320px] lg:w-[380px] select-none"
              draggable={false}
            />
          </FadeIn>
        </Magnet>

        <div className="w-full overflow-hidden px-2">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[10vw] sm:text-[11vw] md:text-[12vw] lg:text-[13.5vw]">
              Hi, i&apos;m frmshbi
            </h1>
          </FadeIn>
        </div>
      </div>

      <div className="relative z-20 flex flex-col gap-4 md:flex-row md:justify-between md:items-end pb-6 md:pb-10 px-6 md:px-12">
        <FadeIn delay={0.35} y={20}>
          <p
            className="font-space font-light uppercase tracking-wide leading-snug text-[#A69595] max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: "clamp(0.7rem, 1.2vw, 1.25rem)" }}
          >
            a fullstack engineer driven by crafting striking, high-performance, and unforgettable digital systems
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}