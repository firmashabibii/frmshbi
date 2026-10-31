import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/logo.png";

export function FloatingWaterLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Position & Physics state
  const posRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 }); // Target destination for smooth, slow lerp
  const velRef = useRef({ vx: 0, vy: 0 });
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const logoEl = logoRef.current;
    if (!container || !canvas || !logoEl) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // --- 2D FLUID HEIGHTMAP SIMULATION (Real Fluid Caustics & Waves - ZERO CIRCLE LINES) ---
    const simW = 120;
    const simH = Math.max(60, Math.floor((120 * height) / Math.max(1, width)));
    const totalSim = simW * simH;
    let heightMap1 = new Int16Array(totalSim);
    let heightMap2 = new Int16Array(totalSim);

    const offCanvas = document.createElement("canvas");
    offCanvas.width = simW;
    offCanvas.height = simH;
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
    let offImgData = offCtx ? offCtx.createImageData(simW, simH) : null;
    let offBuf32 = offImgData ? new Uint32Array(offImgData.data.buffer) : null;

    // Disturb physical water with smooth fluid displacement
    const disturbHeightmap = (px: number, py: number, radius = 5, strength = 150) => {
      const gx = Math.floor((px / Math.max(1, width)) * simW);
      const gy = Math.floor((py / Math.max(1, height)) * simH);
      const r = Math.max(2, Math.min(8, radius));

      for (let dy = -r; dy <= r; dy++) {
        const ny = gy + dy;
        if (ny < 1 || ny >= simH - 1) continue;
        const row = ny * simW;
        for (let dx = -r; dx <= r; dx++) {
          const nx = gx + dx;
          if (nx < 1 || nx >= simW - 1) continue;
          const distSq = dx * dx + dy * dy;
          if (distSq <= r * r) {
            const falloff = 1 - Math.sqrt(distSq) / r;
            heightMap1[row + nx] += Math.floor(strength * falloff);
          }
        }
      }
    };

    // Resize handler
    const resizeCanvas = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const cx = width / 2;
      const cy = height * 0.48;

      if (!isInitializedRef.current && width > 0 && height > 0) {
        posRef.current = { x: cx, y: cy };
        targetPosRef.current = { x: cx, y: cy };
        isInitializedRef.current = true;
      } else if (width > 0 && height > 0) {
        posRef.current.x = Math.max(80, Math.min(width - 80, posRef.current.x));
        posRef.current.y = Math.max(80, Math.min(height - 80, posRef.current.y));
        targetPosRef.current.x = posRef.current.x;
        targetPosRef.current.y = posRef.current.y;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Main 60fps Animation Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const logoRect = logoEl.getBoundingClientRect();
      const logoW = logoRect.width || 140;
      const logoH = logoRect.height || 140;
      const halfW = logoW / 2;
      const halfH = logoH / 2;

      // 1. POSITIONING: SMOOTH, RELAXED LERP (SLOW AND SOOTHING)
      if (isDraggingRef.current) {
        // Slow, fluid follow with gentle lag (relaxing liquid movement)
        const lerpFactor = 0.11;
        const dx = targetPosRef.current.x - posRef.current.x;
        const dy = targetPosRef.current.y - posRef.current.y;

        velRef.current.vx = dx * lerpFactor;
        velRef.current.vy = dy * lerpFactor;

        posRef.current.x += velRef.current.vx;
        posRef.current.y += velRef.current.vy;

        // Disturb physical liquid surface as logo glides
        const currentSpeed = Math.hypot(velRef.current.vx, velRef.current.vy);
        if (currentSpeed > 0.4) {
          disturbHeightmap(posRef.current.x, posRef.current.y, 5, 120);
        }
      } else {
        // Released: coast smoothly to a gentle stop and STAY THERE
        const speed = Math.hypot(velRef.current.vx, velRef.current.vy);
        if (speed > 0.04) {
          velRef.current.vx *= 0.85;
          velRef.current.vy *= 0.85;
          posRef.current.x += velRef.current.vx;
          posRef.current.y += velRef.current.vy;

          // Boundary clamping
          const marginX = halfW + 10;
          const marginYTop = halfH + 10;
          const marginYBottom = halfH + 20;

          if (posRef.current.x < marginX) {
            posRef.current.x = marginX;
            velRef.current.vx = 0;
          } else if (posRef.current.x > width - marginX) {
            posRef.current.x = width - marginX;
            velRef.current.vx = 0;
          }

          if (posRef.current.y < marginYTop) {
            posRef.current.y = marginYTop;
            velRef.current.vy = 0;
          } else if (posRef.current.y > height - marginYBottom) {
            posRef.current.y = height - marginYBottom;
            velRef.current.vy = 0;
          }
        } else {
          // Stationary at the last moved position
          velRef.current.vx = 0;
          velRef.current.vy = 0;
        }
      }

      // 2. Position FH Logo: gentle, minimal tilt
      const tilt = isDraggingRef.current
        ? Math.max(-8, Math.min(8, velRef.current.vx * 1.5))
        : 0;

      logoEl.style.transform = `translate3d(${posRef.current.x - halfW}px, ${
        posRef.current.y - halfH
      }px, 0) rotate(${tilt}deg)`;

      // 3. STEP PHYSICAL FLUID HEIGHTMAP
      for (let y = 1; y < simH - 1; y++) {
        const row = y * simW;
        for (let x = 1; x < simW - 1; x++) {
          const idx = row + x;
          let val =
            ((heightMap1[idx - 1] +
              heightMap1[idx + 1] +
              heightMap1[idx - simW] +
              heightMap1[idx + simW]) >>
              1) -
            heightMap2[idx];
          val -= val >> 5;
          heightMap2[idx] = val;
        }
      }

      const tempBuf = heightMap1;
      heightMap1 = heightMap2;
      heightMap2 = tempBuf;

      // Soft water surface caustics (Specular highlights and wave shadows)
      if (offCtx && offImgData && offBuf32) {
        const lx = -0.55;
        const ly = -0.8;

        for (let y = 1; y < simH - 1; y++) {
          const row = y * simW;
          for (let x = 1; x < simW - 1; x++) {
            const idx = row + x;
            const dx = heightMap1[idx - 1] - heightMap1[idx + 1];
            const dy = heightMap1[idx - simW] - heightMap1[idx + simW];

            const shading = dx * lx + dy * ly;

            if (shading > 4) {
              const factor = Math.min(255, shading * 1.2);
              // Caustic specular highlight: #00d2ff (0, 210, 255) gleaming toward #fdfdfd (253, 253, 253)
              const r = Math.min(253, Math.floor(factor * 0.8));
              const g = Math.min(253, Math.floor(210 + factor * 0.17));
              const b = 255;
              const a = Math.min(135, Math.floor(factor * 0.55));

              offBuf32[idx] = (a << 24) | (b << 16) | (g << 8) | r;
            } else if (shading < -5) {
              // Deep water trough shadow: #0066b1 (0, 102, 177)
              const a = Math.min(75, Math.floor(-shading * 0.35));
              offBuf32[idx] = (a << 24) | (177 << 16) | (102 << 8) | 0;
            } else {
              offBuf32[idx] = 0;
            }
          }
        }
        offCtx.putImageData(offImgData, 0, 0);
      }

      // 4. DRAW GENTLE WATER SURFACE TO CANVAS (NO CIRCLE LINES!)
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.filter = "blur(4px)";
      ctx.globalAlpha = 0.65;
      ctx.drawImage(offCanvas, 0, 0, width, height);
      ctx.restore();
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Pointer interactions (Touch on Mobile & Mouse Drag on PC)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dx = clickX - posRef.current.x;
    const dy = clickY - posRef.current.y;
    const dist = Math.hypot(dx, dy);

    const logoHitRadius = isMobile ? 80 : 100;

    if (dist < logoHitRadius) {
      // Start Dragging FH Logo
      isDraggingRef.current = true;
      setIsInteracting(true);
      dragOffsetRef.current = { x: dx, y: dy };
      targetPosRef.current = { x: posRef.current.x, y: posRef.current.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentX = e.clientX - rect.left - dragOffsetRef.current.x;
    const currentY = e.clientY - rect.top - dragOffsetRef.current.y;

    const halfW = isMobile ? 55 : 82;
    const halfH = isMobile ? 55 : 82;
    const marginX = halfW + 10;
    const marginYTop = halfH + 10;
    const marginYBottom = halfH + 20;

    // Set target position smoothly; animate loop will lerp slowly to it
    targetPosRef.current = {
      x: Math.max(marginX, Math.min(rect.width - marginX, currentX)),
      y: Math.max(marginYTop, Math.min(rect.height - marginYBottom, currentY)),
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsInteracting(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ touchAction: "none", cursor: isInteracting ? "grabbing" : "default" }}
      aria-label="Water Surface Area"
    >
      {/* 1. Real Liquid Water Caustics Canvas (Zero line circles) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 w-full h-full"
      />

      {/* 2. Calm Center FH Logo (Draggable on PC & Mobile) */}
      <div
        ref={logoRef}
        className="absolute top-0 left-0 z-20 cursor-grab active:cursor-grabbing will-change-transform"
        style={{
          width: isMobile ? "110px" : "165px",
          height: isMobile ? "110px" : "165px",
        }}
      >
        {/* Soft, calm water glow under logo */}
        <div
          className="absolute -inset-6 rounded-full blur-2xl pointer-events-none transition-all duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 210, 255, 0.30) 0%, rgba(0, 102, 177, 0.12) 50%, transparent 75%)",
            transform: isInteracting ? "scale(1.15)" : "scale(1)",
          }}
        />

        {/* The FH Emblem */}
        <img
          src={logoAsset}
          alt="FH Logo"
          draggable={false}
          className="relative z-10 w-full h-full object-contain select-none drop-shadow-[0_0_22px_rgba(0,210,255,0.55)] hover:drop-shadow-[0_0_32px_rgba(0,210,255,0.75)] transition-transform duration-300"
        />
      </div>
    </div>
  );
}
