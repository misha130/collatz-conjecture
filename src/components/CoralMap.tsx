import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { buildCoral, type CoralGraph, type CoralNode, formatInt, pathToRoot } from "../lib/collatz";

/**
 * The reverse Collatz graph, drawn as a growing coral: every positive
 * integer is conjectured to hang off this structure somewhere, connected
 * back to the 4 → 2 → 1 loop at the center. Rotating each branch by a fixed
 * angle — one angle for the ×2 step, another for the (n−1)/3 step — turns
 * the plain directed graph into the organic shape; drag the angle sliders to
 * see why.
 */
export default function CoralMap() {
  let canvasRef: HTMLCanvasElement | undefined;
  let wrapRef: HTMLDivElement | undefined;

  const [maxNodes, setMaxNodes] = createSignal(2400);
  const [angleEven, setAngleEven] = createSignal(16);
  const [angleOdd, setAngleOdd] = createSignal(26);
  const [selected, setSelected] = createSignal<CoralNode | null>(null);
  const [hoveredValue, setHoveredValue] = createSignal<number | null>(null);
  const [graph, setGraph] = createSignal<CoralGraph | null>(null);
  const [growth, setGrowth] = createSignal(0); // 0..1 reveal progress

  // view transform
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let dpr = 1;

  const rebuild = () => {
    const g = buildCoral({
      maxNodes: maxNodes(),
      angleEven: angleEven(),
      angleOdd: angleOdd(),
      segmentLength: 9,
      decay: 0.9985,
    });
    setGraph(g);
    setSelected(null);
    fitView(g);
    setGrowth(0);
    animateGrowth();
  };

  const fitView = (g: CoralGraph) => {
    const xs = g.nodes.map((n) => n.x);
    const ys = g.nodes.map((n) => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const w = Math.max(maxX - minX, 1);
    const h = Math.max(maxY - minY, 1);
    const canvas = canvasRef;
    if (!canvas) return;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    scale = Math.min(cw / w, ch / h) * 0.82;
    offsetX = cw / 2 - ((minX + maxX) / 2) * scale;
    offsetY = ch / 2 - ((minY + maxY) / 2) * scale;
  };

  let growthRaf = 0;
  const animateGrowth = () => {
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setGrowth(p);
      draw();
      if (p < 1) growthRaf = requestAnimationFrame(tick);
    };
    growthRaf = requestAnimationFrame(tick);
  };
  onCleanup(() => cancelAnimationFrame(growthRaf));

  const draw = () => {
    const canvas = canvasRef;
    const g = graph();
    if (!canvas || !g) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const styles = getComputedStyle(canvas);
    const primary = styles.getPropertyValue("--primary").trim() || "#1c8072";
    const secondary = styles.getPropertyValue("--secondary").trim() || "#8a6516";
    const error = styles.getPropertyValue("--error").trim() || "#c4472b";
    const onSurface = styles.getPropertyValue("--on-surface").trim() || "#1e1b16";

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const revealCount = Math.floor(g.nodes.length * growth());
    const path = selected() ? new Set(pathToRoot(selected()!).map((n) => n.id)) : null;
    const maxDepth = Math.max(...g.nodes.map((n) => n.depth), 1);

    ctx.lineCap = "round";
    for (let i = 1; i < g.nodes.length && i < revealCount; i++) {
      const n = g.nodes[i];
      const p = n.parent!;
      const onPath = path?.has(n.id) && path?.has(p.id);
      const t = n.depth / maxDepth;
      ctx.strokeStyle = onPath ? primary : depthColor(primary, secondary, error, t);
      ctx.globalAlpha = onPath ? 1 : n.viaDouble ? 0.5 : 0.85;
      ctx.lineWidth = (onPath ? 2.4 : n.viaDouble ? 1 : 1.3) / scale;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // root
    ctx.fillStyle = onSurface;
    ctx.beginPath();
    ctx.arc(g.root.x, g.root.y, 3.2 / scale, 0, Math.PI * 2);
    ctx.fill();

    if (selected()) {
      const s = selected()!;
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4 / scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = primary;
      ctx.lineWidth = 1.5 / scale;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 7 / scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  const resize = () => {
    const canvas = canvasRef;
    const wrap = wrapRef;
    if (!canvas || !wrap) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = wrap.clientWidth * dpr;
    canvas.height = wrap.clientHeight * dpr;
    canvas.style.width = `${wrap.clientWidth}px`;
    canvas.style.height = `${wrap.clientHeight}px`;
    const g = graph();
    if (g) fitView(g);
    draw();
  };

  const findNearest = (clientX: number, clientY: number): CoralNode | null => {
    const canvas = canvasRef;
    const g = graph();
    if (!canvas || !g) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - offsetX) / scale;
    const y = (clientY - rect.top - offsetY) / scale;
    let best: CoralNode | null = null;
    let bestDist = Infinity;
    const threshold = 14 / scale;
    for (const n of g.nodes) {
      const d = (n.x - x) ** 2 + (n.y - y) ** 2;
      if (d < bestDist && d < threshold * threshold) {
        bestDist = d;
        best = n;
      }
    }
    return best;
  };

  onMount(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef) ro.observe(wrapRef);
    onCleanup(() => ro.disconnect());

    const canvas = canvasRef!;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMoveP = (e: PointerEvent) => {
      if (dragging) {
        offsetX += e.clientX - lastX;
        offsetY += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        draw();
      } else {
        const n = findNearest(e.clientX, e.clientY);
        setHoveredValue(n ? n.value : null);
        canvas.style.cursor = n ? "pointer" : "grab";
      }
    };
    const onUp = (e: PointerEvent) => {
      if (dragging) {
        const moved = Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
        if (moved < 3) {
          const n = findNearest(e.clientX, e.clientY);
          setSelected(n);
          draw();
        }
      }
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = Math.exp(-e.deltaY * 0.0015);
      const newScale = Math.min(60, Math.max(0.05, scale * factor));
      offsetX = mx - ((mx - offsetX) / scale) * newScale;
      offsetY = my - ((my - offsetY) / scale) * newScale;
      scale = newScale;
      draw();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMoveP);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    onCleanup(() => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMoveP);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("wheel", onWheel);
    });

    rebuild();
  });

  createEffect(() => {
    maxNodes();
    angleEven();
    angleOdd();
    if (canvasRef) rebuild();
  });

  const jumpToExplorer = () => {
    const s = selected();
    if (!s) return;
    window.dispatchEvent(new CustomEvent("collatz:goto", { detail: s.value }));
    document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div class="mt-10 grid gap-6 lg:grid-cols-[1fr_260px]">
      <div class="corner-ticks relative border border-hairline bg-surface-container-lowest">
        <div class="grid-paper absolute inset-0 opacity-40" aria-hidden="true" />
        <div ref={wrapRef} class="relative h-[420px] w-full sm:h-[520px]">
          <canvas ref={canvasRef} class="absolute inset-0 block h-full w-full touch-none" />
        </div>

        <div class="pointer-events-none absolute left-3 top-3 border border-hairline-strong bg-surface-container-lowest/90 px-2.5 py-1.5 backdrop-blur-sm">
          <p class="label text-outline">Fig. — Reverse graph, rooted at 1</p>
        </div>

        <div class="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 border border-hairline-strong bg-surface-container-lowest/90 px-2.5 py-1.5 text-[10.5px] text-on-surface-variant backdrop-blur-sm">
          <span class="h-2 w-10" style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary), var(--error))" }} />
          <span>root → tips, by depth</span>
        </div>

        {hoveredValue() !== null && (
          <div class="pointer-events-none absolute right-3 top-3 border border-hairline-strong bg-surface-container-lowest/95 px-2.5 py-1.5 backdrop-blur-sm">
            <p class="font-mono tnum text-[12px] text-on-surface">{formatInt(hoveredValue()!)}</p>
          </div>
        )}
      </div>

      <div class="space-y-5">
        <div class="border border-hairline p-4">
          <p class="label mb-3 text-outline">Shape it yourself</p>
          <Slider label="Complexity" value={maxNodes()} min={200} max={6000} step={100} onInput={setMaxNodes} format={(v) => v.toLocaleString()} />
          <Slider label="÷2 branch angle" value={angleEven()} min={0} max={60} step={1} onInput={setAngleEven} format={(v) => `${v}°`} />
          <Slider label="(n−1)/3 branch angle" value={angleOdd()} min={0} max={60} step={1} onInput={setAngleOdd} format={(v) => `${v}°`} />
          <button
            class="label mt-1 w-full border border-hairline px-3 py-2 text-outline transition-colors hover:border-on-surface hover:text-on-surface"
            onClick={rebuild}
          >
            Regrow
          </button>
        </div>

        <div class="border border-hairline p-4">
          <p class="label mb-2 text-outline">Selected node</p>
          {selected() ? (
            <>
              <p class="font-display tnum text-[20px] font-bold text-primary">{formatInt(selected()!.value)}</p>
              <p class="mt-1 text-[12.5px] text-on-surface-variant">
                {selected()!.depth} step{selected()!.depth === 1 ? "" : "s"} from 1, walking the rule backwards.
              </p>
              <button class="label mt-3 border border-on-surface bg-on-surface px-3 py-2 text-background transition-colors hover:bg-transparent hover:text-on-surface" onClick={jumpToExplorer}>
                Open in explorer →
              </button>
            </>
          ) : (
            <p class="text-[12.5px] leading-relaxed text-on-surface-variant">
              Click any point on the coral to see its value and trace its path back to the root. Drag to pan,
              scroll to zoom.
            </p>
          )}
        </div>

        <p class="text-[12px] leading-relaxed text-on-surface-variant">
          Every branch point is a number with two ways to arrive from a smaller one: double it, or — only
          when the arithmetic allows — the reverse of a triple-plus-one step. If the conjecture is true,
          this structure eventually reaches every positive integer.
        </p>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const n = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Three-stop gradient (teal -> sand -> sienna) walked by depth fraction 0..1 — the coloring that turns the reverse graph into something that reads as coral rather than wireframe. */
function depthColor(primary: string, secondary: string, error: string, t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const [c1, c2] = clamped < 0.5 ? [hexToRgb(primary), hexToRgb(secondary)] : [hexToRgb(secondary), hexToRgb(error)];
  const localT = clamped < 0.5 ? clamped * 2 : (clamped - 0.5) * 2;
  const r = Math.round(lerp(c1[0], c2[0], localT));
  const g = Math.round(lerp(c1[1], c2[1], localT));
  const b = Math.round(lerp(c1[2], c2[2], localT));
  return `rgb(${r}, ${g}, ${b})`;
}

function Slider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onInput: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div class="mb-4">
      <div class="mb-1.5 flex items-center justify-between">
        <span class="text-[12px] text-on-surface-variant">{props.label}</span>
        <span class="font-mono tnum text-[12px] text-on-surface">{props.format(props.value)}</span>
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onInput={(e) => props.onInput(Number(e.currentTarget.value))}
        class="w-full"
      />
    </div>
  );
}
