import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { cycleLabel, hailstone, SAFE_SEED_MAX } from "../lib/collatz";
import TrajectoryChart from "./TrajectoryChart";

const CURATED = [
  { n: 27, note: "111 steps, peaks at 9,232 — higher than Everest, in meters" },
  { n: 26, note: "10 steps, peaks at just 40" },
  { n: 9663, note: "climbs to roughly 27 million before it falls" },
  { n: 341, note: "hits 1,024, then simply halves ten times in a row" },
  { n: 6171, note: "one of the largest early peaks under 10,000" },
];

export default function HailstoneExplorer() {
  const [input, setInput] = createSignal("27");
  const [seed, setSeed] = createSignal(27);
  const [logScale, setLogScale] = createSignal(false);
  const [allowNegative, setAllowNegative] = createSignal(false);
  const [showAll, setShowAll] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const onGoto = (e: Event) => {
    const n = (e as CustomEvent<number>).detail;
    setInput(String(n));
    setSeed(n);
  };
  onMount(() => window.addEventListener("collatz:goto", onGoto));
  onCleanup(() => window.removeEventListener("collatz:goto", onGoto));

  createEffect(() => {
    const raw = input().trim();
    const n = Math.round(Number(raw));
    if (raw === "" || !Number.isFinite(n)) {
      setError(null);
      return;
    }
    if (!allowNegative() && n < 1) {
      setError("Enter a positive whole number, or switch on negative seeds below.");
      return;
    }
    if (Math.abs(n) > SAFE_SEED_MAX) {
      setError(`Keep it under ${SAFE_SEED_MAX.toLocaleString()} — the demo is instant either way.`);
      return;
    }
    if (n === 0) {
      setError("0 has nowhere to go — try a nonzero integer.");
      return;
    }
    setError(null);
    setSeed(n);
  });

  const result = createMemo(() => {
    try {
      return hailstone(seed(), { allowNegative: allowNegative() });
    } catch {
      return null;
    }
  });

  const visibleSeq = createMemo(() => {
    const seq = result()?.sequence ?? [];
    return showAll() ? seq : seq.slice(0, 60);
  });

  return (
    <div class="mt-10">
      <div class="grid gap-0 border border-hairline lg:grid-cols-[280px_1fr]">
        {/* Controls */}
        <div class="border-b border-hairline bg-surface-container-low/50 p-5 lg:border-b-0 lg:border-r">
          <label class="label block text-outline">Starting number</label>
          <div class="mt-2 flex items-stretch border border-hairline-strong bg-surface-container-lowest">
            <span class="label flex items-center border-r border-hairline px-3 text-outline">n =</span>
            <input
              type="number"
              value={input()}
              onInput={(e) => setInput(e.currentTarget.value)}
              class="font-mono tnum w-full bg-transparent px-3 py-2.5 text-[15px] text-on-surface outline-none"
              aria-label="Starting number"
            />
          </div>
          <Show when={error()}>
            <p class="mt-2 text-[12px] leading-snug text-error">{error()}</p>
          </Show>

          <div class="mt-5 space-y-2">
            <p class="label text-outline/70">Try one of these</p>
            <For each={CURATED}>
              {(c) => (
                <button
                  class="block w-full border border-hairline px-3 py-2 text-left transition-colors hover:border-primary"
                  onClick={() => {
                    setInput(String(c.n));
                    setSeed(c.n);
                  }}
                >
                  <span class="font-mono tnum text-[13px] font-bold text-on-surface">{c.n}</span>
                  <span class="mt-0.5 block text-[11.5px] leading-snug text-on-surface-variant">{c.note}</span>
                </button>
              )}
            </For>
          </div>

          <div class="mt-6 space-y-3 border-t border-hairline pt-5">
            <label class="flex cursor-pointer items-center justify-between gap-3">
              <span class="text-[13px] text-on-surface">Log scale</span>
              <input
                type="checkbox"
                checked={logScale()}
                onChange={(e) => setLogScale(e.currentTarget.checked)}
                class="h-4 w-4 accent-[var(--primary)]"
              />
            </label>
            <label class="flex cursor-pointer items-center justify-between gap-3">
              <span class="text-[13px] text-on-surface">Allow negative seeds</span>
              <input
                type="checkbox"
                checked={allowNegative()}
                onChange={(e) => setAllowNegative(e.currentTarget.checked)}
                class="h-4 w-4 accent-[var(--primary)]"
              />
            </label>
            <Show when={allowNegative()}>
              <p class="text-[11.5px] leading-relaxed text-on-surface-variant">
                Extend the rule to negative integers and the tidy single ending disappears — try −17
                or −5. Positive integers only ever have one place to land: the 4 → 2 → 1 loop.
              </p>
            </Show>
          </div>
        </div>

        {/* Chart + stats */}
        <div class="p-5 sm:p-6">
          <Show when={result()} fallback={<p class="text-on-surface-variant">Enter an integer to begin.</p>}>
            {(r) => (
              <>
                <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p class="label text-outline">
                    Fig. — Altitude per step, n = {r().seed.toLocaleString()}
                    {logScale() ? " (log₁₀ scale)" : ""}
                  </p>
                  <Show when={r().truncated}>
                    <span class="label border border-error/40 bg-error/10 px-2 py-1 text-error">
                      Stopped early — see note below
                    </span>
                  </Show>
                </div>

                <TrajectoryChart sequence={r().sequence} logScale={logScale()} />

                <div class="mt-6 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
                  <Stat label="Total stopping time" value={r().steps.toLocaleString()} />
                  <Stat label="Peak altitude" value={r().peak.toLocaleString()} accent />
                  <Stat label="Odd steps (×3+1)" value={r().oddSteps.toLocaleString()} />
                  <Stat label="Even steps (÷2)" value={r().evenSteps.toLocaleString()} />
                </div>

                <Show when={allowNegative() && r().seed < 0}>
                  <p class="mt-4 text-[13px] leading-relaxed text-on-surface-variant">
                    This one settles into <span class="text-on-surface">{cycleLabel(r().sequence[r().sequence.length - 1])}</span>.
                  </p>
                </Show>

                <div class="mt-6 border-t border-hairline pt-5">
                  <div class="mb-2 flex items-center justify-between">
                    <p class="label text-outline">Every value in the trail</p>
                    <Show when={r().sequence.length > 60}>
                      <button class="label text-primary" onClick={() => setShowAll(!showAll())}>
                        {showAll() ? "Show fewer" : `Show all ${r().sequence.length}`}
                      </button>
                    </Show>
                  </div>
                  <div class="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
                    <For each={visibleSeq()}>
                      {(v) => (
                        <span
                          class={`font-mono tnum border px-2 py-1 text-[11.5px] ${
                            v % 2 !== 0
                              ? "border-hairline text-on-surface-variant"
                              : "border-hairline bg-surface-container-low text-on-surface-variant"
                          }`}
                        >
                          {v.toLocaleString()}
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}

function Stat(props: { label: string; value: string; accent?: boolean }) {
  return (
    <div class="bg-surface-container-lowest px-4 py-4">
      <p class="label text-outline">{props.label}</p>
      <p class={`font-display tnum mt-2 text-[20px] font-bold leading-none ${props.accent ? "text-primary" : "text-on-surface"}`}>
        {props.value}
      </p>
    </div>
  );
}
