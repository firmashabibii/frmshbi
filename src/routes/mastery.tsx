import { createFileRoute } from "@tanstack/react-router";
import { ServicesSection } from "@/components/portfolio/ServicesSection";

export const Route = createFileRoute("/mastery")({
  head: () => ({
    meta: [
      { title: "Mastery — frmshbi" },
      { name: "description", content: "Tech mastery and skill proficiency of frmshbi across the fullstack." },
      { property: "og:title", content: "Mastery — frmshbi" },
      { property: "og:description", content: "Tech mastery and skill proficiency across the fullstack." },
    ],
  }),
  component: ServicesSection,
});