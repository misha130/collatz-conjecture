const STATS = [
  { value: "2^71", sub: "≈ 2.36 × 10^21", label: "Every integer up to here has been checked by distributed computing. All of them reach 1." },
  { value: "186B+", sub: "186,000,000,000", label: "Minimum length any undiscovered loop other than 4·2·1 would have to be, given the search so far." },
  { value: "111", sub: "steps", label: "How long it takes the seed 27 to fall back to 1 — after climbing to 9,232 first." },
  { value: "3/4", sub: "geometric mean", label: "The average shrink factor from one odd number to the next — the statistical reason sequences trend down, not up." },
];

/** The hard numbers behind "we're pretty sure, but not certain." */
export default function RecordsStats() {
  return (
    <div class="grid grid-cols-2 gap-px border border-hairline bg-hairline lg:grid-cols-4">
      {STATS.map((s) => (
        <div class="bg-surface-container-lowest px-5 py-6">
          <p class="font-display tnum text-[26px] font-bold leading-none text-on-surface">{s.value}</p>
          <p class="font-mono tnum mt-1 text-[11px] text-outline">{s.sub}</p>
          <p class="mt-3 text-[12.5px] leading-[1.6] text-on-surface-variant">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
