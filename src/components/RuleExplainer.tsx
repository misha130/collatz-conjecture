import { createMemo, createSignal, For, Show } from "solid-js";
import { hailstone } from "../lib/collatz";

/**
 * Walks a single seed through the rule one step at a time. Critically, it
 * doesn't stop the moment the value hits 1 — it keeps applying the same rule
 * (1 is odd, so 3(1) + 1 = 4) to show that 1 maps to 4, 2, then back to 1,
 * which is the actual loop the conjecture claims every sequence lands in.
 */
export default function RuleExplainer() {
  const seed = 7;
  const base = createMemo(() => hailstone(seed));
  const naturalEnd = createMemo(() => base().sequence.length - 1);
  // Append one explicit turn of the 1 -> 4 -> 2 -> 1 loop.
  const extended = createMemo(() => [...base().sequence, 4, 2, 1]);
  const maxStep = createMemo(() => extended().length - 1);

  const [step, setStep] = createSignal(0);

  const current = () => extended()[step()];
  const isOdd = () => current() % 2 !== 0;
  const next = () => (isOdd() ? 3 * current() + 1 : current() / 2);
  const inLoop = () => step() >= naturalEnd();

  const advance = () => setStep((s) => Math.min(s + 1, maxStep()));
  const reset = () => setStep(0);

  return (
    <div class="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="corner-ticks border border-hairline bg-surface-container-low/50 p-6">
        <p class="label mb-6 text-outline">The rule, applied to n = {seed}</p>

        <div class="flex items-center justify-center gap-4">
          <div
            class={`font-display tnum flex h-20 w-20 items-center justify-center border-2 text-[26px] font-bold sm:h-24 sm:w-24 sm:text-[30px] ${
              inLoop() ? "border-primary text-primary" : "border-on-surface text-on-surface"
            }`}
          >
            {current()}
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="label text-outline">{isOdd() ? "odd" : "even"}</span>
            <svg width="34" height="14" viewBox="0 0 34 14" class="text-outline">
              <path d="M0,7 H28" stroke="currentColor" stroke-width="1.5" />
              <path d="M22,2 L28,7 L22,12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="font-mono text-[11px] text-on-surface-variant">{isOdd() ? "3n + 1" : "n ÷ 2"}</span>
          </div>
          <div
            class={`font-display tnum flex h-20 w-20 items-center justify-center border-2 text-[26px] font-bold sm:h-24 sm:w-24 sm:text-[30px] ${
              step() === maxStep() ? "border-primary text-primary" : "border-hairline-strong text-on-surface-variant"
            }`}
          >
            {step() === maxStep() ? current() : next()}
          </div>
        </div>

        <Show when={inLoop()}>
          <p class="mt-4 text-center text-[12.5px] leading-relaxed text-primary">
            1 is odd too: 3(1) + 1 = 4, then 4 → 2 → 1. The rule never stops on its own.
          </p>
        </Show>

        <div class="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            class="label border border-hairline px-3 py-2 text-outline transition-colors hover:border-on-surface hover:text-on-surface"
          >
            Reset
          </button>
          <button
            onClick={advance}
            disabled={step() === maxStep()}
            class="label border border-on-surface bg-on-surface px-4 py-2 text-background transition-colors hover:bg-transparent hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step() === maxStep() ? "Loops forever" : "Next step →"}
          </button>
        </div>

        <p class="label mt-5 text-center text-outline/70">
          Step {step()} of {maxStep()}
        </p>
      </div>

      <div class="border border-hairline bg-surface-container-lowest">
        <p class="label border-b border-hairline px-4 py-2.5 text-outline">Full trail so far</p>
        <div class="flex flex-wrap gap-1.5 p-4">
          <For each={extended().slice(0, step() + 1)}>
            {(v, i) => (
              <span
                class={`font-mono tnum border px-2 py-1 text-[12px] ${
                  i() === step()
                    ? "border-primary bg-primary/10 text-primary"
                    : i() > naturalEnd()
                      ? "border-dashed border-primary/40 text-on-surface-variant"
                      : "border-hairline text-on-surface-variant"
                }`}
              >
                {v}
              </span>
            )}
          </For>
        </div>
        <div class="border-t border-hairline px-4 py-3 text-[13px] leading-relaxed text-on-surface-variant">
          n = 7 reaches 1 after 16 steps, peaking at 52. Apply the rule to 1 itself — it's odd, so
          3(1) + 1 = 4 — and it cycles 4, 2, 1, 4, 2, 1 indefinitely. That fixed loop, not the number
          1 alone, is what the conjecture actually claims every starting number reaches.
        </div>
      </div>
    </div>
  );
}
