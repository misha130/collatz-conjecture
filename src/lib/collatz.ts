/**
 * Core Collatz / hailstone-sequence math. Pure functions, no framework
 * dependencies, so every visualization in the app computes from the same
 * source of truth.
 *
 * Numbers are kept as plain JS doubles (safe up to 2^53). That is enormous
 * headroom for a playground where the seed is at most a few billion — the
 * famous early peaks (27 -> 9,232; 9,663 -> ~27,000,000) are nowhere near
 * the limit. SAFE_SEED_MAX below is a UI guardrail, not a math one.
 */

export const SAFE_SEED_MAX = 1_000_000_000; // 1 billion — generous, still instant
export const MAX_STEPS = 100_000; // guards against float precision issues, never hit in practice

export interface HailstoneResult {
  seed: number;
  /** Full trajectory including the seed and the terminal 1. */
  sequence: number[];
  /** Total stopping time — steps to reach 1. */
  steps: number;
  /** Highest altitude reached. */
  peak: number;
  /** Index in `sequence` where the peak occurs. */
  peakIndex: number;
  oddSteps: number;
  evenSteps: number;
  /** True if MAX_STEPS was hit without reaching 1 (should never happen for tested ranges). */
  truncated: boolean;
}

/** One Collatz step. Works for negative seeds too — see the three known negative cycles. */
export function collatzStep(n: number): number {
  if (n % 2 === 0) return n / 2;
  return 3 * n + 1;
}

/** Is n even, using truncating semantics that also behave for negatives. */
function isEven(n: number): boolean {
  return n % 2 === 0;
}

/**
 * The three known cycles once you extend the rule to negative integers:
 * the trivial one and two "negative hailstone" loops. Detecting a repeat
 * lets the sequence generator terminate on those instead of the positive
 * fixed point.
 */
const KNOWN_CYCLES: number[][] = [
  [1, 4, 2],
  [-1],
  [-5, -14, -7, -20, -10],
  [-17, -50, -25, -74, -37, -110, -55, -164, -82, -41, -122, -61, -182, -91, -272, -136, -68, -34],
];

function cycleContaining(n: number): number[] | null {
  for (const cycle of KNOWN_CYCLES) {
    if (cycle.includes(n)) return cycle;
  }
  return null;
}

/** Human label for whichever of the four known cycles a value belongs to. */
export function cycleLabel(n: number): string {
  const cycle = cycleContaining(n);
  if (!cycle) return "no known cycle";
  if (cycle === KNOWN_CYCLES[0]) return "the 4 → 2 → 1 loop";
  const lowest = Math.min(...cycle);
  return `the ${cycle.length}-number loop through ${lowest}`;
}

/**
 * Runs the hailstone sequence from `seed` until it lands in a known cycle
 * (1 for every positive integer ever tested; one of two small loops if
 * negative seeds are allowed).
 */
export function hailstone(seed: number, opts: { allowNegative?: boolean } = {}): HailstoneResult {
  const { allowNegative = false } = opts;
  if (!Number.isFinite(seed) || !Number.isInteger(seed)) {
    throw new Error("seed must be an integer");
  }
  if (!allowNegative && seed < 1) {
    throw new Error("seed must be a positive integer");
  }
  if (seed === 0) {
    return { seed, sequence: [0], steps: 0, peak: 0, peakIndex: 0, oddSteps: 0, evenSteps: 0, truncated: false };
  }

  const sequence: number[] = [seed];
  let current = seed;
  let oddSteps = 0;
  let evenSteps = 0;
  let peak = seed;
  let peakIndex = 0;
  let truncated = true;

  // The stopping condition: a positive seed always stops the moment it
  // reaches 1. A negative seed (only reachable via allowNegative) has no
  // single fixed point, so it stops as soon as it revisits any number
  // already seen in this run — that revisit marks the entry into a cycle.
  const seen = allowNegative ? new Set<number>([current]) : null;

  for (let i = 0; i < MAX_STEPS; i++) {
    if (current === 1) {
      truncated = false;
      break;
    }

    const odd = !isEven(current);
    if (odd) oddSteps++;
    else evenSteps++;

    current = collatzStep(current);

    if (seen) {
      if (seen.has(current)) {
        sequence.push(current);
        truncated = false;
        break;
      }
      seen.add(current);
    }

    sequence.push(current);

    if (Math.abs(current) > Number.MAX_SAFE_INTEGER / 4) {
      // Would be a genuine counterexample. Bail out rather than overflow.
      truncated = true;
      break;
    }
    if (current > peak) {
      peak = current;
      peakIndex = sequence.length - 1;
    }
  }

  return {
    seed,
    sequence,
    steps: sequence.length - 1,
    peak,
    peakIndex,
    oddSteps,
    evenSteps,
    truncated,
  };
}

/** Just the total stopping time — cheaper than building the full array when only the count matters. */
export function stoppingTime(seed: number): number {
  let current = seed;
  let steps = 0;
  while (current !== 1) {
    current = collatzStep(current);
    steps++;
    if (steps > MAX_STEPS) break;
  }
  return steps;
}

/** Just the peak altitude — cheaper than building the full array. */
export function peakValue(seed: number): number {
  let current = seed;
  let peak = seed;
  let steps = 0;
  while (current !== 1) {
    current = collatzStep(current);
    if (current > peak) peak = current;
    steps++;
    if (steps > MAX_STEPS) break;
  }
  return peak;
}

/** Leading (most significant) decimal digit of a positive number. */
export function leadingDigit(n: number): number {
  if (n <= 0) return 0;
  let x = n;
  while (x >= 10) x = Math.floor(x / 10);
  return x;
}

