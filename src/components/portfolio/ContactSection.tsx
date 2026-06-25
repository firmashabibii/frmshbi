import { Mail, Instagram, MessageSquare } from "lucide-react";
import { FadeIn } from "./FadeIn";

const inputClass =
  "w-full bg-transparent font-space text-[#E5D9D9] placeholder:text-[#6b5959] py-3 px-1 border-b border-[#FF0000]/30 outline-none transition-all duration-200 focus:border-[#FF0000] focus:[box-shadow:0_4px_18px_-2px_rgba(255,0,0,0.55)]";

const socials = [
  { label: "Email", icon: Mail, href: "mailto:hello@frmshbi.dev" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "WhatsApp", icon: MessageSquare, href: "https://wa.me/" },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative px-6 sm:px-12 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <FadeIn y={30}>
          <h2
            className="hero-heading font-black uppercase leading-none text-center md:text-left mb-12 md:mb-16"
            style={{ fontSize: "clamp(2.5rem, 9vw, 110px)" }}
          >
            Contact
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left: Form */}
          <FadeIn y={30} delay={0.1}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-6"
            >
              <input className={inputClass} type="text" name="name" placeholder="Name" required />
              <input className={inputClass} type="email" name="email" placeholder="Email" required />
              <textarea
                className={`${inputClass} resize-none min-h-[140px]`}
                name="message"
                placeholder="Message"
                required
              />
              <button
                type="submit"
                className="self-start mt-2 font-orbitron uppercase tracking-widest rounded-full text-xs sm:text-sm px-8 py-3 text-white border-2 border-[#FF0000] transition-transform hover:scale-[1.03]"
                style={{
                  background:
                    "linear-gradient(123deg, #3A0000 7%, #FF0000 37%, #990000 72%, #1A0000 100%)",
                  boxShadow:
                    "0px 4px 10px rgba(255, 0, 0, 0.25), 4px 4px 12px #CC0000 inset",
                  outlineOffset: "-3px",
                }}
              >
                Submit
              </button>
            </form>
          </FadeIn>

          {/* Right: Social Matrix */}
          <FadeIn y={30} delay={0.2}>
            <div className="flex flex-col gap-4">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 border border-[#FF0000]/25 rounded-lg bg-white/[0.015] font-orbitron uppercase tracking-widest text-sm text-[#E5D9D9] transition-all duration-300 hover:scale-[1.03] hover:border-[#FF0000] hover:text-[#FF0000] hover:[text-shadow:0_0_12px_rgba(255,0,0,0.75)] hover:[box-shadow:0_0_24px_-6px_rgba(255,0,0,0.55)]"
                >
                  <Icon className="w-5 h-5 transition-colors duration-300 group-hover:text-[#FF0000]" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}