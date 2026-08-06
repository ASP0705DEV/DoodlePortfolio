import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { Play, Pause, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from "lucide-react";

export async function submitScore(game: string, score: number, durationMs?: number) {
  void track("game_play", { label: game, meta: { score }, ...(durationMs ? { durationMs } : {}) });
  try {
    await supabase.from("game_scores").insert({
      game,
      score,
      player_alias: "ASP0705 Visitor",
      duration_ms: durationMs ?? null,
    });
  } catch {
    /* fallback */
  }
}

export function useHighScores(game: string, reloadKey: number) {
  const [scores, setScores] = useState<number[]>([]);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("game_scores")
      .select("score")
      .eq("game", game)
      .order("score", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (!cancelled && data) {
          setScores(data.map((d) => d.score));
        }
      })
      .catch(() => {
        /* fallback */
      });
    return () => {
      cancelled = true;
    };
  }, [game, reloadKey]);
  return scores;
}

/* ---------------- 1. Tic Tac Toe ---------------- */

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(b: (string | null)[]) {
  for (const [a, c, d] of LINES) {
    if (b[a!] && b[a!] === b[c!] && b[a!] === b[d!]) return b[a!];
  }
  return b.every(Boolean) ? "draw" : null;
}

function bestMove(b: (string | null)[]) {
  const empty = b.map((v, i) => (v ? null : i)).filter((v) => v !== null) as number[];
  for (const i of empty) {
    const copy = [...b];
    copy[i] = "O";
    if (winnerOf(copy) === "O") return i;
  }
  for (const i of empty) {
    const copy = [...b];
    copy[i] = "X";
    if (winnerOf(copy) === "X") return i;
  }
  if (!b[4]) return 4;
  const corners = [0, 2, 6, 8].filter((i) => !b[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)]!;
  return empty[Math.floor(Math.random() * empty.length)]!;
}