/** Benford's Law predicted frequency for leading digit d (1-9). */
export function benfordFrequency(d: number): number {
  return Math.log10(1 + 1 / d);
}

export interface BenfordResult {
  /** counts[d] for d in 1..9 */
  counts: number[];
  total: number;
  seedsScanned: number;
}

/**
 * Scans hailstone sequences for seeds 1..seedCount and tabulates the leading
 * digit of every number that appears in every sequence, the way the video
 * builds its histogram: one sequence at a time, folded into a running total.
 */
export function collectBenfordDigits(seedCount: number): BenfordResult {
  const counts = new Array(10).fill(0);
  let total = 0;
  for (let seed = 1; seed <= seedCount; seed++) {
    let current = seed;
    let guard = 0;
    while (true) {
      counts[leadingDigit(current)]++;
      total++;
      if (current === 1) break;
      current = collatzStep(current);
      guard++;
      if (guard > MAX_STEPS) break;
    }
  }
  return { counts, total, seedsScanned: seedCount };
}

export interface SeedScanPoint {
  seed: number;
  steps: number;
  peak: number;
}

/** Scans seeds 1..count and records stopping time + peak for each — the raw data behind the scatter plots. */
export function scanSeeds(count: number): SeedScanPoint[] {
  const out: SeedScanPoint[] = [];
  for (let seed = 1; seed <= count; seed++) {
    let current = seed;
    let steps = 0;
    let peak = seed;
    while (current !== 1) {
      current = collatzStep(current);
      steps++;
      if (current > peak) peak = current;
      if (steps > MAX_STEPS) break;
    }
    out.push({ seed, steps, peak });
  }
  return out;
}

/* ── Reverse graph — the "coral" ────────────────────────────────────────────
 * A node's forward step lands on collatzStep(n). Reversed, the predecessors
 * of m are: 2m (always valid), and (m-1)/3 when that is a positive odd
 * integer greater than 1 (the only way 3n+1 could have produced m). Walking
 * these reverse edges out from 1 builds the tree every positive integer is
 * conjectured to hang from.
 * ────────────────────────────────────────────────────────────────────────── */

export interface CoralNode {
  id: number;
  value: number;
  depth: number;
  x: number;
  y: number;
  angle: number;
  parent: CoralNode | null;
  children: CoralNode[];
  /** true if reached via the ×2 branch, false via the (n-1)/3 branch (root has neither). */
  viaDouble: boolean | null;
}

export interface CoralGraph {
  nodes: CoralNode[];
  root: CoralNode;
  edgeCount: number;
}

export interface CoralParams {
  /** Max nodes to generate (breadth-first cutoff). */
  maxNodes: number;
  /** Degrees to rotate for the ×2 (even) branch. */
  angleEven: number;
  /** Degrees to rotate for the (n-1)/3 (odd) branch. */
  angleOdd: number;
  /** Base segment length at depth 0. */
  segmentLength: number;
  /** Per-depth length decay, 0..1 (1 = no decay). */
  decay: number;
}

function reversePredecessors(m: number): { double: number; third: number | null } {
  const double = 2 * m;
  let third: number | null = null;
  if ((m - 1) % 3 === 0) {
    const candidate = (m - 1) / 3;
    if (candidate > 1 && candidate % 2 !== 0) {
      third = candidate;
    }
  }
  return { double, third };
}

/**
 * Builds the reverse Collatz tree rooted at 1, breadth-first, stopping once
 * `maxNodes` nodes exist. Each node's (x, y) is placed with simple turtle
 * graphics: walking from parent to child rotates the running heading by a
 * fixed angle that depends on which of the two branches produced the child —
 * the same rule the video describes for turning the plain directed graph
 * into an organic "coral" shape.
 */
export function buildCoral(params: CoralParams): CoralGraph {
  const { maxNodes, angleEven, angleOdd, segmentLength, decay } = params;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const root: CoralNode = {
    id: 1,
    value: 1,
    depth: 0,
    x: 0,
    y: 0,
    angle: -Math.PI / 2,
    parent: null,
    children: [],
    viaDouble: null,
  };

  const nodes: CoralNode[] = [root];
  const queue: CoralNode[] = [root];
  let edgeCount = 0;
  let nextId = 2;

  while (queue.length > 0 && nodes.length < maxNodes) {
    const node = queue.shift()!;
    const { double, third } = reversePredecessors(node.value);
    const len = segmentLength * Math.pow(decay, node.depth);

    const spawn = (value: number, viaDouble: boolean) => {
      if (nodes.length >= maxNodes) return;
      const delta = toRad(viaDouble ? angleEven : -angleOdd);
      const angle = node.angle + delta;
      const child: CoralNode = {
        id: nextId++,
        value,
        depth: node.depth + 1,
        x: node.x + Math.cos(angle) * len,
        y: node.y + Math.sin(angle) * len,
        angle,
        parent: node,
        children: [],
        viaDouble,
      };
      node.children.push(child);
      nodes.push(child);
      queue.push(child);
      edgeCount++;
    };

    spawn(double, true);
    if (third !== null) spawn(third, false);
  }

  return { nodes, root, edgeCount };
}

/** Path from a node back to the root, root-first. */
export function pathToRoot(node: CoralNode): CoralNode[] {
  const path: CoralNode[] = [];
  let cur: CoralNode | null = node;
  while (cur) {
    path.unshift(cur);
    cur = cur.parent;
  }
  return path;
}

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}
