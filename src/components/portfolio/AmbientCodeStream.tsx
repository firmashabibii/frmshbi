import { useEffect, useRef } from "react";

// Authentic fullstack developer tokens, system keywords, and syntax
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
    const fontSize = isMobile ? 12 : 14;
    const colWidth = isMobile ? 22 : 26;
    let cols = Math.floor(width / colWidth);

    // Track the vertical Y index (in rows) of each column
    let drops: number[] = [];
    // Speed multiplier per column for organic parallax depth
    let speeds: number[] = [];

    const initStreams = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.floor(width / colWidth);

      drops = [];
      speeds = [];
      for (let i = 0; i < cols; i++) {
        // Distribute drops across the entire screen right from the start
        drops[i] = Math.floor(Math.random() * (height / fontSize));
        speeds[i] = 0.25 + Math.random() * 0.25; // Calm, slow, elegant speed
      }

      // Initial pitch dark fill
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
    const FPS_INTERVAL = 1000 / 30; // 30 FPS smooth & lightweight

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      if (typeof document !== "undefined" && document.hidden) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < FPS_INTERVAL) return;
      lastTime = currentTime - (elapsed % FPS_INTERVAL);

      // Smooth trailing fade into background (#080B10) with gentle persistence
      ctx.fillStyle = "rgba(8, 11, 16, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Space Grotesk", "Orbitron", monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < cols; i++) {
        // 1. Pick a random code token
        const token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
        const x = i * colWidth + colWidth / 2;
        const y = Math.floor(drops[i]) * fontSize;

        // 2. Draw glowing head character
        // Occasional bright white-cyan spark at head
        const isBrightLead = Math.random() > 0.82;
        ctx.fillStyle = isBrightLead ? "#ffffff" : "#00d2ff";
        ctx.shadowColor = "#00d2ff";
        ctx.shadowBlur = 6;
        ctx.fillText(token, x, y);

        // Reset shadow for performance
        ctx.shadowBlur = 0;

        // 3. Advance drop calmly
        drops[i] += speeds[i];

        // 4. Reset drop to top with randomized delay when it hits the bottom
        if (y > height && Math.random() > 0.98) {
          drops[i] = -Math.floor(Math.random() * 12);
          speeds[i] = 0.25 + Math.random() * 0.25;
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
      style={{ opacity: 0.38 }}
      aria-hidden="true"
    />
  );
}
