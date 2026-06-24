import { AnimatedText } from "./AnimatedText";

const FIG = "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/";

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 sm:px-12 py-16 min-h-screen flex items-center justify-center">
      <img src={`${FIG}moon.png`} alt="" className="hidden sm:block absolute top-10 left-10 w-24 md:w-32 opacity-80" />
      <img src={`${FIG}3d-object.png`} alt="" className="hidden sm:block absolute bottom-10 left-10 w-28 md:w-40 opacity-80" />
      <img src={`${FIG}lego.png`} alt="" className="hidden sm:block absolute top-10 right-10 w-24 md:w-32 opacity-80" />
      <img src={`${FIG}3d-group.png`} alt="" className="hidden sm:block absolute bottom-10 right-10 w-28 md:w-40 opacity-80" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl">
        <h2 className="hero-heading font-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 10vw, 120px)" }}>
          About me
        </h2>
        <AnimatedText
          className="font-space text-[#E5D9D9] max-w-[500px] mx-auto leading-relaxed"
          text="With intensive expertise in end-to-end web architecture, i focus on engineering powerful backend systems, designing pixel-perfect user interfaces, and optimizing database layers. I build robust digital products engineered to scale and stand out. Let's deploy something incredible together!"
        />
      </div>
    </section>
  );
}