# Collatz Conjecture — an interactive field guide

A single-page SolidJS app that explains the Collatz (3n + 1) conjecture: the rule, hailstone
sequences, an interactive "coral" visualization of the reverse graph, live-computed statistics
(Benford's law, peak-altitude scatter), and the state of the (unsolved) proof.

Visual language borrowed from the `decim.dev` marketing site's blueprint design system: warm
cream/teal/sand palette, Space Mono display type, Instrument Serif italic accents, hairline rules
and corner ticks.

## Stack

- [SolidJS](https://www.solidjs.com/) + TypeScript, via Vite
- Tailwind CSS v4 (`@tailwindcss/vite`), design tokens in `src/styles/global.css`
- No charting library — every chart (trajectory line, peak scatter, Benford histogram, the coral
  canvas) is hand-rolled SVG/Canvas in `src/components/`, computed from `src/lib/collatz.ts`

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

## Structure

```
src/
  lib/collatz.ts       core math: hailstone sequences, Benford digits, seed scans, the reverse-graph builder
  lib/useReveal.ts      scroll-reveal directive (use:reveal)
  components/           one component per section/chart
  App.tsx               page assembly
```

All computation — including the ~20,000-sequence Benford scan and the 10,000-seed peak scatter —
runs client-side in the browser, synchronously, on load.
