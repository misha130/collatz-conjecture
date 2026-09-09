import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { hailstone } from "../lib/collatz";
import Accent from "./Accent";

const EXAMPLES = [7, 27, 97, 871];

/** Tiny inline hailstone sparkline used behind the hero copy. */
function HeroTrace(props: { seed: number }) {
  const result = createMemo(() => hailstone(props.seed));
  const path = createMemo(() => {
    const seq = result().sequence;
    const w = 520;
    const h = 220;
    const max = Math.max(...seq);
    const stepX = seq.length > 1 ? w / (seq.length - 1) : w;
    const pts = seq.map((v, i) => {
      const x = i * stepX;
      const y = h - (v / max) * (h - 18) - 6;
      return [x, y] as const;
    });
    return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  });

  const [drawn, setDrawn] = createSignal(false);
  onMount(() => {
    const t = setTimeout(() => setDrawn(true), 60);
    onCleanup(() => clearTimeout(t));
  });

  return (
    <svg viewBox="0 0 520 220" class="h-full w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.28" />
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path()} L520,220 L0,220 Z`}
        fill="url(#hero-fade)"
        style={{
          opacity: drawn() ? 1 : 0,
          transition: "opacity 1.2s ease 0.4s",
        }}
      />
      <path
        d={path()}
        fill="none"
        stroke="var(--primary)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1000"
        style={{
          "stroke-dasharray": 1000,
          "stroke-dashoffset": drawn() ? 0 : 1000,
          transition: "stroke-dashoffset 1.8s cubic-bezier(0.65,0,0.35,1)",
        }}
      />
    </svg>
  );
}

export default function Hero() {
  const [seed, setSeed] = createSignal(27);
  const [input, setInput] = createSignal("27");

  const submit = (e: Event) => {
    e.preventDefault();
    const n = Math.round(Number(input()));
    if (Number.isFinite(n) && n >= 1 && n <= 1_000_000_000) {
      setSeed(n);
      // Keep the full explorer further down the page in sync, without
      // yanking the reader away from the hero card that just answered them.
      window.dispatchEvent(new CustomEvent("collatz:goto", { detail: n }));
    }
  };

  const stats = createMemo(() => hailstone(seed()));

  return (
    <section id="top" class="relative overflow-hidden border-b border-hairline">
      <div class="grid-paper grid-paper-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div class="ruled relative mx-auto max-w-[1440px] px-5 pb-14 pt-14 sm:pt-20">
        <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div class="animate-rise">
            <h1 class="font-display text-[36px] font-bold uppercase leading-[1.08] tracking-[0.01em] text-on-surface sm:text-[46px]">
              The <Accent>Collatz</Accent> conjecture
            </h1>

            <div class="font-mono mt-6 max-w-lg border border-hairline-strong bg-surface-container-low/60 px-4 py-3.5 text-[13.5px] leading-[1.9] text-on-surface">
              <div>f(n) = n / 2 <span class="text-on-surface-variant">if n even</span></div>
              <div>f(n) = 3n + 1 <span class="text-on-surface-variant">if n odd</span></div>
              <div class="mt-2 border-t border-hairline pt-2 text-primary">
                Conjecture: for every integer n ≥ 1, repeating f(n) eventually reaches 1.
              </div>
            </div>

            <p class="mt-5 max-w-xl text-[15px] leading-[1.75] text-on-surface-variant">
              Every integer up to 2<sup>71</sup> (≈ 2.36 × 10<sup>21</sup>) has been checked by computer
              and reaches 1. No proof covers the integers beyond that bound, and none rules out a
              counterexample. First posed in the 1930s; still open.
            </p>

            <form onSubmit={submit} class="mt-7 flex max-w-md flex-wrap items-center gap-3">
              <div class="flex flex-1 items-stretch border border-hairline-strong bg-surface-container-lowest">
                <span class="label flex items-center border-r border-hairline px-3 text-outline">n =</span>
                <input
                  type="number"
                  min="1"
                  max="1000000000"
                  value={input()}
                  onInput={(e) => setInput(e.currentTarget.value)}
                  class="font-mono tnum w-full bg-transparent px-3 py-2.5 text-[15px] text-on-surface outline-none"
                  aria-label="Starting number"
                />
              </div>
              <button
                type="submit"
                class="label border border-on-surface bg-on-surface px-4 py-2.5 text-background transition-colors hover:bg-transparent hover:text-on-surface"
              >
                Compute f*(n)
              </button>
            </form>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="label text-outline/70">n =</span>
              <For each={EXAMPLES}>
                {(n) => (
                  <button
                    class="font-mono tnum border border-hairline px-2.5 py-1 text-[12.5px] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    onClick={() => {
                      setInput(String(n));
                      setSeed(n);
                    }}
                  >
                    {n}
                  </button>
                )}
              </For>
            </div>
          </div>

          <div class="relative">
            <div class="corner-ticks border border-hairline bg-surface-container-low/60 p-5">
              <div class="mb-4 flex items-center justify-between">
                <p class="label text-outline">Fig. 1 — Hailstone altitude</p>
                <p class="label tnum text-outline">n = {seed()}</p>
              </div>
              <div class="h-[220px]">
                <HeroTrace seed={seed()} />
              </div>
              <div class="mt-4 grid grid-cols-3 divide-x divide-hairline border-t border-hairline pt-3">
                <div class="px-1">
                  <p class="label text-outline">Steps</p>
                  <p class="font-display tnum mt-1 text-[18px] font-bold text-on-surface">{stats().steps}</p>
                </div>
                <div class="px-3">
                  <p class="label text-outline">Peak</p>
                  <p class="font-display tnum mt-1 text-[18px] font-bold text-on-surface">
                    {stats().peak.toLocaleString()}
                  </p>
                </div>
                <div class="px-3">
                  <p class="label text-outline">Lands on</p>
                  <p class="font-display tnum mt-1 text-[18px] font-bold text-primary">4·2·1</p>
                </div>
              </div>
            </div>
            <p class="label mt-3 text-center text-outline/70">
              The orbit of n under repeated f — a hailstone sequence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
