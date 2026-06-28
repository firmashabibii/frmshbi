import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { GithubButton } from "./ContactButton";
import kampungbakauImg from "@/assets/kampungbakau.png";
import myalquranImg from "@/assets/myalquran.png";
import koslifeImg from "@/assets/koslife.png";

const PROJECTS = [
  {
    n: "01",
    kind: "Personal Project",
    name: "Kampung Bakau Ecotourism",
    description: "A web application built to support ecotourism and mangrove preservation at Kampung Bakau, providing information and an interactive platform for visitors.",
    github: "https://github.com/firmashabibii/kampungbakau23",
    image: kampungbakauImg,
  },
  {
    n: "02",
    kind: "Personal Project",
    name: "MyAlQuran",
    description: "An interactive digital Al-Quran web application with a search interface and reading aids designed for a seamless mobile and desktop experience.",
    github: "https://github.com/firmashabibii/myalquran",
    image: myalquranImg,
  },
  {
    n: "03",
    kind: "Personal Project",
    name: "KosLife",
    description: "A digital management platform for boarding houses (kos), streamlining room bookings, search filters, and information management for residents.",
    github: "https://github.com/firmashabibii/koslife",
    image: koslifeImg,
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
    <div
      className="sticky"
      style={{
        top: `calc(70px + ${index * 24}px)`,
        zIndex: index + 1,
      }}
    >
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
            <GithubButton href={project.github} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4 border-t border-[#FF0000]/15">
            <div className="md:col-span-2 flex flex-col justify-between gap-4">
              <p className="font-space font-light text-sm sm:text-base text-[#D4C5C5] leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="md:col-span-3 overflow-hidden rounded-2xl border border-[#FF0000]/10">
              <img
                src={project.image}
                alt={project.name}
                loading="lazy"
                className="w-full h-48 sm:h-64 md:h-[280px] object-cover object-top rounded-2xl hover:scale-[1.03] transition-transform duration-500 bg-neutral-900"
              />
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
      <div ref={containerRef} className="relative max-w-6xl mx-auto flex flex-col gap-12 sm:gap-20 md:gap-32">
        {PROJECTS.map((p, i) => {
          const start = i / PROJECTS.length;
          const end = 1;
          return (
            <ProjectCard key={p.n} project={p} index={i} progress={scrollYProgress} range={[start, end]} total={PROJECTS.length} />
          );
        })}
      </div>
    </section>
  );
}