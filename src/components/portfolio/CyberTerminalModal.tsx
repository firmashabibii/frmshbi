import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Volume2, VolumeX, CornerDownLeft, Play, ShieldAlert, Award } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

interface GuessRecord {
  guess: string;
  exact: number;
  partial: number;
}

interface CyberGameState {
  active: boolean;
  target: string;
  attemptsLeft: number;
  guesses: GuessRecord[];
}

// Lightweight Web Audio API Synthesizer (Zero asset dependencies)
function playTerminalSound(freq = 750, type: OscillatorType = "sine", duration = 0.04) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Fail silently if audio blocked by browser autoplay policy
  }
}

function playVictoryFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTerminalSound(freq, "triangle", 0.12);
    }, idx * 90);
  });
}

function generateSecretCode() {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 4).join("");
}

function evaluateGuess(target: string, guess: string) {
  let exact = 0;
  let partial = 0;
  const targetUsed = [false, false, false, false];
  const guessUsed = [false, false, false, false];

  for (let i = 0; i < 4; i++) {
    if (guess[i] === target[i]) {
      exact++;
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  for (let i = 0; i < 4; i++) {
    if (!guessUsed[i]) {
      for (let j = 0; j < 4; j++) {
        if (!targetUsed[j] && guess[i] === target[j]) {
          partial++;
          targetUsed[j] = true;
          break;
        }
      }
    }
  }

  return { exact, partial };
}

export function CyberTerminalModal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  // Mini-Game State
  const [gameState, setGameState] = useState<CyberGameState>({
    active: false,
    target: "",
    attemptsLeft: 6,
    guesses: [],
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Listen for open-cyber-terminal custom event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cyber-terminal", handleOpen);
    return () => window.removeEventListener("open-cyber-terminal", handleOpen);
  }, []);

  // Auto-scroll output to bottom
  useEffect(() => {
    if (isOpen) {
      outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen, gameState]);

  // Global Ctrl + K / Cmd + K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (soundEnabled) playTerminalSound(900, "triangle", 0.06);
    }
  }, [isOpen, soundEnabled]);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const clean = rawCmd.trim();
      const lower = clean.toLowerCase();

      if (soundEnabled) playTerminalSound(600, "sine", 0.04);

      if (!clean) return;

      // Save to command history for arrow-key navigation
      setCmdHistory((prev) => [...prev, clean]);
      setCmdIndex(-1);

      let out: React.ReactNode = null;
      const currentGameState = gameStateRef.current;

      // --- GAME IN PROGRESS HANDLER ---
      if (currentGameState.active) {
        if (lower === "quit" || lower === "exit" || lower === "abort") {
          setGameState({ active: false, target: "", attemptsLeft: 6, guesses: [] });
          out = (
            <div className="py-1 text-slate-400 font-mono text-xs">
              <span className="text-amber-400 font-bold">[GAME ABORTED]</span> Cyber Breach protocol stopped. Secret was: <span className="text-cyan-400 font-bold">{currentGameState.target}</span>.
            </div>
          );
        } else if (/^\d{4}$/.test(clean)) {
          const { exact, partial } = evaluateGuess(currentGameState.target, clean);
          const newGuesses = [...currentGameState.guesses, { guess: clean, exact, partial }];
          const newAttempts = currentGameState.attemptsLeft - 1;

          if (exact === 4) {
            // Victory!
            if (soundEnabled) playVictoryFanfare();
            setGameState({ active: false, target: "", attemptsLeft: 6, guesses: [] });
            out = (
              <div className="p-3 my-1 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-xs sm:text-sm font-mono space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Award className="w-5 h-5" />
                  <span>[BREACH SUCCESSFUL // ACCESS GRANTED]</span>
                </div>
                <p className="text-slate-200">
                  Target security cipher <span className="text-emerald-400 font-bold tracking-widest">{clean}</span> has been decrypted!
                </p>
                <div className="text-slate-400 text-xs flex flex-wrap gap-4 pt-1">
                  <span>Attempts: <strong className="text-white">{6 - newAttempts}/6</strong></span>
                  <span>Rank: <strong className="text-cyan-400">ELITE SECURITY OPERATOR</strong></span>
                  <span>Score: <strong className="text-emerald-400">{newAttempts * 250 + 250} PTS</strong></span>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  Type <span className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => executeCommand("game")}>game</span> to play another breach challenge.
                </p>
              </div>
            );
          } else if (newAttempts === 0) {
            // Game Over
            if (soundEnabled) playTerminalSound(220, "sawtooth", 0.16);
            setGameState({ active: false, target: "", attemptsLeft: 6, guesses: [] });
            out = (
              <div className="p-3 my-1 rounded-lg bg-rose-500/10 border border-rose-500/40 text-xs sm:text-sm font-mono space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>[LOCKDOWN TRIGGERED // ACCESS DENIED]</span>
                </div>
                <p className="text-slate-200">
                  Security attempts exhausted. Counter-intrusion triggered.
                </p>
                <p className="text-slate-400 text-xs">
                  Target passcode was: <span className="text-rose-400 font-bold tracking-widest">{currentGameState.target}</span>
                </p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Type <span className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => executeCommand("game")}>game</span> to retry breach.
                </p>
              </div>
            );
          } else {
            // Guess recorded, continue game
            setGameState({
              ...currentGameState,
              attemptsLeft: newAttempts,
              guesses: newGuesses,
            });

            out = (
              <div className="py-1 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-cyan-400 font-bold">GUESS #{newGuesses.length}: {clean}</span>
                  <span className="text-emerald-400 font-semibold">[EXACT: {exact}]</span>
                  <span className="text-amber-400 font-semibold">[PARTIAL: {partial}]</span>
                  <span className="text-slate-500 text-[11px]">({newAttempts} tries left)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {exact} digit{exact === 1 ? "" : "s"} in correct slot &bull; {partial} digit{partial === 1 ? "" : "s"} present but wrong slot
                </div>
              </div>
            );
          }
        } else {
          out = (
            <p className="text-amber-400 font-mono text-xs">
              Invalid cipher input: &quot;{clean}&quot;. Enter a 4-digit code (e.g. 1234) or type <span className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => executeCommand("quit")}>quit</span> to exit.
            </p>
          );
        }

        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            command: clean,
            output: out,
          },
        ]);
        return;
      }

      // --- STANDARD TERMINAL COMMANDS ---
      switch (lower) {
        case "help":
          out = (
            <div className="space-y-2 py-1 text-xs sm:text-sm">
              <p className="text-[#00d2ff] font-semibold">Available Operations:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-300">
                <div><span className="text-cyan-400 font-mono font-bold">game</span> - Cyber Breach codebreaker mini-game</div>
                <div><span className="text-cyan-400 font-mono font-bold">about</span> - Dossier & personal biodata</div>
                <div><span className="text-cyan-400 font-mono font-bold">skills</span> - Tech stack & masteries</div>
                <div><span className="text-cyan-400 font-mono font-bold">projects</span> - Production client & web apps</div>
                <div><span className="text-cyan-400 font-mono font-bold">contact</span> - Direct communication links</div>
                <div><span className="text-cyan-400 font-mono font-bold">github</span> - Direct link to GitHub profile</div>
                <div><span className="text-cyan-400 font-mono font-bold">matrix</span> - Digital cyber rain stream</div>
                <div><span className="text-cyan-400 font-mono font-bold">clear</span> - Flush terminal display</div>
                <div><span className="text-cyan-400 font-mono font-bold">exit</span> - Terminate terminal session</div>
              </div>
            </div>
          );
          break;

        case "game":
        case "play": {
          const secret = generateSecretCode();
          setGameState({
            active: true,
            target: secret,
            attemptsLeft: 6,
            guesses: [],
          });

          out = (
            <div className="p-3 my-1 rounded-xl bg-white/[0.03] border border-[#00d2ff]/30 text-xs sm:text-sm font-mono space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Play className="w-4 h-4 fill-cyan-400" />
                <span>CYBER BREACH // SECURITY KERNEL DECRYPTION</span>
              </div>
              <p className="text-slate-300">
                [OBJECTIVE] Infiltrate the security mainframe by cracking the 4-digit security code.
              </p>
              <div className="text-slate-400 text-xs space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/5">
                <p>&bull; Target: 4 unique digits (0-9).</p>
                <p>&bull; <strong className="text-emerald-400">EXACT</strong>: Right digit in the right position.</p>
                <p>&bull; <strong className="text-amber-400">PARTIAL</strong>: Right digit, but wrong position.</p>
                <p>&bull; Limit: <strong>6 attempts</strong> before lockdown.</p>
              </div>
              <p className="text-cyan-300 text-xs">
                Type your 4-digit guess below (e.g. 1234) or use the touch keypad. Type <span className="underline cursor-pointer" onClick={() => executeCommand("quit")}>quit</span> to abort.
              </p>
            </div>
          );
          break;
        }

        case "about":
          out = (
            <div className="space-y-2 py-1 border-l-2 border-[#00d2ff] pl-3 text-xs sm:text-sm">
              <p className="text-[#fdfdfd] font-bold">FIRMAS HABIBI (frmshbi)</p>
              <p className="text-slate-300">
                Fullstack Engineer crafting high-performance, unforgettable digital systems with cutting-edge UI physics and rock-solid backend infrastructure.
              </p>
              <p className="text-slate-400 text-xs">
                LOCATION: Sumatera Utara, Indonesia &bull; FOCUS: React, Node.js, IoT, Cloud & UI Systems
              </p>
            </div>
          );
          break;

        case "skills":
          out = (
            <div className="space-y-2.5 py-1 text-xs sm:text-sm">
              <p className="text-[#00d2ff] font-semibold">Technical Dossier & Proficiency:</p>
              <div className="space-y-1.5 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>IOT / EMBEDDED SYSTEMS</span>
                    <span className="text-cyan-400">85%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0066b1] to-[#00d2ff] h-full w-[85%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>REACT / FRONTEND ARCHITECTURE</span>
                    <span className="text-cyan-400">80%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0066b1] to-[#00d2ff] h-full w-[80%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>DATABASE (SQL & NOSQL)</span>
                    <span className="text-cyan-400">75%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0066b1] to-[#00d2ff] h-full w-[75%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>TAILWIND CSS / UI ENGINEERING</span>
                    <span className="text-cyan-400">70%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0066b1] to-[#00d2ff] h-full w-[70%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>NODE.JS / BACKEND ARCHITECTURE</span>
                    <span className="text-cyan-400">65%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0066b1] to-[#00d2ff] h-full w-[65%]" />
                  </div>
                </div>
              </div>
            </div>
          );
          break;

        case "projects":
          out = (
            <div className="space-y-3 py-1 text-xs sm:text-sm">
              <p className="text-[#00d2ff] font-semibold">Featured Production Builds:</p>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#fdfdfd] font-bold">01 // Kampung Bakau Ecotourism</span>
                    <a
                      href="https://github.com/firmashabibii/kampungbakau23"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00d2ff] hover:underline text-xs"
                    >
                      GitHub &rarr;
                    </a>
                  </div>
                  <p className="text-slate-400 text-xs">Mangrove conservation & ecotourism platform with visitor interactive features.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#fdfdfd] font-bold">02 // MyAlQuran Digital App</span>
                    <a
                      href="https://github.com/firmashabibii/myalquran"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00d2ff] hover:underline text-xs"
                    >
                      GitHub &rarr;
                    </a>
                  </div>
                  <p className="text-slate-400 text-xs">Interactive digital Al-Quran with rapid search interface and responsive reading aids.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#fdfdfd] font-bold">03 // DT. Wijaya Celluler IMS</span>
                    <a
                      href="https://github.com/firmashabibii/dtwijaya-celuler"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00d2ff] hover:underline text-xs"
                    >
                      GitHub &rarr;
                    </a>
                  </div>
                  <p className="text-slate-400 text-xs">Comprehensive point-of-sale & inventory management with secure authentication.</p>
                </div>
              </div>
            </div>
          );
          break;

        case "contact":
          out = (
            <div className="space-y-2 py-1 text-xs sm:text-sm">
              <p className="text-[#00d2ff] font-semibold">Direct Communication Channels:</p>
              <div className="space-y-1.5 text-slate-300">
                <div>
                  <span className="text-slate-400">WhatsApp: </span>
                  <a href="https://wa.me/6289518476014" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                    +62 895-1847-6014 &rarr;
                  </a>
                </div>
                <div>
                  <span className="text-slate-400">Email: </span>
                  <a href="mailto:firmashabibi71@gmail.com" className="text-cyan-400 hover:underline">
                    firmashabibi71@gmail.com &rarr;
                  </a>
                </div>
                <div>
                  <span className="text-slate-400">Instagram: </span>
                  <a href="https://www.instagram.com/frmshbi/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                    @frmshbi &rarr;
                  </a>
                </div>
              </div>
            </div>
          );
          break;

        case "github":
          window.open("https://github.com/firmashabibii", "_blank");
          out = (
            <p className="text-cyan-400 text-xs sm:text-sm">
              Opening GitHub profile <a href="https://github.com/firmashabibii" target="_blank" rel="noreferrer" className="underline">github.com/firmashabibii</a>...
            </p>
          );
          break;

        case "matrix":
          setIsMatrixMode((prev) => !prev);
          out = (
            <p className="text-emerald-400 font-mono text-xs">
              [HACKER MATRIX STREAM TOGGLED] // Visual cyber rain active.
            </p>
          );
          break;

        case "clear":
          setHistory([]);
          return;

        case "exit":
          setIsOpen(false);
          return;

        default:
          if (lower.startsWith("sudo")) {
            out = (
              <p className="text-amber-400 font-mono text-xs">
                [ACCESS DENIED] ROOT RESTRICTED: Operation denied by system security policy.
              </p>
            );
          } else {
            out = (
              <p className="text-rose-400 font-mono text-xs">
                command not found: &quot;{clean}&quot;. Type <span className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => executeCommand("help")}>help</span> to view available operations.
              </p>
            );
          }
      }

      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          command: clean,
          output: out,
        },
      ]);
    },
    [soundEnabled]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(nextIndex);
      setInputVal(cmdHistory[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistory.length === 0 || cmdIndex === -1) return;
      const nextIndex = cmdIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setCmdIndex(-1);
        setInputVal("");
      } else {
        setCmdIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex] || "");
      }
    }
  };

  const quickPills = ["help", "game", "skills", "projects", "about", "contact", "matrix", "clear"];

  return (
    <>
      {/* 1. Floating Cyber HUD Trigger on Subpages (Bottom Right) */}
      {!isHome && (
        <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 pointer-events-auto">
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#080B10]/90 backdrop-blur-xl border border-[#00d2ff]/40 shadow-[0_0_22px_rgba(0,210,255,0.3)] hover:border-[#00d2ff] hover:shadow-[0_0_35px_rgba(0,210,255,0.6)] transition-all cursor-pointer"
            title="Buka Cyber Terminal (Ctrl + K)"
          >
            {/* Animated pulse halo */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#0066b1] via-[#00d2ff] to-[#fdfdfd] opacity-25 blur group-hover:opacity-75 transition duration-500 animate-pulse" />
            
            <div className="relative flex items-center gap-2 z-10">
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#00d2ff]/20 text-[#00d2ff]">
                <Terminal className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              </div>
              <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-200 group-hover:text-cyan-300">
                Terminal
              </span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 bg-white/10 rounded border border-white/20">
                Ctrl K
              </kbd>
            </div>
          </motion.button>
        </div>
      )}

      {/* 2. Fullscreen Cyber Terminal Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Terminal Window Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="relative w-full max-w-3xl max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-2xl bg-[#070A0F]/95 border border-[#00d2ff]/40 shadow-[0_0_60px_rgba(0,210,255,0.25)] overflow-hidden font-mono z-10"
              style={{
                boxShadow: "0 0 50px rgba(0, 210, 255, 0.25), inset 0 0 25px rgba(0, 102, 177, 0.1)",
              }}
            >
              {/* Optional Matrix Cyber Rain Stream Layer */}
              {isMatrixMode && (
                <div className="pointer-events-none absolute inset-0 z-0 opacity-15 overflow-hidden text-emerald-400 text-[10px] leading-3 select-none flex flex-wrap break-all p-2">
                  {"010101010101FRMSHBI_SYSTEM_KERNEL_INITIALIZE_ONLINE_BUFFER_OVERFLOW_PASS_SECURE_ENCRYPTED_SHA256_REACT_TAILWIND_NODEJS_IOT_SUMATERA_INDONESIA_FULLSTACK".repeat(30)}
                </div>
              )}

              {/* Window Header */}
              <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-[#00d2ff]/25 bg-[#0A0E17]">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-[#00d2ff]" />
                  <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    frmshbi // dev-cli
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled((prev) => !prev)}
                    className="p-1.5 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                    title={soundEnabled ? "Mute SFX" : "Enable SFX"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 transition-colors"
                    title="Close Terminal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Command Pills (Touch-Friendly for Mobile) */}
              <div className="relative z-10 flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-[#090D14] overflow-x-auto text-[11px] no-scrollbar">
                <span className="text-slate-500 shrink-0 font-orbitron text-[10px] uppercase tracking-wider font-semibold">
                  COMMANDS //
                </span>
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => executeCommand(pill)}
                    className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-all shrink-0 cursor-pointer active:scale-95 ${
                      pill === "game"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold hover:bg-cyan-500/30 shadow-[0_0_10px_rgba(0,210,255,0.3)]"
                        : "bg-white/[0.04] border-[#00d2ff]/20 text-slate-300 hover:text-cyan-300 hover:border-[#00d2ff] hover:bg-cyan-500/10"
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Terminal Body */}
              <div
                className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm text-slate-200"
                onClick={() => inputRef.current?.focus()}
              >
                {/* Welcome Message */}
                <div className="space-y-1.5 text-slate-400 pb-2 border-b border-white/5">
                  <p className="text-cyan-400 font-bold font-orbitron text-xs sm:text-sm">
                    FRMSHBI INTERACTIVE SHELL // v2.4 (x86_64-pc-none)
                  </p>
                  <p className="text-xs">
                    Welcome to Firmas Habibi&apos;s interactive developer console. Type <span className="text-cyan-300 font-bold">&quot;help&quot;</span> or tap <span className="text-cyan-300 font-bold underline cursor-pointer" onClick={() => executeCommand("game")}>&quot;game&quot;</span> to play Cyber Breach.
                  </p>
                </div>

                {/* History list */}
                {history.map((item) => (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <span className="text-emerald-400">firmas@frmshbi</span>
                      <span className="text-slate-500">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-slate-500">$</span>
                      <span className="text-slate-100 font-normal">{item.command}</span>
                    </div>
                    <div className="pl-2 sm:pl-4">{item.output}</div>
                  </div>
                ))}

                <div ref={outputEndRef} />
              </div>

              {/* Interactive On-Screen Touch Keypad for Active Game */}
              {gameState.active && (
                <div className="relative z-10 px-4 py-2 border-t border-cyan-500/30 bg-[#06090F] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-bold">[CIPHER ACTIVE]</span>
                    <span className="text-slate-400">Attempts left:</span>
                    <span className="text-emerald-400 font-bold">{gameState.attemptsLeft}/6</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          if (inputVal.length < 4) setInputVal((prev) => prev + num);
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white/[0.06] border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/20 text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer active:scale-90"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setInputVal((prev) => prev.slice(0, -1))}
                      className="px-2 h-7 sm:h-8 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    >
                      DEL
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand("quit")}
                      className="px-2 h-7 sm:h-8 rounded bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 text-[10px] font-mono flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    >
                      QUIT
                    </button>
                  </div>
                </div>
              )}

              {/* Prompt Input Form */}
              <form
                onSubmit={handleSubmit}
                className="relative z-10 flex items-center gap-2 px-4 py-3 border-t border-[#00d2ff]/25 bg-[#090D14]"
              >
                <div className="flex items-center gap-1 text-cyan-400 shrink-0 font-bold text-xs sm:text-sm">
                  <span className="text-emerald-400">firmas@frmshbi</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-slate-500">$</span>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder={
                    gameState.active
                      ? "enter 4-digit guess (e.g. 1234) or tap keypad above..."
                      : "type command (e.g. game, skills, projects, about)..."
                  }
                  className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 outline-none text-xs sm:text-sm font-mono caret-cyan-400"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer"
                  title="Run Command"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
