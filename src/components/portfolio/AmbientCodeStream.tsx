import { useEffect, useRef } from "react";

export function AmbientCodeStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    // Crisp typography sizes for razor-sharp 0 and 1 readability
    const fontSize = isMobile ? 13 : 15;
    const rowHeight = fontSize + 4;
    const colWidth = isMobile ? 20 : 25;
    let cols = Math.floor(width / colWidth);

    let drops: number[] = [];
    let speeds: number[] = [];

    const initStreams = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      cols = Math.floor(width / colWidth);

      // Support High-DPI / Retina displays to eliminate blurriness completely
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Scale context to physical pixels for vector-crisp text
      ctx.scale(dpr, dpr);

      drops = [];
      speeds = [];
      for (let i = 0; i < cols; i++) {
        drops[i] = Math.floor(Math.random() * (height / rowHeight));
        speeds[i] = 0.22 + Math.random() * 0.22; // Calm, elegant speed
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

      // Soft trailing fade (ZERO shadowBlur to prevent round blurry blobs)
      ctx.fillStyle = "rgba(8, 11, 16, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // System-level crisp monospace font so 0 and 1 are sharp and distinct
      ctx.font = `700 ${fontSize}px Consolas, Monaco, "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        // Pure crisp binary 0 and 1
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * colWidth + colWidth / 2;
        const y = Math.floor(drops[i]) * rowHeight;

        // Distinct bright electric cyan (#00d2ff) & specular silver (#fdfdfd)
        const isBrightLead = Math.random() > 0.84;
        ctx.fillStyle = isBrightLead ? "#fdfdfd" : "#00d2ff";
        ctx.fillText(char, x, y);

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
        opacity: 0.42,
        maskImage:
          "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 16%, rgba(0, 0, 0, 0.45) 45%, black 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 16%, rgba(0, 0, 0, 0.45) 45%, black 78%)",
      }}
      aria-hidden="true"
    />
  );
}
