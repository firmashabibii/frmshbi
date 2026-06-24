import { useEffect, useRef, useState } from "react";

const BASE = "https://motionsites.ai/assets/";
const FILES = [
  "hero-space-voyage-preview-eECLH3Yc.gif",
  "hero-codenest-preview-Cgppc2qV.gif",
  "hero-vex-ventures-preview-BczMFIiw.gif",
  "hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "hero-asme-preview-B_nGDnTP.gif",
  "hero-transform-data-preview-Cx5OU29N.gif",
  "hero-vitara-preview-Cjz2QYyU.gif",
  "hero-terra-preview-BFjrCr7T.gif",
  "hero-skyelite-preview-DHaZIgUv.gif",
  "hero-aethera-preview-DknSlcTa.gif",
  "hero-designpro-preview-D8c5_een.gif",
  "hero-stellar-ai-preview-D3HL6bw1.gif",
  "hero-xportfolio-preview-D4A8maiC.gif",
  "hero-orbit-web3-preview-BXt4OttD.gif",
  "hero-nexora-preview-cx5HmUgo.gif",
  "hero-evr-ventures-preview-DZxeVFEX.gif",
  "hero-planet-orbit-preview-DWAP8Z1P.gif",
  "hero-new-era-preview-CocuDUm9.gif",
  "hero-wealth-preview-B70idl_u.gif",
  "hero-luminex-preview-CxOP7ce6.gif",
  "hero-celestia-preview-0yO3jXO8.gif",
];

const ROW1 = FILES.slice(0, 11);
const ROW2 = FILES.slice(11);

function Row({ images, dir }: { images: string[]; dir: 1 | -1 }) {
  const tripled = [...images, ...images, ...images];
  return (
    <div className="flex gap-4 sm:gap-6" style={{ willChange: "transform" }}>
      {tripled.map((file, i) => (
        <img
          key={`${dir}-${i}-${file}`}
          src={BASE + file}
          alt=""
          loading="lazy"
          className="rounded-xl object-cover flex-shrink-0"
          style={{
            width: "var(--tile-w)",
            height: "var(--tile-h)",
          }}
        />
      ))}
    </div>
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const o = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (row1Ref.current) row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
    if (row2Ref.current) row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
  }, [offset]);

  return (
    <section
      ref={sectionRef}
      className="relative pt-16 sm:pt-24 md:pt-32 pb-8 overflow-hidden"
      style={{
        background: "#0C0C0C",
        ["--tile-w" as string]: "260px",
        ["--tile-h" as string]: "170px",
      }}
    >
      <style>{`@media (min-width: 768px){ section[data-marquee]{ --tile-w: 360px !important; --tile-h: 230px !important; } }`}</style>
      <div data-marquee className="flex flex-col gap-4 sm:gap-6"
        style={{ ["--tile-w" as string]: "260px", ["--tile-h" as string]: "170px" }}>
        <div ref={row1Ref}><Row images={ROW1} dir={1} /></div>
        <div ref={row2Ref}><Row images={ROW2} dir={-1} /></div>
      </div>
    </section>
  );
}