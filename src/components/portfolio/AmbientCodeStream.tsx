import { useEffect, useRef } from "react";

// Curated authentic fullstack developer tokens & system keywords
const CODE_TOKENS = [
  "const", "async", "await", "function", "return", "import", "export",
  "interface", "type", "0x4F", "0xFF", "0x7F", "0x1A", "200", "404", "500",
  "HTTP", "TLS", "GET", "POST", "API", "IoT", "wss://", "git", "npm", "dev",
  "void", "null", "true", "false", "new", "class", "try", "catch", "throw",
  "=>", "===", "&&", "||", "</>", "{", "}", "[", "]", "(", ")", ";", ":",
  "0", "1", "A", "F", "#", "$", "*", "+", "SHA256", "docker", "kernel", "req", "res"
];

export function AmbientCodeStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 11 : 13;
    // Wider column spacing creates generous, breathable gaps between streams
    const colWidth = isMobile ? 34 : 46;
    let cols = Math.floor(width / colWidth);

    let drops: number[] = [];
    let speeds: number[] = [];

    const initStreams = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.floor(width / colWidth);

      drops = [];
      speeds = [];
      for (let i = 0; i < cols; i++) {
        drops[i] = Math.floor(Math.random() * (height / fontSize));
        speeds[i] = 0.2 + Math.random() * 0.22; // Calm, hypnotic slow speed
      }

      ctx.fillStyle = "#080B10";
      ctx.fillRect(0, 0, width, height);
    };

    initStreams();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initStreams, 150);
    };
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();
    const FPS_INTERVAL = 1000 / 30; // 30 FPS

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      if (typeof document !== "undefined" && document.hidden) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < FPS_INTERVAL) return;
      lastTime = currentTime - (elapsed % FPS_INTERVAL);

      // Smooth trailing fade
      ctx.fillStyle = "rgba(8, 11, 16, 0.055)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Space Grotesk", "Orbitron", monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < cols; i++) {
        const token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
        const x = i * colWidth + colWidth / 2;
        const y = Math.floor(drops[i]) * fontSize;

        const isBrightLead = Math.random() > 0.85;
        ctx.fillStyle = isBrightLead ? "#ffffff" : "#00d2ff";
        ctx.shadowColor = "#00d2ff";
        ctx.shadowBlur = 5;
        ctx.fillText(token, x, y);

        ctx.shadowBlur = 0;

        drops[i] += speeds[i];

        if (y > height && Math.random() > 0.98) {
          drops[i] = -Math.floor(Math.random() * 12);
          speeds[i] = 0.2 + Math.random() * 0.22;
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 w-full h-full select-none"
      style={{
        opacity: 0.26,
        maskImage:
          "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 22%, rgba(0, 0, 0, 0.35) 55%, black 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 22%, rgba(0, 0, 0, 0.35) 55%, black 85%)",
      }}
      aria-hidden="true"
    />
  );
}
