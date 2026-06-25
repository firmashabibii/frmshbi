import { createFileRoute } from "@tanstack/react-router";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — frmshbi" },
      { name: "description", content: "Selected client and personal projects by frmshbi." },
      { property: "og:title", content: "Projects — frmshbi" },
      { property: "og:description", content: "Selected client and personal projects by frmshbi." },
    ],
  }),
  component: ProjectsSection,
});