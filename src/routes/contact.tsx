import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/portfolio/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — frmshbi" },
      { name: "description", content: "Get in touch with frmshbi via email, Instagram, or WhatsApp." },
      { property: "og:title", content: "Contact — frmshbi" },
      { property: "og:description", content: "Get in touch with frmshbi." },
    ],
  }),
  component: ContactSection,
});