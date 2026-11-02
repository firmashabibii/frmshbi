import { useEffect, useRef } from "react";

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
    const fontSize = isMobile ? 12 : 14;
    // Neat monospace column alignment matching the 0 and 1 binary grid
    const colWidth = isMobile ? 20 : 24;
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
        speeds[i] = 0.22 + Math.random() * 0.22; // Calm, hypnotic slow speed
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

      // Smooth trailing fade for binary streams
      ctx.fillStyle = "rgba(8, 11, 16, 0.06)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px "Space Grotesk", "Orbitron", monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < cols; i++) {
        // Pure binary digits 0 and 1
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * colWidth + colWidth / 2;
        const y = Math.floor(drops[i]) * fontSize;

        // Leading digit spark
        const isBrightLead = Math.random() > 0.85;
        ctx.fillStyle = isBrightLead ? "#ffffff" : "#00d2ff";
        ctx.shadowColor = "#00d2ff";
        ctx.shadowBlur = 5;
        ctx.fillText(char, x, y);

        ctx.shadowBlur = 0;

        // Advance stream
        drops[i] += speeds[i];

        // Reset to top with organic staggered delay
        if (y > height && Math.random() > 0.98) {
          drops[i] = -Math.floor(Math.random() * 12);
          speeds[i] = 0.22 + Math.random() * 0.22;
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
        opacity: 0.3,
        maskImage:
          "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 18%, rgba(0, 0, 0, 0.35) 50%, black 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 18%, rgba(0, 0, 0, 0.35) 50%, black 80%)",
      }}
      aria-hidden="true"
    />
  );
}
