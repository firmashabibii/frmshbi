import { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, X, Trophy } from "lucide-react";

interface TerminalSnakeGameProps {
  onExit: (finalScore: number) => void;
  soundEnabled: boolean;
  playSound: (freq?: number, type?: OscillatorType, duration?: number) => void;
}

const GRID_COLS = 18;
const GRID_ROWS = 14;
const CELL_SIZE = 18; // Canvas logical size: 324 x 252

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
interface Point {
  x: number;
  y: number;
}

export function TerminalSnakeGame({ onExit, soundEnabled, playSound }: TerminalSnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Game state refs for instant loop access
  const snakeRef = useRef<Point[]>([
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 },
  ]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 12, y: 7 });
  const isGameOverRef = useRef(false);
  const isPausedRef = useRef(false);
  const scoreRef = useRef(0);

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("frmshbi_snake_highscore");
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) setHighScore(val);
      }
    }
  }, []);

  const spawnFood = useCallback((): Point => {
    const snake = snakeRef.current;
    let newFood: Point;
    let collision = true;
    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * GRID_COLS),
        y: Math.floor(Math.random() * GRID_ROWS),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      collision = snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    }
    return newFood!;
  }, []);

  const restartGame = useCallback(() => {
    snakeRef.current = [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
    ];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    scoreRef.current = 0;
    setScore(0);
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    foodRef.current = spawnFood();
    if (soundEnabled) playSound(600, "sine", 0.05);
  }, [playSound, soundEnabled, spawnFood]);

  const changeDirection = useCallback((newDir: Direction) => {
    const current = dirRef.current;
    if (newDir === "UP" && current !== "DOWN") nextDirRef.current = "UP";
    if (newDir === "DOWN" && current !== "UP") nextDirRef.current = "DOWN";
    if (newDir === "LEFT" && current !== "RIGHT") nextDirRef.current = "LEFT";
    if (newDir === "RIGHT" && current !== "LEFT") nextDirRef.current = "RIGHT";
  }, []);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault(); // Prevent modal/page scroll
      }

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          changeDirection("UP");
          break;
        case "ArrowDown":
        case "KeyS":
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "KeyA":
          changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "KeyD":
          changeDirection("RIGHT");
          break;
        case "Space":
          setIsPaused((p) => {
            isPausedRef.current = !p;
            return !p;
          });
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

  // Main game tick & draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animTimer: NodeJS.Timeout;

    const gameTick = () => {
      if (isGameOverRef.current || isPausedRef.current) {
        animTimer = setTimeout(gameTick, 110);
        return;
      }

      // 1. Move Snake
      dirRef.current = nextDirRef.current;
      const head = { ...snakeRef.current[0] };

      if (dirRef.current === "UP") head.y -= 1;
      if (dirRef.current === "DOWN") head.y += 1;
      if (dirRef.current === "LEFT") head.x -= 1;
      if (dirRef.current === "RIGHT") head.x += 1;

      // 2. Check Wall Collision
      if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
        handleGameOver();
        return;
      }

      // 3. Check Self Collision
      if (snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y)) {
        handleGameOver();
        return;
      }

      // 4. Check Food
      const newSnake = [head, ...snakeRef.current];
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const newScore = scoreRef.current + 10;
        scoreRef.current = newScore;
        setScore(newScore);

        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("frmshbi_snake_highscore", newScore.toString());
        }

        if (soundEnabled) playSound(880, "sine", 0.05);
        foodRef.current = spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      // 5. Draw Frame
      drawGame(ctx);

      animTimer = setTimeout(gameTick, 110);
    };

    const handleGameOver = () => {
      isGameOverRef.current = true;
      setIsGameOver(true);
      if (soundEnabled) playSound(180, "sawtooth", 0.2);
      drawGame(ctx);
    };

    const drawGame = (c: CanvasRenderingContext2D) => {
      const w = GRID_COLS * CELL_SIZE;
      const h = GRID_ROWS * CELL_SIZE;

      // Clear arena
      c.fillStyle = "#05080E";
      c.fillRect(0, 0, w, h);

      // Subtle grid mesh
      c.strokeStyle = "rgba(0, 210, 255, 0.06)";
      c.lineWidth = 1;
      for (let x = 0; x <= w; x += CELL_SIZE) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, h);
        c.stroke();
      }
      for (let y = 0; y <= h; y += CELL_SIZE) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }

      // Draw Food (Pulsing glowing node)
      const f = foodRef.current;
      c.save();
      c.shadowColor = "#00d2ff";
      c.shadowBlur = 12;
      c.fillStyle = "#00d2ff";
      c.beginPath();
      c.arc(f.x * CELL_SIZE + CELL_SIZE / 2, f.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2.5, 0, Math.PI * 2);
      c.fill();
      // Center highlight core
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(f.x * CELL_SIZE + CELL_SIZE / 2, f.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 5, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Draw Snake Body & Head
      const snake = snakeRef.current;
      snake.forEach((seg, idx) => {
        const px = seg.x * CELL_SIZE;
        const py = seg.y * CELL_SIZE;
        const pad = 1.5;

        if (idx === 0) {
          // Snake Head (Electric Cyan with Specular Eye)
          c.save();
          c.shadowColor = "rgba(0, 210, 255, 0.8)";
          c.shadowBlur = 10;
          c.fillStyle = "#00d2ff";
          c.beginPath();
          c.roundRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, 5);
          c.fill();

          // Small eyes
          c.fillStyle = "#060A12";
          if (dirRef.current === "RIGHT") {
            c.fillRect(px + CELL_SIZE - 5, py + 4, 2, 2);
            c.fillRect(px + CELL_SIZE - 5, py + CELL_SIZE - 6, 2, 2);
          } else if (dirRef.current === "LEFT") {
            c.fillRect(px + 3, py + 4, 2, 2);
            c.fillRect(px + 3, py + CELL_SIZE - 6, 2, 2);
          } else if (dirRef.current === "UP") {
            c.fillRect(px + 4, py + 3, 2, 2);
            c.fillRect(px + CELL_SIZE - 6, py + 3, 2, 2);
          } else {
            c.fillRect(px + 4, py + CELL_SIZE - 5, 2, 2);
            c.fillRect(px + CELL_SIZE - 6, py + CELL_SIZE - 5, 2, 2);
          }
          c.restore();
        } else {
          // Snake Body (Cyan to Cobalt Fade)
          const ratio = idx / Math.max(1, snake.length);
          c.fillStyle = ratio < 0.5 ? "#0099dd" : "#0066b1";
          c.beginPath();
          c.roundRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, 3);
          c.fill();
        }
      });
    };

    // First frame render
    drawGame(ctx);
    animTimer = setTimeout(gameTick, 110);

    return () => clearTimeout(animTimer);
  }, [highScore, playSound, soundEnabled, spawnFood]);

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
    <div className="p-3 sm:p-4 my-2 rounded-xl bg-[#06090F] border border-[#00d2ff]/30 space-y-3 font-mono select-none">
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
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
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
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-center p-4">
            <p className="font-orbitron font-black text-rose-500 text-base sm:text-lg tracking-wider">
              GAME OVER
            </p>
            <p className="text-xs text-slate-300">
              Final Score: <strong className="text-cyan-400">{score}</strong>
            </p>
            <button
              onClick={restartGame}
              className="mt-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              PLAY AGAIN
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
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
              className="w-8 h-8 rounded-md bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold"
            >
              ▲
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeDirection("LEFT")}
                className="w-8 h-8 rounded-md bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => changeDirection("DOWN")}
                className="w-8 h-8 rounded-md bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => changeDirection("RIGHT")}
                className="w-8 h-8 rounded-md bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-90 flex items-center justify-center text-xs font-bold"
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
            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => onExit(scoreRef.current)}
            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-rose-400 text-slate-300 hover:text-rose-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
