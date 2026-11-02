import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, X, Trophy } from "lucide-react";

interface TerminalSnakeGameProps {
  onExit: (finalScore: number) => void;
  soundEnabled: boolean;
  playSound: (freq?: number, type?: OscillatorType, duration?: number) => void;
}

const GRID_COLS = 18;
const GRID_ROWS = 14;
const CELL_SIZE = 18; // Logical arena: 324 x 252

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
interface Point {
  x: number;
  y: number;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }
}

export function TerminalSnakeGame({ onExit, soundEnabled, playSound }: TerminalSnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Decoupled refs for the 60fps / requestAnimationFrame engine
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  const highScoreRef = useRef(highScore);
  highScoreRef.current = highScore;

  const scoreRef = useRef(0);
  const isGameOverRef = useRef(false);
  const isPausedRef = useRef(false);

  const initialSnake: Point[] = [
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 },
  ];
  const snakeRef = useRef<Point[]>([...initialSnake]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 12, y: 7 });

  // Load high score from localStorage once
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("frmshbi_snake_highscore");
        if (saved) {
          const val = parseInt(saved, 10);
          if (!isNaN(val)) {
            setHighScore(val);
            highScoreRef.current = val;
          }
        }
      } catch {
        // Ignore localStorage restrictions
      }
    }
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    const freeSpots: Point[] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      for (let y = 0; y < GRID_ROWS; y++) {
        if (!currentSnake.some((s) => s.x === x && s.y === y)) {
          freeSpots.push({ x, y });
        }
      }
    }
    if (freeSpots.length === 0) return { x: 0, y: 0 };
    return freeSpots[Math.floor(Math.random() * freeSpots.length)];
  }, []);

  const restartGame = useCallback(() => {
    const freshSnake = [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
    ];
    snakeRef.current = freshSnake;
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    scoreRef.current = 0;
    setScore(0);
    foodRef.current = spawnFood(freshSnake);
    isPausedRef.current = false;
    setIsPaused(false);
    isGameOverRef.current = false;
    setIsGameOver(false);

    if (soundEnabledRef.current) {
      playSoundRef.current(650, "sine", 0.05);
    }
  }, [spawnFood]);

  const changeDirection = useCallback(
    (newDir: Direction) => {
      if (isGameOverRef.current) {
        restartGame();
        return;
      }
      const current = dirRef.current;
      if (newDir === "UP" && current !== "DOWN") nextDirRef.current = "UP";
      if (newDir === "DOWN" && current !== "UP") nextDirRef.current = "DOWN";
      if (newDir === "LEFT" && current !== "RIGHT") nextDirRef.current = "LEFT";
      if (newDir === "RIGHT" && current !== "LEFT") nextDirRef.current = "RIGHT";
    },
    [restartGame]
  );

  // Keyboard navigation listener (active only when snake game is loaded)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter"].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          if (isGameOverRef.current) restartGame();
          else changeDirection("UP");
          break;
        case "ArrowDown":
        case "KeyS":
          if (isGameOverRef.current) restartGame();
          else changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "KeyA":
          if (isGameOverRef.current) restartGame();
          else changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "KeyD":
          if (isGameOverRef.current) restartGame();
          else changeDirection("RIGHT");
          break;
        case "Space":
          if (isGameOverRef.current) {
            restartGame();
          } else {
            setIsPaused((p) => {
              const next = !p;
              isPausedRef.current = next;
              return next;
            });
          }
          break;
        case "Enter":
          if (isGameOverRef.current) {
            restartGame();
          }
          break;
        case "KeyR":
          restartGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, restartGame]);

  // Main Render & Loop Engine (requestAnimationFrame with timer gating)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    const TICK_INTERVAL = 110; // ms per move

    const stepGame = () => {
      dirRef.current = nextDirRef.current;
      const currentSnake = snakeRef.current;
      const head = { ...currentSnake[0] };

      if (dirRef.current === "UP") head.y -= 1;
      else if (dirRef.current === "DOWN") head.y += 1;
      else if (dirRef.current === "LEFT") head.x -= 1;
      else if (dirRef.current === "RIGHT") head.x += 1;

      // 1. Wall collision
      if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
        triggerGameOver();
        return;
      }

      // 2. Self collision (check segments 1 to end)
      for (let i = 1; i < currentSnake.length; i++) {
        if (currentSnake[i].x === head.x && currentSnake[i].y === head.y) {
          triggerGameOver();
          return;
        }
      }

      // 3. Move snake forward
      const newSnake = [head, ...currentSnake];

      // 4. Food collision check
      const food = foodRef.current;
      if (head.x === food.x && head.y === food.y) {
        const newScore = scoreRef.current + 10;
        scoreRef.current = newScore;
        setScore(newScore);

        if (newScore > highScoreRef.current) {
          highScoreRef.current = newScore;
          setHighScore(newScore);
          try {
            localStorage.setItem("frmshbi_snake_highscore", newScore.toString());
          } catch {}
        }

        if (soundEnabledRef.current) {
          playSoundRef.current(880, "sine", 0.05);
        }

        foodRef.current = spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const triggerGameOver = () => {
      isGameOverRef.current = true;
      setIsGameOver(true);
      if (soundEnabledRef.current) {
        playSoundRef.current(200, "sawtooth", 0.18);
      }
    };

    const drawFrame = () => {
      const w = GRID_COLS * CELL_SIZE;
      const h = GRID_ROWS * CELL_SIZE;

      // Clear dark background
      ctx.fillStyle = "#05080E";
      ctx.fillRect(0, 0, w, h);

      // Subtle cyber grid lines
      ctx.strokeStyle = "rgba(0, 210, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Food (Pulsing glowing node)
      const f = foodRef.current;
      ctx.save();
      ctx.shadowColor = "#00d2ff";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#00d2ff";
      ctx.beginPath();
      ctx.arc(
        f.x * CELL_SIZE + CELL_SIZE / 2,
        f.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2.6,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // White specular core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        f.x * CELL_SIZE + CELL_SIZE / 2,
        f.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 5.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Draw Snake Body & Head
      const snake = snakeRef.current;
      snake.forEach((seg, idx) => {
        const px = seg.x * CELL_SIZE;
        const py = seg.y * CELL_SIZE;
        const pad = 1.5;
        const boxSize = CELL_SIZE - pad * 2;

        if (idx === 0) {
          // Head (Electric Cyan with eyes)
          ctx.save();
          ctx.shadowColor = "rgba(0, 210, 255, 0.85)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#00d2ff";
          drawRoundedRect(ctx, px + pad, py + pad, boxSize, boxSize, 5);

          // Eyes
          ctx.fillStyle = "#050914";
          if (dirRef.current === "RIGHT") {
            ctx.fillRect(px + CELL_SIZE - 5, py + 4, 2, 2);
            ctx.fillRect(px + CELL_SIZE - 5, py + CELL_SIZE - 6, 2, 2);
          } else if (dirRef.current === "LEFT") {
            ctx.fillRect(px + 3, py + 4, 2, 2);
            ctx.fillRect(px + 3, py + CELL_SIZE - 6, 2, 2);
          } else if (dirRef.current === "UP") {
            ctx.fillRect(px + 4, py + 3, 2, 2);
            ctx.fillRect(px + CELL_SIZE - 6, py + 3, 2, 2);
          } else {
            ctx.fillRect(px + 4, py + CELL_SIZE - 5, 2, 2);
            ctx.fillRect(px + CELL_SIZE - 6, py + CELL_SIZE - 5, 2, 2);
          }
          ctx.restore();
        } else {
          // Body segments
          const ratio = idx / Math.max(1, snake.length);
          ctx.fillStyle = ratio < 0.5 ? "#0099dd" : "#0066b1";
          drawRoundedRect(ctx, px + pad, py + pad, boxSize, boxSize, 3);
        }
      });
    };

    const loop = (currentTime: number) => {
      animId = requestAnimationFrame(loop);

      const elapsed = currentTime - lastTime;
      if (elapsed >= TICK_INTERVAL) {
        lastTime = currentTime - (elapsed % TICK_INTERVAL);

        if (!isGameOverRef.current && !isPausedRef.current) {
          stepGame();
        }
        drawFrame();
      }
    };

    drawFrame();
    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [spawnFood]);

  // Touch Swipe detection on Canvas
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20) changeDirection("RIGHT");
      else if (dx < -20) changeDirection("LEFT");
    } else {
      if (dy > 20) changeDirection("DOWN");
      else if (dy < -20) changeDirection("UP");
    }
  };

  return (
    <div className="snake-game-container p-3 sm:p-4 my-2 rounded-xl bg-[#06090F] border border-[#00d2ff]/30 space-y-3 font-mono select-none outline-none" tabIndex={0}>
      {/* Game Top Status Bar */}
      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            CYBER SNAKE //
          </span>
          <span className="text-slate-300">
            SCORE: <strong className="text-cyan-300 font-bold">{score}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-400 flex items-center gap-1 text-[11px]">
            <Trophy className="w-3.5 h-3.5" />
            BEST: <strong>{highScore}</strong>
          </span>
          <button
            onClick={() => onExit(scoreRef.current)}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Keluar dari Game"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Arena Container */}
      <div className="relative flex justify-center overflow-hidden rounded-lg border border-cyan-500/20 bg-[#05080E]">
        <canvas
          ref={canvasRef}
          width={GRID_COLS * CELL_SIZE}
          height={GRID_ROWS * CELL_SIZE}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-[340px] sm:max-w-[420px] h-auto aspect-[18/14] block cursor-pointer"
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              restartGame();
            }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-center p-4 z-20 cursor-pointer"
          >
            <p className="font-orbitron font-black text-rose-500 text-base sm:text-lg tracking-wider animate-pulse">
              GAME OVER
            </p>
            <p className="text-xs text-slate-300">
              Final Score: <strong className="text-cyan-400">{score}</strong>
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                restartGame();
              }}
              className="mt-2 px-5 py-2 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 text-xs font-orbitron font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              PLAY AGAIN
            </button>
            <span className="text-[10px] text-slate-400 mt-1">
              Press SPACE / ENTER or tap here to replay
            </span>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <p className="font-orbitron font-bold text-cyan-400 text-sm tracking-widest">
              PAUSED [SPACE]
            </p>
          </div>
        )}
      </div>

      {/* Touch D-Pad for Mobile & Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Controls: <kbd className="text-cyan-300 bg-white/5 px-1 rounded">W/A/S/D</kbd> or <kbd className="text-cyan-300 bg-white/5 px-1 rounded">Arrows</kbd> &bull; Pause: <kbd className="text-cyan-300 bg-white/5 px-1 rounded">Space</kbd>
        </div>

        {/* D-PAD for Mobile / Touch Screens */}
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => changeDirection("UP")}
              className="w-9 h-9 rounded-md bg-white/[0.06] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              ▲
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeDirection("LEFT")}
                className="w-9 h-9 rounded-md bg-white/[0.06] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => changeDirection("DOWN")}
                className="w-9 h-9 rounded-md bg-white/[0.06] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => changeDirection("RIGHT")}
                className="w-9 h-9 rounded-md bg-white/[0.06] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={restartGame}
            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => onExit(scoreRef.current)}
            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-rose-400 text-slate-300 hover:text-rose-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
