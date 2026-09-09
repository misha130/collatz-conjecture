import { createMemo, createResource, createSignal, Show } from "solid-js";
import { scanSeeds } from "../lib/collatz";

const SAMPLE = 3000;
const W = 480;
const H = 320;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 32;

/**
 * There is no known formula that takes n and returns its step count without
 * simulating. There IS an exact formula running the other way: fix the
 * sequence of odd-step halving-counts (a1..ak) and you can solve for which
 * n produces exactly that pattern. This panel states that formula, then
 * shows the closest thing to a predictive one — an empirical fit of steps
 * against log2(n), computed live from the data, not quoted from a paper.
 */
export default function StepsFormula() {
  const [data] = createResource(() => scanSeeds(SAMPLE));

  const fit = createMemo(() => {
    const pts = data();
    if (!pts) return null;
    let sum = 0;
    let count = 0;
    let minR = Infinity;
    let maxR = -Infinity;
    for (const p of pts) {
      if (p.seed < 2) continue;
      const r = p.steps / Math.log2(p.seed);
      sum += r;
      count++;
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
    }
    return { k: sum / count, minR, maxR, count };
  });

  const plot = createMemo(() => {
    const pts = data();
    const f = fit();
    if (!pts || !f) return null;
    const w = W - PAD_L - PAD_R;
    const h = H - PAD_T - PAD_B;
    const maxLog = Math.log2(SAMPLE);
    const maxSteps = Math.max(...pts.map((p) => p.steps));
    const toXY = (logSeed: number, steps: number) => ({
      x: PAD_L + (logSeed / maxLog) * w,
      y: PAD_T + h - (steps / maxSteps) * h,
    });
    return { pts, toXY, maxLog, maxSteps, w, h };
  });

  const [hover, setHover] = createSignal<{ seed: number; steps: number } | null>(null);

  const onMove = (e: MouseEvent, svg: SVGSVGElement) => {
    const p = plot();
    if (!p) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    const logSeed = ((relX - PAD_L) / p.w) * p.maxLog;
    const seed = Math.max(2, Math.min(SAMPLE, Math.round(Math.pow(2, logSeed))));
    const pt = p.pts[seed - 1];
    if (pt) setHover(pt);
  };

  return (
    <div class="mt-10">
      <p class="label text-primary">Is there a shortcut?</p>
      <h3 class="font-display mt-2 text-[18px] font-bold uppercase tracking-[0.03em] text-on-surface">
        No known formula takes n straight to a step count
      </h3>

      <div class="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div class="border border-hairline p-6">
          <p class="text-[13.5px] leading-[1.7] text-on-surface-variant">
            Track only the odd numbers in a sequence. Each maps to the next by n → (3n + 1) / 2
            <sup>a</sup>, where a is however many times 2 divides evenly into 3n + 1. Fix that whole
            sequence of exponents a₁, …, aₖ in advance, and the starting value that produces exactly
            that pattern has a closed form:
          </p>

          <div class="font-mono mt-4 overflow-x-auto border border-hairline-strong bg-surface-container-low/60 px-4 py-3.5 text-[13px] leading-[1.8] text-on-surface">
            n₀ = [2<sup>A</sup>·n<sub>k</sub> − Σᵢ 3<sup>k−i</sup>·2<sup>Sᵢ₋₁</sup>] / 3<sup>k</sup>
            <div class="mt-1.5 text-[11.5px] text-on-surface-variant">
              A = a₁+⋯+aₖ, Sⱼ = a₁+⋯+aⱼ
            </div>
          </div>

          <p class="mt-4 text-[13.5px] leading-[1.7] text-on-surface-variant">
            That's a genuine formula — solved backward. It answers <em class="text-on-surface">which n
            produces this step pattern</em>, not <em class="text-on-surface">how many steps does this n
            take</em>. Each aᵢ is determined by arithmetic on the previous odd number in the chain, so
            this formula does not let us read it off n₀ without walking the sequence that far. The
            circular dependency explains why this exact backward formula is not a predictive shortcut.
          </p>
        </div>

        <div class="corner-ticks min-w-0 border border-hairline bg-surface-container-low/40 p-6">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p class="label text-outline">Fig. — steps vs. log₂(seed), n = 2–{SAMPLE.toLocaleString()}</p>
          </div>
          <Show when={plot()} fallback={<p class="text-on-surface-variant">Computing…</p>}>
            {(p) => (
              <div class="relative">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  class="h-auto w-full overflow-visible"
                  role="img"
                  aria-label={`Total stopping time versus the base-2 logarithm of each seed from 2 through ${SAMPLE.toLocaleString()}`}
                  onMouseMove={(e) => onMove(e, e.currentTarget)}
                  onMouseLeave={() => setHover(null)}
                >
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                    const y = PAD_T + p().h - f * p().h;
                    return (
                      <>
                        <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="var(--hairline)" stroke-width="1" />
                        <text x={PAD_L - 8} y={y + 3} text-anchor="end" class="font-mono fill-on-surface-variant" font-size="9">
                          {Math.round(f * p().maxSteps)}
                        </text>
                      </>
                    );
                  })}

                  {p().pts.map((pt) => {
                    if (pt.seed < 2) return null;
                    const { x, y } = p().toXY(Math.log2(pt.seed), pt.steps);
                    return <circle cx={x} cy={y} r="1.1" fill="var(--primary)" opacity="0.4" />;
                  })}

                  <Show when={fit()}>
                    {(f) => {
                      const p1 = p().toXY(0, 0);
                      const p2 = p().toXY(p().maxLog, f().k * p().maxLog);
                      return (
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--error)" stroke-width="1.5" stroke-dasharray="4 3" />
                      );
                    }}
                  </Show>

                  <Show when={hover()}>
                    {(h) => {
                      const { x, y } = p().toXY(Math.log2(h().seed), h().steps);
                      return <circle cx={x} cy={y} r="4" fill="none" stroke="var(--on-surface)" stroke-width="1.5" />;
                    }}
                  </Show>
                </svg>

                <Show when={hover()}>
                  {(h) => (
                    <div class="pointer-events-none absolute right-1 top-0 border border-hairline-strong bg-surface-container-lowest px-2.5 py-1.5 text-[11px]">
                      <p class="label text-outline">seed {h().seed.toLocaleString()}</p>
                      <p class="font-mono tnum text-on-surface">{h().steps} steps</p>
                    </div>
                  )}
                </Show>
              </div>
            )}
          </Show>

          <Show when={fit()}>
            {(f) => (
              <p class="mt-4 border-t border-hairline pt-4 text-[12.5px] leading-[1.7] text-on-surface-variant">
                Fitted live from {f().count.toLocaleString()} seeds: steps ≈{" "}
                <span class="font-mono tnum text-on-surface">{f().k.toFixed(2)}</span> · log₂(n) on
                average — the dashed line. But the ratio itself ranges from{" "}
                <span class="font-mono tnum text-on-surface">{f().minR.toFixed(2)}</span> to{" "}
                <span class="font-mono tnum text-on-surface">{f().maxR.toFixed(2)}</span> across this
                sample. That spread is the difference between a trend and a formula.
              </p>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
