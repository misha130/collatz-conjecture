import { createMemo, createResource, createSignal, Show } from "solid-js";
import { scanSeeds } from "../lib/collatz";

const SEED_COUNT = 10_000;
const HIGHLIGHT = [27, 9663];

const W = 720;
const H = 360;
const PAD_L = 54;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 34;

/**
 * Reproduces the classic "seed on x, peak altitude on y" scatter: mostly
 * unremarkable, until a handful of seeds shoot far above the rest — 27 first
 * among small numbers, 9,663 far beyond it.
 */
export default function PeakScatter() {
  const [points] = createResource(() => scanSeeds(SEED_COUNT));
  const [hover, setHover] = createSignal<{ seed: number; peak: number; steps: number } | null>(null);

  const plot = createMemo(() => {
    const pts = points();
    if (!pts) return null;
    const w = W - PAD_L - PAD_R;
    const h = H - PAD_T - PAD_B;
    const maxPeak = Math.max(...pts.map((p) => p.peak));
    const maxLog = Math.log10(maxPeak);
    const toXY = (seed: number, peak: number) => ({
      x: PAD_L + (seed / SEED_COUNT) * w,
      y: PAD_T + h - (Math.log10(Math.max(peak, 1)) / maxLog) * h,
    });
    return { pts, toXY, maxLog, w, h };
  });

  const yTicks = createMemo(() => {
    const p = plot();
    if (!p) return [];
    return [1, 2, 3, 4, 5, 6, 7, 8].filter((e) => e <= p.maxLog + 0.3).map((e) => {
      const val = Math.pow(10, e);
      const { y } = p.toXY(0, val);
      return { y, label: e === 0 ? "1" : `10^${e}` };
    });
  });

  const onMove = (e: MouseEvent, svg: SVGSVGElement) => {
    const p = plot();
    if (!p) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    const seed = Math.round(((relX - PAD_L) / p.w) * SEED_COUNT);
    const clamped = Math.max(1, Math.min(SEED_COUNT, seed));
    const pt = p.pts[clamped - 1];
    if (pt) setHover(pt);
  };

  return (
    <div class="corner-ticks border border-hairline bg-surface-container-low/40 p-6">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p class="label text-outline">Fig. — Peak altitude reached, seeds 1–{SEED_COUNT.toLocaleString()}</p>
        <p class="label text-outline/70">log scale, y-axis</p>
      </div>

      <Show when={plot()} fallback={<p class="text-on-surface-variant">Scanning {SEED_COUNT.toLocaleString()} seeds…</p>}>
        {(p) => (
          <div class="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              class="h-auto w-full overflow-visible"
              onMouseMove={(e) => onMove(e, e.currentTarget)}
              onMouseLeave={() => setHover(null)}
            >
              {yTicks().map((t) => (
                <>
                  <line x1={PAD_L} x2={W - PAD_R} y1={t.y} y2={t.y} stroke="var(--hairline)" stroke-width="1" />
                  <text x={PAD_L - 8} y={t.y + 3} text-anchor="end" class="font-mono fill-on-surface-variant" font-size="10">
                    {t.label}
                  </text>
                </>
              ))}

              {p().pts.map((pt) => {
                const { x, y } = p().toXY(pt.seed, pt.peak);
                const isHi = HIGHLIGHT.includes(pt.seed);
                return (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHi ? 3 : 1.15}
                    fill={isHi ? "var(--error)" : "var(--primary)"}
                    opacity={isHi ? 1 : 0.38}
                  />
                );
              })}

              {HIGHLIGHT.map((seed) => {
                const pt = p().pts[seed - 1];
                const { x, y } = p().toXY(seed, pt.peak);
                return (
                  <text x={x + 8} y={y - 8} class="font-mono fill-error" font-size="11">
                    {seed}
                  </text>
                );
              })}

              <Show when={hover()}>
                {(h) => {
                  const { x, y } = p().toXY(h().seed, h().peak);
                  return <circle cx={x} cy={y} r="5" fill="none" stroke="var(--on-surface)" stroke-width="1.5" />;
                }}
              </Show>
            </svg>

            <Show when={hover()}>
              {(h) => (
                <div class="pointer-events-none absolute right-2 top-0 border border-hairline-strong bg-surface-container-lowest px-3 py-2 text-[11.5px] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)]">
                  <p class="label text-outline">seed {h().seed.toLocaleString()}</p>
                  <p class="font-mono tnum text-on-surface">peak {h().peak.toLocaleString()}</p>
                  <p class="font-mono tnum text-on-surface-variant">{h().steps} steps</p>
                </div>
              )}
            </Show>
          </div>
        )}
      </Show>

      <p class="mt-5 border-t border-hairline pt-4 text-[13px] leading-[1.7] text-on-surface-variant">
        Most seeds under 10,000 stay modest. Two stand out: <span class="text-on-surface">27</span>, which
        climbs to 9,232 over 111 steps, and <span class="text-on-surface">9,663</span>, which overshoots that
        by three orders of magnitude on its way back down to 1. Nothing about a seed's size predicts its
        peak — that unpredictability is the whole reason this is hard to prove.
      </p>
    </div>
  );
}
