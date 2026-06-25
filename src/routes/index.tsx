import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/portfolio/HeroSection";

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
  return <HeroSection />;
}