export function TicTacToe({ onScore }: { onScore: (n: number) => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [status, setStatus] = useState<string | null>(null);

  const play = (i: number) => {
    if (board[i] || status) return;
    const next = [...board];
    next[i] = "X";
    let result = winnerOf(next);
    if (!result) {
      next[bestMove(next)] = "O";
      result = winnerOf(next);
    }
    setBoard(next);
    if (result) {
      setStatus(result === "draw" ? "Draw!" : result === "X" ? "You win!" : "AI wins!");
      onScore(result === "X" ? 3 : result === "draw" ? 1 : 0);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setStatus(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl border-2 border-ink bg-card font-display text-3xl font-bold doodle-shadow-sm transition-all hover:-translate-y-0.5"
          >
            <span className={cell === "X" ? "text-coral" : "text-sky"}>{cell}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="hand text-2xl">{status ?? "your move (X)"}</span>
        <button
          onClick={reset}
          className="rounded-xl border-2 border-ink bg-sun px-4 py-2 text-sm font-bold doodle-shadow-sm hover:bg-sun/80"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

/* ---------------- 2. Fixed & Touch-Friendly Snake ---------------- */

const GRID = 16;

export function Snake({ onScore }: { onScore: (n: number) => void }) {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }, { x: 7, y: 8 }]);
  const [food, setFood] = useState({ x: 4, y: 4 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const changeDir = useCallback((next: { x: number; y: number }) => {
    const d = dirRef.current;
    if (next.x === -d.x && next.y === -d.y) return;
    setDir(next);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, { x: number; y: number }> = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const next = map[k];
      if (next) {
        e.preventDefault();
        changeDir(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeDir]);

  useEffect(() => {
    if (!running || paused) return;
    const t = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0]!;
        const d = dirRef.current;
        const next = { x: head.x + d.x, y: head.y + d.y };
        
        if (
          next.x < 0 ||
          next.y < 0 ||
          next.x >= GRID ||
          next.y >= GRID ||
          prev.some((s) => s.x === next.x && s.y === next.y)
        ) {
          setRunning(false);
          setGameOver(true);
          onScore(score);
          return prev;
        }
        
        const grew = next.x === food.x && next.y === food.y;
        if (grew) {
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
          });
        }
        return [next, ...(grew ? prev : prev.slice(0, -1))];
      });
    }, 130);
    return () => clearInterval(t);
  }, [running, paused, food, score, onScore]);

  const start = () => {
    setSnake([{ x: 8, y: 8 }, { x: 7, y: 8 }]);
    setDir({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex items-center justify-between w-full px-2">
        <span className="font-display text-xl font-bold flex items-center gap-1.5">
          <Trophy className="h-5 w-5 text-sun" /> Score: {score}
        </span>
        <div className="flex items-center gap-2">
          {running && (
            <button
              onClick={() => setPaused(!paused)}
              className="rounded-xl border-2 border-ink bg-card px-3 py-1.5 text-xs font-bold doodle-shadow-sm"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            onClick={start}
            className="rounded-xl border-2 border-ink bg-lime px-4 py-1.5 text-xs font-bold doodle-shadow-sm hover:bg-lime/80"
          >
            {running ? "Restart" : "Start Game"}
          </button>
        </div>
      </div>

      <div
        className="relative grid gap-[2px] rounded-2xl border-2 border-ink bg-card p-2 doodle-shadow"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-[4px] transition-colors ${
                isHead ? "bg-ink" : isSnake ? "bg-mint" : isFood ? "bg-coral animate-bounce" : "bg-muted/40"
              }`}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 rounded-xl text-center">
            <h4 className="font-display text-2xl font-bold text-coral">Game Over!</h4>
            <p className="text-xs font-bold mt-1">Final Score: {score}</p>
            <button
              onClick={start}
              className="mt-3 rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen Touch D-Pad Controls for Phones & Tablets */}
      <div className="grid grid-cols-3 gap-2 mt-2 w-48">
        <div />
        <button
          onClick={() => changeDir({ x: 0, y: -1 })}
          className="p-3 rounded-xl border-2 border-ink bg-card doodle-shadow-sm active:bg-sun flex justify-center"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        <div />
        <button
          onClick={() => changeDir({ x: -1, y: 0 })}
          className="p-3 rounded-xl border-2 border-ink bg-card doodle-shadow-sm active:bg-sun flex justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => changeDir({ x: 0, y: 1 })}
          className="p-3 rounded-xl border-2 border-ink bg-card doodle-shadow-sm active:bg-sun flex justify-center"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
        <button
          onClick={() => changeDir({ x: 1, y: 0 })}
          className="p-3 rounded-xl border-2 border-ink bg-card doodle-shadow-sm active:bg-sun flex justify-center"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">Controls: Arrow Keys, WASD, or On-Screen D-Pad.</p>
    </div>
  );
}

/* ---------------- 3. Memory Match ---------------- */

const ICONS = ["⚛️", "🐍", "🐳", "🧠", "⚡", "🗄️", "🚀", "🧩"];

export function MemoryMatch({ onScore }: { onScore: (n: number) => void }) {
  const deck = useMemo(
    () =>
      [...ICONS, ...ICONS]
        .map((icon, i) => ({ id: i, icon }))
        .sort(() => Math.random() - 0.5),
    [],
  );
  const [cards, setCards] = useState(deck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const cardA = cards.find((c) => c.id === a);
    const cardB = cards.find((c) => c.id === b);
    setMoves((m) => m + 1);
    const t = setTimeout(() => {
      if (cardA && cardB && cardA.icon === cardB.icon) setMatched((m) => [...m, cardA.icon]);
      setFlipped([]);
    }, 600);
    return () => clearTimeout(t);
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === ICONS.length && matched.length) {
      onScore(Math.max(10, 100 - moves * 4));
    }
  }, [matched, moves, onScore]);

  const restart = () => {
    setCards([...deck].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.icon);
          return (
            <button
              key={card.id}
              onClick={() => !isOpen && flipped.length < 2 && setFlipped((f) => [...f, card.id])}
              className={`grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-2xl border-2 border-ink text-2xl doodle-shadow-sm transition-all ${
                isOpen ? "bg-sun" : "bg-card hover:bg-muted"
              }`}
            >
              {isOpen ? card.icon : "?"}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className="hand text-2xl">
          {matched.length === ICONS.length ? `solved in ${moves} moves!` : `moves ${moves}`}
        </span>
        <button
          onClick={restart}
          className="rounded-xl border-2 border-ink bg-bubble px-4 py-2 text-xs font-bold doodle-shadow-sm"
        >
          Shuffle Deck
        </button>
      </div>
    </div>
  );
}

/* ---------------- 4. Typing Speed ---------------- */

const SNIPPETS = [
  "const agent = await planner.run({ goal, tools });",
  "app.get('/api/health', (req, res) => res.json({ ok: true }));",
  "const [state, setState] = useState<Record<string, number>>({});",
  "SELECT id, title FROM projects WHERE featured = true;",
];

export function TypingSpeed({ onScore }: { onScore: (n: number) => void }) {
  const [target, setTarget] = useState(SNIPPETS[0]!);
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);

  const reset = useCallback(() => {
    setTarget(SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]!);
    setInput("");
    setStart(null);
    setWpm(null);
  }, []);

  const onChange = (value: string) => {
    if (!start) setStart(Date.now());
    setInput(value);
    if (value === target && start) {
      const minutes = (Date.now() - start) / 60000;
      const result = Math.round(target.split(" ").length / minutes);
      setWpm(result);
      onScore(result);
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <p className="w-full rounded-2xl border-2 border-ink bg-card p-4 font-mono text-sm leading-relaxed">
        {target.split("").map((ch, i) => (
          <span
            key={i}
            className={
              i < input.length
                ? input[i] === ch
                  ? "bg-mint text-ink font-bold"
                  : "bg-coral text-coral-foreground font-bold"
                : ""
            }
          >
            {ch}
          </span>
        ))}
      </p>
      <input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="start typing code snippet..."
        className="w-full rounded-xl border-2 border-ink bg-card px-4 py-3 font-mono text-sm outline-none"
      />
      <div className="flex items-center gap-3">
        <span className="hand text-2xl">{wpm ? `${wpm} WPM Speed!` : "type code accurately"}</span>
        <button
          onClick={reset}
          className="rounded-xl border-2 border-ink bg-sky px-4 py-2 text-xs font-bold text-sky-foreground doodle-shadow-sm"
        >
          Next Snippet
        </button>
      </div>
    </div>
  );
}

/* ---------------- 5. Reaction Time Test ---------------- */

export function ReactionTime({ onScore }: { onScore: (n: number) => void }) {
  const [state, setState] = useState<"idle" | "waiting" | "ready" | "done">("idle");
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setState("waiting");
    setResult(null);
    const delay = Math.floor(Math.random() * 3000) + 1500;
    timerRef.current = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("idle");
      setResult(-1);
    } else if (state === "ready") {
      const ms = Date.now() - startTime;
      setResult(ms);
      setState("done");
      onScore(Math.max(1, 1000 - ms));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div
        onClick={handleClick}
        className={`w-full h-48 rounded-2xl border-2 border-ink p-6 cursor-pointer flex flex-col items-center justify-center doodle-shadow transition-colors ${
          state === "idle"
            ? "bg-sun text-ink"
            : state === "waiting"
            ? "bg-coral text-coral-foreground"
            : state === "ready"
            ? "bg-mint text-ink animate-pulse"
            : "bg-card text-ink"
        }`}
      >
        <Zap className="h-8 w-8 mb-2" />
        <h3 className="font-display text-xl font-bold">
          {state === "idle"
            ? "Click to Start Reaction Test"
            : state === "waiting"
            ? "Wait for GREEN..."
            : state === "ready"
            ? "CLICK NOW!"
            : `${result} ms`}
        </h3>
        <p className="text-xs mt-1 text-center font-semibold">
          {state === "waiting"
            ? "Don't click yet!"
            : state === "done"
            ? `Your reaction speed is ${result} milliseconds!`
            : result === -1
            ? "Too early! Click to try again."
            : "Test your brain response time."}
        </p>
      </div>

      <button
        onClick={startTest}
        className="rounded-xl border-2 border-ink bg-lime px-5 py-2 text-xs font-bold doodle-shadow-sm hover:bg-lime/80"
      >
        {state === "done" || result === -1 ? "Try Again" : "Start Reaction Test"}
      </button>
    </div>
  );
}

/* ---------------- 6. Whack-a-Mole ---------------- */

export function WhackAMole({ onScore }: { onScore: (n: number) => void }) {
  const [score, setScore] = useState(0);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const moleTimer = setInterval(() => {
      setMoleIndex(Math.floor(Math.random() * 9));
    }, 700);

    const clockTimer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPlaying(false);
          setMoleIndex(null);
          onScore(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(moleTimer);
      clearInterval(clockTimer);
    };
  }, [playing, score, onScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setPlaying(true);
  };

  const whack = (i: number) => {
    if (playing && i === moleIndex) {
      setScore((s) => s + 10);
      setMoleIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <div className="flex items-center justify-between w-full text-sm font-bold">
        <span>⏱️ Time: {timeLeft}s</span>
        <span>🎯 Score: {score}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => whack(i)}
            className={`h-20 rounded-2xl border-2 border-ink doodle-shadow-sm flex items-center justify-center text-3xl transition-transform active:scale-95 ${
              i === moleIndex ? "bg-sun animate-bounce" : "bg-card"
            }`}
          >
            {i === moleIndex ? "🦔" : "🕳️"}
          </button>
        ))}
      </div>

      <button
        onClick={startGame}
        className="rounded-xl border-2 border-ink bg-mint px-5 py-2 text-xs font-bold doodle-shadow-sm hover:bg-mint/80"
      >
        {playing ? "Restart Game" : "Start Whack-a-Mole"}
      </button>
    </div>
  );
}

/* ---------------- 7. Simon Says Sequence ---------------- */

const COLORS = [
  { id: 0, color: "bg-coral text-white", name: "Red" },
  { id: 1, color: "bg-sky text-white", name: "Blue" },
  { id: 2, color: "bg-lime text-ink", name: "Green" },
  { id: 3, color: "bg-sun text-ink", name: "Yellow" },
];

export function SimonSays({ onScore }: { onScore: (n: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Press Start to Play");
  const [playing, setPlaying] = useState(false);

  const playSequence = useCallback((seq: number[]) => {
    setUserStep(0);
    seq.forEach((c, idx) => {
      setTimeout(() => {
        setActiveColor(c);
        setTimeout(() => setActiveColor(null), 400);
      }, (idx + 1) * 700);
    });
  }, []);

  const startGame = () => {
    const first = Math.floor(Math.random() * 4);
    const newSeq = [first];
    setSequence(newSeq);
    setPlaying(true);
    setStatus("Watch the pattern!");
    playSequence(newSeq);
  };

  const handleColorClick = (id: number) => {
    if (!playing) return;
    if (sequence[userStep] === id) {
      if (userStep + 1 === sequence.length) {
        const nextScore = sequence.length * 10;
        onScore(nextScore);
        setStatus(`Great! Round ${sequence.length + 1}`);
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSeq);
        setTimeout(() => playSequence(nextSeq), 1000);
      } else {
        setUserStep((s) => s + 1);
      }
    } else {
      setStatus(`Game Over! Score: ${(sequence.length - 1) * 10}`);
      setPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <span className="font-display text-lg font-bold">{status}</span>
      <div className="grid grid-cols-2 gap-3 w-full">
        {COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => handleColorClick(c.id)}
            className={`h-24 rounded-2xl border-2 border-ink doodle-shadow-sm font-bold text-sm transition-all ${c.color} ${
              activeColor === c.id ? "scale-105 border-4 border-ink" : "opacity-90 hover:opacity-100"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <button
        onClick={startGame}
        className="rounded-xl border-2 border-ink bg-sun px-5 py-2 text-xs font-bold doodle-shadow-sm hover:bg-sun/80"
      >
        {playing ? "Restart Simon" : "Start Simon Says"}
      </button>
    </div>
  );
}

/* ---------------- 8. Word Guess (Doodle Tech Wordle) ---------------- */

const TECH_WORDS = ["REACT", "BUILD", "DANCE", "AGENT", "CLOUDS", "PRIME", "LOGIC", "SMART"];

export function WordGuess({ onScore }: { onScore: (n: number) => void }) {
  const [word, setWord] = useState("REACT");
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [won, setWon] = useState(false);

  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length !== 5) return;
    const u = guess.toUpperCase();
    const nextAttempts = [...attempts, u];
    setAttempts(nextAttempts);
    setGuess("");
    if (u === word) {
      setWon(true);
      onScore(Math.max(10, 100 - nextAttempts.length * 15));
    }
  };

  const restart = () => {
    const nextW = TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)]!;
    setWord(nextW);
    setAttempts([]);
    setGuess("");
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <span className="font-display text-base font-bold">Guess the 5-Letter Tech Word</span>
      <div className="space-y-2 w-full">
        {attempts.map((att, idx) => (
          <div key={idx} className="flex justify-center gap-1 font-mono font-bold">
            {att.split("").map((letter, i) => {
              const isRight = word[i] === letter;
              const isMatch = word.includes(letter);
              return (
                <span
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-ink text-sm ${
                    isRight ? "bg-mint text-ink" : isMatch ? "bg-sun text-ink" : "bg-card text-muted-foreground"
                  }`}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {!won && attempts.length < 5 ? (
        <form onSubmit={submitGuess} className="flex gap-2 w-full">
          <input
            maxLength={5}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="5 LETTERS"
            className="flex-1 rounded-xl border-2 border-ink bg-card px-3 py-2 text-center font-mono text-sm uppercase outline-none"
          />
          <button type="submit" className="rounded-xl border-2 border-ink bg-sun px-4 py-2 text-xs font-bold">
            Submit
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="font-bold text-sm">{won ? "🎉 Correct Word!" : `Word was: ${word}`}</p>
          <button onClick={restart} className="mt-2 rounded-xl border-2 border-ink bg-mint px-4 py-1.5 text-xs font-bold">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
