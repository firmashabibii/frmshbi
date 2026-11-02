import { useEffect, useRef } from "react";

// Authentic fullstack developer tokens, system keywords, and syntax
const CODE_TOKENS = [
  "const", "async", "await", "function", "return", "import", "export",
  "interface", "type", "0x4F", "0xFF", "0x7F", "0x1A", "200", "404", "500",
  "HTTP/2", "TLS", "GET", "POST", "API", "IoT", "wss://", "git", "npm", "dev",
  "void", "null", "true", "false", "new", "class", "try", "catch", "throw",
  "=>", "===", "&&", "||", "</>", "{", "}", "[", "]", "(", ")", ";", ":",
  "0", "1", "A", "F", "#", "$", "*", "+", "SHA256", "docker", "kernel"
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
    const fontSize = isMobile ? 11 : 12;
    const colSpacing = isMobile ? 28 : 24;
    let cols = Math.floor(width / colSpacing);

    interface Stream {
      x: number;
      y: number;
      speed: number;
      active: boolean;
      length: number;
      history: { char: string; y: number }[];
    }

    let streams: Stream[] = [];

    const initStreams = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.floor(width / colSpacing);

      streams = [];
      for (let i = 0; i < cols; i++) {
        streams.push({
          x: i * colSpacing + Math.floor(colSpacing / 2),
          y: Math.random() * -height * 1.5,
          speed: 0.75 + Math.random() * 0.9, // Gentle, calm speed
          active: Math.random() > 0.4, // Spaced out columns for airy, breathable density
          length: 6 + Math.floor(Math.random() * 10),
          history: [],
        });
      }

      // Initial pitch dark fill (#080B10)
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
    const FPS_INTERVAL = 1000 / 30; // 30 FPS for silky, battery-friendly ambient background

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      // Skip rendering if page is backgrounded in browser
      if (typeof document !== "undefined" && document.hidden) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < FPS_INTERVAL) return;
      lastTime = currentTime - (elapsed % FPS_INTERVAL);

      // Deep dark fade layer (#080B10 with 14% alpha for soft, dim trails)
      ctx.fillStyle = "rgba(8, 11, 16, 0.14)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Space Grotesk", "Orbitron", monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        if (!stream.active) {
          // Slowly activate dormant columns randomly
          if (Math.random() < 0.006) {
            stream.active = true;
            stream.y = Math.random() * -60;
            stream.speed = 0.75 + Math.random() * 0.9;
          }
          continue;
        }

        const token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];

        // 1. Soft, dim leading character ("tetapi tidak terang")
        ctx.fillStyle = "rgba(0, 210, 255, 0.17)";
        ctx.shadowColor = "rgba(0, 210, 255, 0.35)";
        ctx.shadowBlur = 4;
        ctx.fillText(token, stream.x, stream.y);

        // Reset shadow for trail performance
        ctx.shadowBlur = 0;

        // 2. Trailing subtle ghost character
        if (stream.history.length > 0) {
          const prev = stream.history[stream.history.length - 1];
          ctx.fillStyle = "rgba(0, 102, 177, 0.05)";
          ctx.fillText(prev.char, stream.x, prev.y);
        }

        stream.history.push({ char: token, y: stream.y });
        if (stream.history.length > stream.length) {
          stream.history.shift();
        }

        // Advance stream downwards
        stream.y += fontSize * stream.speed;

        // Reset when stream reaches beyond bottom
        if (stream.y > height + 60) {
          stream.y = Math.random() * -100;
          stream.speed = 0.75 + Math.random() * 0.9;
          stream.history = [];
          if (Math.random() < 0.3) {
            stream.active = false;
          }
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
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
