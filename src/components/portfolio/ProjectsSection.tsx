import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { LiveProjectButton } from "./ContactButton";

const IMG = "https://motionsites.ai/assets/";

const PROJECTS = [
  {
    n: "01",
    kind: "Client",
    name: "Nexora Platform",
    images: [`${IMG}hero-nexora-preview-cx5HmUgo.gif`, `${IMG}hero-codenest-preview-Cgppc2qV.gif`, `${IMG}hero-stellar-ai-preview-D3HL6bw1.gif`],
  },
  {
    n: "02",
    kind: "Personal",
    name: "Orbit Web3",
    images: [`${IMG}hero-orbit-web3-preview-BXt4OttD.gif`, `${IMG}hero-planet-orbit-preview-DWAP8Z1P.gif`, `${IMG}hero-space-voyage-preview-eECLH3Yc.gif`],
  },
  {
    n: "03",
    kind: "Client",
    name: "Luminex Suite",
    images: [`${IMG}hero-luminex-preview-CxOP7ce6.gif`, `${IMG}hero-aethera-preview-DknSlcTa.gif`, `${IMG}hero-celestia-preview-0yO3jXO8.gif`],
  },
];

interface CardProps {
  project: typeof PROJECTS[number];
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  total: number;
}

function ProjectCard({ project, index, progress, range, total }: CardProps) {
  const scale = useTransform(progress, range, [1, 1 - (total - index) * 0.04]);
  return (
    <div className="sticky top-20 md:top-28" style={{ paddingTop: index * 20 }}>
      <motion.div
        style={{ scale }}
        className="rounded-[24px] sm:rounded-[40px] border-2 border-[#FF0000] bg-[#0C0C0C] p-4 sm:p-6"
      >
        <div
          className="rounded-[18px] sm:rounded-[32px]"
          style={{ boxShadow: "0 0 20px rgba(255, 0, 0, 0.15)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 sm:pb-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="font-orbitron font-black text-5xl sm:text-6xl md:text-7xl text-[#FF0000]" style={{ filter: "drop-shadow(0 0 10px rgba(255,0,0,0.4))" }}>
                {project.n}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-space text-xs uppercase tracking-widest text-[#A69595]">{project.kind}</span>
                <h3 className="font-orbitron uppercase tracking-wide text-lg sm:text-xl md:text-2xl text-white">{project.name}</h3>
              </div>
            </div>
            <LiveProjectButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
            <div className="md:col-span-2 flex flex-col gap-3 sm:gap-4">
              <img src={project.images[0]} alt={project.name} loading="lazy" className="w-full h-48 sm:h-56 object-cover rounded-2xl" />
              <img src={project.images[1]} alt={project.name} loading="lazy" className="w-full h-48 sm:h-56 object-cover rounded-2xl" />
            </div>
            <div className="md:col-span-3">
              <img src={project.images[2]} alt={project.name} loading="lazy" className="w-full h-full min-h-[200px] max-h-[480px] object-cover rounded-2xl" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] rounded-t-[30px] sm:rounded-t-[60px] -mt-8 sm:-mt-12 z-10 px-6 md:px-12 py-16 sm:py-24"
    >
      <h2 className="hero-heading font-black uppercase text-center mb-12 sm:mb-20 leading-none" style={{ fontSize: "clamp(2.5rem, 10vw, 120px)" }}>
        Projects
      </h2>
      <div ref={containerRef} className="relative max-w-6xl mx-auto">
        {PROJECTS.map((p, i) => {
          const start = i / PROJECTS.length;
          const end = 1;
          return (
            <div key={p.n} className="h-[80vh]">
              <ProjectCard project={p} index={i} progress={scrollYProgress} range={[start, end]} total={PROJECTS.length} />
            </div>
          );
        })}
      </div>
    </section>
  );
}