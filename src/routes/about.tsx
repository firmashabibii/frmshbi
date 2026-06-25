import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/portfolio/AboutSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — frmshbi" },
      { name: "description", content: "Tech dossier and biodata of frmshbi — fullstack web engineer and UI architect." },
      { property: "og:title", content: "About — frmshbi" },
      { property: "og:description", content: "Tech dossier and biodata of frmshbi." },
    ],
  }),
  component: AboutSection,
});