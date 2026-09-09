import { createMemo, createSignal, Show } from "solid-js";

interface Props {
  sequence: number[];
  logScale: boolean;
  height?: number;
}

const PAD_L = 46;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 30;

/**
 * The hailstone altitude chart: step index on x, value on y, with an optional
 * log scale — the video's own trick for taming a plot that otherwise spikes
 * once and flatlines everywhere else.
 */
export default function TrajectoryChart(props: Props) {
  const width = 720;
  const height = () => props.height ?? 280;

  const scaled = createMemo(() => {
    const seq = props.sequence;
    const w = width - PAD_L - PAD_R;
    const h = height() - PAD_T - PAD_B;
    const values = props.logScale ? seq.map(signedLog) : seq;
    const maxV = Math.max(...values, 0);
    const minV = Math.min(...values, 0);
    const range = Math.max(maxV - minV, props.logScale ? 0.1 : 1);
    const stepX = seq.length > 1 ? w / (seq.length - 1) : w;
    const points = values.map((v, i) => {
      const x = PAD_L + i * stepX;
      const y = PAD_T + h - ((v - minV) / range) * h;
      return { x, y, v: seq[i], i };
    });
    return { points, maxV, minV, range, w, h };
  });

  const pathD = createMemo(() =>
    scaled()
      .points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(" "),
  );

  const areaD = createMemo(() => {
    const pts = scaled().points;
    if (pts.length === 0) return "";
    const bottom = PAD_T + scaled().h;
    return `${pathD()} L${pts[pts.length - 1].x.toFixed(2)},${bottom} L${pts[0].x.toFixed(2)},${bottom} Z`;
  });

  const yTicks = createMemo(() => {
    const { minV, range } = scaled();
    const n = 4;
    return Array.from({ length: n + 1 }, (_, i) => {
      const frac = i / n;
      const scaledValue = minV + frac * range;
      const val = props.logScale ? signedPow10(scaledValue) : scaledValue;
      return { y: PAD_T + scaled().h - frac * scaled().h, label: formatTick(val) };
    });
  });

  const xTicks = createMemo(() => {
    const n = props.sequence.length - 1;
    if (n <= 0) return [];
    const count = Math.min(6, n);
    return Array.from({ length: count + 1 }, (_, i) => {
      const idx = Math.round((i / count) * n);
      const p = scaled().points[idx];
      return { x: p.x, label: String(idx) };
    });
  });

  const [hover, setHover] = createSignal<number | null>(null);

  const onMove = (e: MouseEvent, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const pts = scaled().points;
    if (pts.length === 0) return;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const d = Math.abs(pts[i].x - relX);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    setHover(nearest);
  };

  return (
    <div class="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height()}`}
        class="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Collatz trajectory for ${props.sequence[0]}, with ${Math.max(0, props.sequence.length - 1)} steps and a highest value of ${Math.max(...props.sequence)}`}
        onMouseMove={(e) => onMove(e, e.currentTarget)}
        onMouseLeave={() => setHover(null)}
      >
        {/* gridlines */}
        {yTicks().map((t) => (
          <>
            <line x1={PAD_L} x2={width - PAD_R} y1={t.y} y2={t.y} stroke="var(--hairline)" stroke-width="1" />
            <text x={PAD_L - 8} y={t.y + 3} text-anchor="end" class="font-mono tnum fill-on-surface-variant" font-size="10">
              {t.label}
            </text>
          </>
        ))}
        {xTicks().map((t) => (
          <text x={t.x} y={height() - 8} text-anchor="middle" class="font-mono tnum fill-on-surface-variant" font-size="10">
            {t.label}
          </text>
        ))}
        <line
          x1={PAD_L}
          x2={width - PAD_R}
          y1={PAD_T + scaled().h}
          y2={PAD_T + scaled().h}
          stroke="var(--hairline-strong)"
          stroke-width="1"
        />

        <defs>
          <linearGradient id="traj-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.22" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD()} fill="url(#traj-fade)" />
        <path d={pathD()} fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

        <Show when={hover() !== null}>
          {(() => {
            const idx = hover()!;
            const p = scaled().points[idx];
            return (
              <g>
                <line x1={p.x} x2={p.x} y1={PAD_T} y2={PAD_T + scaled().h} stroke="var(--outline)" stroke-width="1" stroke-dasharray="2 3" />
                <circle cx={p.x} cy={p.y} r="4" fill="var(--surface-container-lowest)" stroke="var(--primary)" stroke-width="2" />
              </g>
            );
          })()}
        </Show>
      </svg>

      <Show when={hover() !== null}>
        {(() => {
          const idx = hover()!;
          const p = scaled().points[idx];
          const leftPct = (p.x / width) * 100;
          return (
            <div
              class="pointer-events-none absolute top-1 z-10 -translate-x-1/2 border border-hairline-strong bg-surface-container-lowest px-2.5 py-1.5 text-[11px] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)]"
              style={{ left: `${leftPct}%` }}
            >
              <p class="label text-outline">Step {idx}</p>
              <p class="font-mono tnum font-bold text-on-surface">{p.v.toLocaleString()}</p>
            </div>
          );
        })()}
      </Show>
    </div>
  );
}

function signedLog(value: number): number {
  return Math.sign(value) * Math.log10(1 + Math.abs(value));
}

function signedPow10(value: number): number {
  return Math.sign(value) * (Math.pow(10, Math.abs(value)) - 1);
}

function formatTick(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(v >= 10_000 ? 0 : 1)}k`;
  return Math.round(v).toLocaleString();
}
