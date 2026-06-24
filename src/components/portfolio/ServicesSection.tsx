import { FadeIn } from "./FadeIn";

const SERVICES = [
  { n: "01", t: "Frontend Mastery", d: "Crafting lightning-fast, pixel-perfect user interfaces using React, TypeScript, and modern state management paired with fluid interactive animations." },
  { n: "02", t: "Backend Architecture", d: "Developing high-performance, secure server-side applications and RESTful/GraphQL APIs optimized for speed, security, and scalability." },
  { n: "03", t: "Database & Systems", d: "Designing relational and non-relational database architectures, optimizing query executions, and ensuring absolute data integrity." },
  { n: "04", t: "UI/UX Engineering", d: "Bridging the gap between design and clean code, transforming complex design wireframes into structural, accessible, and conversion-focused components." },
  { n: "05", t: "System Architecture", d: "Blueprinting full-stack applications with optimal design patterns, secure authentication mechanisms, inventory asset tracking solutions, and clean execution loops." },
];

export function ServicesSection() {
  return (
    <section
      className="relative bg-white text-[#0C0C0C] rounded-t-[30px] sm:rounded-t-[60px] px-6 md:px-12 py-16 sm:py-24"
    >
      <h2
        className="font-orbitron font-black uppercase text-center mb-12 sm:mb-20"
        style={{ color: "#0C0C0C", fontSize: "clamp(2.5rem, 10vw, 120px)", lineHeight: 1 }}
      >
        Services
      </h2>
      <div className="max-w-4xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.05}>
            <div
              className="flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-8 py-6 sm:py-8"
              style={{ borderTop: i === 0 ? "1px solid rgba(12, 12, 12, 0.12)" : "none", borderBottom: "1px solid rgba(12, 12, 12, 0.12)" }}
            >
              <div className="flex items-baseline gap-4 md:gap-8 md:w-1/2">
                <span className="font-orbitron font-black text-5xl sm:text-6xl md:text-7xl text-[#0C0C0C]/90">{s.n}</span>
                <h3 className="font-orbitron uppercase tracking-wider text-lg sm:text-xl md:text-2xl">{s.t}</h3>
              </div>
              <p className="font-space text-sm sm:text-base md:text-base text-[#0C0C0C]/70 md:w-1/2 md:text-right leading-relaxed">
                {s.d}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}