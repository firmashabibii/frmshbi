import { createFileRoute } from "@tanstack/react-router";
import { FogBackground } from "@/components/portfolio/FogBackground";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ServicesSection } from "@/components/portfolio/ServicesSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "frmshbi — fullstack" },
      { name: "description", content: "frmshbi — fullstack engineer crafting striking, high-performance, unforgettable digital systems." },
      { property: "og:title", content: "frmshbi — fullstack" },
      { property: "og:description", content: "Fullstack engineer crafting striking, high-performance digital systems." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative font-space text-[#E5D9D9]" style={{ overflowX: "clip", backgroundColor: "#0C0C0C" }}>
      <FogBackground />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <footer className="relative py-12 px-6 md:px-12 text-center font-orbitron uppercase tracking-widest text-xs text-[#A69595]">
        © {new Date().getFullYear()} frmshbi — fullstack
      </footer>
    </main>
  );
}
