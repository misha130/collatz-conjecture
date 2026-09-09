const STATS = [
  { value: "2^71", sub: "≈ 2.36 × 10^21", label: "Every integer up to here has been checked by distributed computing. All of them reach 1." },
  { value: "355.5B+", sub: "unshortened steps", label: "Minimum length of any undiscovered loop other than 4·2·1 under the rule used on this page." },
  { value: "111", sub: "steps", label: "How long it takes the seed 27 to fall back to 1 — after climbing to 9,232 first." },
  { value: "3/4", sub: "heuristic mean", label: "The geometric-mean multiplier predicted by a random-parity model, not an average proved for every orbit." },
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
