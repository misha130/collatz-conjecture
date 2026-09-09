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
    body: "German mathematician generally credited with posing the problem in the 1930s — though, fittingly for a conjecture this slippery, its exact origin and its several independent names are disputed.",
  },
  {
    name: "Paul Erdős",
    body: "Offered a cash prize for a proof and, more famously, the assessment mathematicians still quote today: mathematics may simply not be ready for questions like this one.",
  },
  {
    name: "Jeffrey Lagarias",
    body: "The field's leading authority, and keeper of an annotated bibliography of essentially every serious paper written on the problem since the 1970s.",
  },
  {
    name: "Terence Tao",
    body: "Proved in 2019 that almost all Collatz orbits attain almost bounded values — the closest anyone has come to a proof without producing one.",
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
          A problem this easy to restate gets independently rediscovered — which is exactly what happened,
          repeatedly, across different countries and decades.
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
