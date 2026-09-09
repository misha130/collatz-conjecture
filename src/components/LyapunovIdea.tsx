import { createMemo, createSignal, For, Show } from "solid-js";
import { hailstone, SAFE_SEED_MAX } from "../lib/collatz";

const CURATED = [
  { n: 27, note: "111 steps; the accelerated map still climbs early on" },
  { n: 97, note: "long run of increases before it turns over" },
  { n: 703, note: "reaches 250,504" },
  { n: 6171, note: "record total stopping time under 10,000" },
];

/**
 * A Lyapunov function is dynamical-systems language for "a quantity that can
 * only go down." If one existed here — bounded below, strictly decreasing on
 * every step — the conjecture would follow immediately from the
 * well-ordering of the integers, no density arguments required. This panel
 * explains why that idea is so tempting, why the obvious candidate (n
 * itself) fails outright, and why the improved candidate (the odd-to-odd
 * "accelerated" map, whose typical multiplier is the 3/4 seen elsewhere on
 * this page) still isn't a true per-step Lyapunov function — it only trends
 * down on average. The demo computes both failure rates live, from the
 * actual trajectory, rather than quoting them.
 */
export default function LyapunovIdea() {
  const [input, setInput] = createSignal("27");
  const [seed, setSeed] = createSignal(27);
  const [error, setError] = createSignal<string | null>(null);

  const onInput = (raw: string) => {
    setInput(raw);
    const trimmed = raw.trim();
    const n = Number(trimmed);
    if (trimmed === "" || !Number.isFinite(n)) {
      setError(null);
      return;
    }
    if (!Number.isInteger(n) || n < 1) {
      setError("Enter a positive whole number.");
      return;
    }
    if (n > SAFE_SEED_MAX) {
      setError(`Enter a value up to ${SAFE_SEED_MAX.toLocaleString()}.`);
      return;
    }
    setError(null);
    setSeed(n);
  };

  const result = createMemo(() => {
    try {
      return hailstone(seed());
    } catch {
      return null;
    }
  });

  const oddOnly = createMemo(() => (result()?.sequence ?? []).filter((v) => v % 2 !== 0));

  const transitions = createMemo(() => {
    const seq = oddOnly();
    const out: { value: number; up: boolean }[] = [];
    for (let i = 1; i < seq.length; i++) {
      out.push({ value: seq[i], up: seq[i] > seq[i - 1] });
    }
    return out;
  });

  const accViolations = createMemo(() => transitions().filter((t) => t.up).length);
  const accTotal = createMemo(() => transitions().length);
  const rawViolations = createMemo(() => result()?.oddSteps ?? 0);

  const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);

  return (
    <div class="mt-10">
      <p class="label text-primary">A different proof strategy</p>
      <h3 class="font-display mt-2 text-[18px] font-bold uppercase tracking-[0.03em] text-on-surface">
        Could a single decreasing quantity settle this?
      </h3>

      <div class="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Explanation */}
        <div class="border border-hairline p-6">
          <p class="text-[13.5px] leading-[1.7] text-on-surface-variant">
            In dynamical systems, a <span class="text-on-surface">Lyapunov function</span> is a quantity
            V(n) that only ever goes down. If one existed for the Collatz map — bounded below, and
            strictly smaller after every step — the conjecture would follow at once: an infinitely
            decreasing sequence of bounded values cannot exist, so every trajectory would have to
            terminate.
          </p>

          <div class="font-mono mt-4 overflow-x-auto border border-hairline-strong bg-surface-container-low/60 px-4 py-3.5 text-[13px] leading-[1.8] text-on-surface">
            V(T(n)) &lt; V(n) for all n &gt; 1, V bounded below
            <div class="mt-1.5 text-[11.5px] text-on-surface-variant">
              ⇒ no trajectory can rise forever or hide in an unknown cycle
            </div>
          </div>

          <p class="mt-4 text-[13.5px] leading-[1.7] text-on-surface-variant">
            The obvious candidate is V(n) = n itself. It fails immediately: whenever n is odd,
            T(n) = 3n + 1 is larger, not smaller. The explorer above shows what that means in practice
            — seed 27 climbs to 9,232 before it ever turns around.
          </p>

          <p class="mt-4 text-[13.5px] leading-[1.7] text-on-surface-variant">
            A better candidate looks only at the odd terms. Passing from one odd value to the next
            multiplies n by 3 / 2<sup>a</sup>, where a is however many times 3n + 1 divides by 2. Treated
            as random, a averages 2, giving a typical multiplier of 3/4 — the same figure behind the
            statistics further up this page. But a is not always 2: whenever a = 1, that same
            odd-to-odd step multiplies n by 3/2, an increase. Nothing rules out a long run of those.
          </p>

          <p class="mt-4 text-[13.5px] leading-[1.7] text-on-surface-variant">
            So the 3/4 drift is real on average, but no function has been proved to decrease on{" "}
            <span class="text-on-surface">every</span> step for <span class="text-on-surface">every</span>{" "}
            starting value. Building one seems to require knowing in advance how many times each
            3n + 1 divides by 2 along the whole orbit — which is close to knowing the sequence itself.
            John Conway showed in 1972 that a natural generalization of this kind of map is
            undecidable, which is part of why many researchers doubt a simple closed-form Lyapunov
            function exists here at all.
          </p>
        </div>

        {/* Demo */}
        <div class="corner-ticks min-w-0 border border-hairline bg-surface-container-low/40 p-6">
          <p class="label text-outline">Fig. — two candidate potentials, tested on one trajectory</p>

          <div class="mt-4 flex items-stretch border border-hairline-strong bg-surface-container-lowest">
            <span class="label flex items-center border-r border-hairline px-3 text-outline">n =</span>
            <input
              type="number"
              step="1"
              value={input()}
              onInput={(e) => onInput(e.currentTarget.value)}
              class="font-mono tnum w-full bg-transparent px-3 py-2.5 text-[15px] text-on-surface outline-none"
              aria-label="Starting number"
            />
          </div>
          <Show when={error()}>
            <p class="mt-2 text-[12px] leading-snug text-error">{error()}</p>
          </Show>

          <div class="mt-3 flex flex-wrap gap-2">
            <For each={CURATED}>
              {(c) => (
                <button
                  class="label border border-hairline px-2.5 py-1.5 text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
                  onClick={() => {
                    setInput(String(c.n));
                    setSeed(c.n);
                    setError(null);
                  }}
                  title={c.note}
                >
                  {c.n}
                </button>
              )}
            </For>
          </div>

          <Show when={result() !== null}>
            <>
              <div class="mt-6 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
                <div class="bg-surface-container-lowest px-4 py-4">
                  <p class="label text-outline">V(n) = n fails on</p>
                  <p class="font-display tnum mt-2 text-[20px] font-bold leading-none text-error">
                    {rawViolations() > 0 ? "100%" : "—"}
                  </p>
                  <p class="mt-2 text-[11.5px] leading-[1.6] text-on-surface-variant">
                    {rawViolations() > 0
                      ? `every one of its ${rawViolations().toLocaleString()} odd steps — deterministically`
                      : "this seed has no odd steps to test"}
                  </p>
                </div>
                <div class="bg-surface-container-lowest px-4 py-4">
                  <p class="label text-outline">Odd-to-odd potential fails on</p>
                  <p class="font-display tnum mt-2 text-[20px] font-bold leading-none text-on-surface">
                    {pct(accViolations(), accTotal())}%
                  </p>
                  <p class="mt-2 text-[11.5px] leading-[1.6] text-on-surface-variant">
                    {accViolations().toLocaleString()} of {accTotal().toLocaleString()} odd-to-odd
                    transitions rise instead of fall
                  </p>
                </div>
              </div>

              <p class="mt-4 text-[11px] uppercase tracking-widest text-outline">
                Odd terms in order — ↓ decrease, ↑ increase
              </p>
              <div class="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                <span class="font-mono tnum border border-hairline-strong bg-surface-container-low px-2 py-1 text-[11px] text-on-surface">
                  {oddOnly()[0]?.toLocaleString()}
                </span>
                <For each={transitions()}>
                  {(t) => (
                    <span
                      class={`font-mono tnum border px-2 py-1 text-[11px] ${
                        t.up
                          ? "border-error/40 bg-error/10 text-error"
                          : "border-primary/30 bg-primary/10 text-primary"
                      }`}
                    >
                      {t.up ? "↑" : "↓"} {t.value.toLocaleString()}
                    </span>
                  )}
                </For>
              </div>

              <p class="mt-4 border-t border-hairline pt-4 text-[12px] leading-[1.7] text-on-surface-variant">
                Even the improved potential rises on a real fraction of steps. What saves the trend is
                size, not frequency: a rise only ever multiplies by 3/2, while a fall can divide by 4
                or more — so the running product still drifts down, just not on every single step.
              </p>
            </>
          </Show>
        </div>
      </div>
    </div>
  );
}
