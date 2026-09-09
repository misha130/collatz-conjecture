const ALIASES = [
  "The Collatz conjecture",
  "The 3n + 1 problem",
  "The Ulam conjecture",
  "Kakutani's problem",
  "The Thwaites conjecture",
  "Hasse's algorithm",
  "The Syracuse problem",
];

const PEOPLE = [
  {
    name: "Lothar Collatz",
    body: "Generally credited with posing the problem in the 1930s. Its exact origin is uncertain, and several mathematicians later encountered it independently.",
  },
  {
    name: "Paul Erdős",
    body: "Offered a cash prize for a proof. He also remarked that mathematics might not yet be ready for problems of this kind.",
  },
  {
    name: "Jeffrey Lagarias",
    body: "A leading expert on the problem who maintains an extensive annotated bibliography of Collatz research.",
  },
  {
    name: "Terence Tao",
    body: "Proved in 2019 that almost all Collatz orbits, measured by logarithmic density, reach almost bounded values.",
  },
];

/** The problem has more aliases than most theorems have proofs. */
export default function NamesGrid() {
  return (
    <div class="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div class="border border-hairline p-6">
        <p class="label mb-4 text-outline">Same rule, seven names</p>
        <ul class="space-y-2.5">
          {ALIASES.map((a, i) => (
            <li class="flex items-center gap-3 text-[14px] text-on-surface">
              <span class="font-mono tnum text-[11px] text-outline">{String(i + 1).padStart(2, "0")}</span>
              {a}
            </li>
          ))}
        </ul>
        <p class="mt-4 border-t border-hairline pt-4 text-[12.5px] leading-relaxed text-on-surface-variant">
          The problem was rediscovered several times in different countries, which accounts for its many names.
        </p>
      </div>

      <div class="grid gap-0 border-l border-t border-hairline sm:grid-cols-2">
        {PEOPLE.map((p) => (
          <div class="border-b border-r border-hairline p-5">
            <p class="font-display text-[13px] font-bold uppercase tracking-[0.05em] text-on-surface">{p.name}</p>
            <p class="mt-2.5 text-[13px] leading-[1.7] text-on-surface-variant">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
