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
    <div class="mt-10 grid min-w-0 gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="corner-ticks min-w-0 border border-hairline bg-surface-container-low/50 p-6">
        <p class="label mb-6 text-outline">The rule, applied to n = {seed}</p>

        <div class="flex items-center justify-center gap-3 sm:gap-6">
          <div
            class={`font-display tnum flex h-24 w-24 items-center justify-center border-[3px] text-[34px] font-bold sm:h-36 sm:w-36 sm:text-[52px] lg:h-40 lg:w-40 lg:text-[58px] ${
              inLoop() ? "border-primary text-primary" : "border-on-surface text-on-surface"
            }`}
          >
            {current()}
          </div>
          <div class="flex flex-col items-center gap-1.5 sm:gap-2">
            <span class="text-[13px] font-bold uppercase tracking-[0.1em] text-outline sm:text-[16px]">
              {isOdd() ? "odd" : "even"}
            </span>
            <svg width="44" height="18" viewBox="0 0 44 18" class="text-outline sm:h-6 sm:w-14" aria-hidden="true">
              <path d="M0,9 H36" stroke="currentColor" stroke-width="2" />
              <path d="M28,3 L36,9 L28,15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="font-mono text-[13px] font-bold text-on-surface-variant sm:text-[17px]">
              {isOdd() ? "3n + 1" : "n ÷ 2"}
            </span>
          </div>
          <div
            class={`font-display tnum flex h-24 w-24 items-center justify-center border-[3px] text-[34px] font-bold sm:h-36 sm:w-36 sm:text-[52px] lg:h-40 lg:w-40 lg:text-[58px] ${
              step() === maxStep() ? "border-primary text-primary" : "border-hairline-strong text-on-surface-variant"
            }`}
          >
            {step() === maxStep() ? current() : next()}
          </div>
        </div>

        <Show when={inLoop()}>
          <p class="mt-5 text-center text-[15px] leading-relaxed text-primary sm:text-[16px]">
            1 is odd too: 3(1) + 1 = 4, then 4 → 2 → 1. The rule never stops on its own.
          </p>
        </Show>

        <div class="mt-7 flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={reset}
            class="font-display border border-hairline px-4 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-outline transition-colors hover:border-on-surface hover:text-on-surface sm:px-5 sm:py-3.5 sm:text-[15px]"
          >
            Reset
          </button>
          <button
            onClick={advance}
            disabled={step() === maxStep()}
            class="font-display border border-on-surface bg-on-surface px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-background transition-colors hover:bg-transparent hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40 sm:px-8 sm:py-3.5 sm:text-[15px]"
          >
            {step() === maxStep() ? "Loops forever" : "Next step →"}
          </button>
        </div>

        <p class="label mt-5 text-center text-outline/70">
          Step {step()} of {maxStep()}
        </p>
      </div>

      <div class="min-w-0 border border-hairline bg-surface-container-lowest">
        <p class="label border-b border-hairline px-4 py-2.5 text-outline">Full trail so far</p>
        <div class="mx-auto flex max-w-md flex-wrap justify-center gap-1 p-4">
          <For each={extended().slice(0, step() + 1)}>
            {(v, i) => (
              <span
                class={`font-mono tnum border px-1.5 py-0.5 text-[10.5px] ${
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
