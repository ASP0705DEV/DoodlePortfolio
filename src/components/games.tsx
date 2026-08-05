import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export async function submitScore(game: string, score: number, durationMs?: number) {
  void track("game_play", { label: game, meta: { score }, ...(durationMs ? { durationMs } : {}) });
  await supabase.from("game_scores").insert({
    game,
    score,
    player_alias: "Anonymous",
    duration_ms: durationMs ?? null,
  });
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
        if (!cancelled) setScores((data ?? []).map((d) => d.score));
      });
    return () => {
      cancelled = true;
    };
  }, [game, reloadKey]);
  return scores;
}

/* ---------------- Tic Tac Toe ---------------- */

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
            className="grid h-20 w-20 place-items-center rounded-xl border-2 border-ink bg-card font-display text-3xl font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <span className={cell === "X" ? "text-coral" : "text-sky"}>{cell}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="hand text-2xl">{status ?? "your move (X)"}</span>
        <button
          onClick={reset}
          className="rounded-xl border-2 border-ink bg-sun px-3 py-1.5 text-sm font-bold doodle-shadow-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/* ---------------- Snake ---------------- */

const GRID = 15;

export function Snake({ onScore }: { onScore: (n: number) => void }) {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      const map: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      if (next.x === -d.x && next.y === -d.y) return;
      setDir(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
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
          onScore(score);
          return prev;
        }
        const grew = next.x === food.x && next.y === food.y;
        if (grew) {
          setScore((s) => s + 1);
          setFood({
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
          });
        }
        return [next, ...(grew ? prev : prev.slice(0, -1))];
      });
    }, 140);
    return () => clearInterval(t);
  }, [running, food, score, onScore]);

  const start = () => {
    setSnake([{ x: 7, y: 7 }]);
    setDir({ x: 1, y: 0 });
    setScore(0);
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid gap-[2px] rounded-xl border-2 border-ink bg-card p-2"
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
              className={`h-4 w-4 rounded-[4px] ${
                isHead ? "bg-ink" : isSnake ? "bg-mint" : isFood ? "bg-coral" : "bg-muted"
              }`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className="hand text-2xl">score {score}</span>
        <button
          onClick={start}
          className="rounded-xl border-2 border-ink bg-lime px-3 py-1.5 text-sm font-bold doodle-shadow-sm"
        >
          {running ? "Restart" : "Start"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Use the arrow keys.</p>
    </div>
  );
}

/* ---------------- Memory Match ---------------- */

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
    }, 650);
    return () => clearTimeout(t);
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === ICONS.length && matched.length) {
      onScore(Math.max(0, 100 - moves * 3));
    }
  }, [matched, moves, onScore]);

  const restart = () => {
    setCards([...cards].sort(() => Math.random() - 0.5));
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
              onClick={() =>
                !isOpen && flipped.length < 2 && setFlipped((f) => [...f, card.id])
              }
              className={`grid h-16 w-16 place-items-center rounded-xl border-2 border-ink text-2xl doodle-shadow-sm transition-all ${
                isOpen ? "bg-sun" : "bg-card"
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
          className="rounded-xl border-2 border-ink bg-bubble px-3 py-1.5 text-sm font-bold doodle-shadow-sm"
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}

/* ---------------- Typing Speed ---------------- */

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
      <p className="w-full rounded-xl border-2 border-ink bg-card p-4 font-mono text-sm">
        {target.split("").map((ch, i) => (
          <span
            key={i}
            className={
              i < input.length
                ? input[i] === ch
                  ? "text-mint-foreground bg-mint"
                  : "bg-coral text-coral-foreground"
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
        placeholder="start typing…"
        className="w-full rounded-xl border-2 border-ink bg-card px-4 py-3 font-mono text-sm outline-none"
      />
      <div className="flex items-center gap-3">
        <span className="hand text-2xl">{wpm ? `${wpm} wpm 🎉` : "accuracy matters"}</span>
        <button
          onClick={reset}
          className="rounded-xl border-2 border-ink bg-sky px-3 py-1.5 text-sm font-bold text-sky-foreground doodle-shadow-sm"
        >
          New snippet
        </button>
      </div>
    </div>
  );
}
