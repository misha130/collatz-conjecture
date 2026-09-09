const MILESTONES = [
  {
    year: "1976",
    who: "Riho Terras",
    body: "Showed that almost every Collatz sequence eventually dips below its own starting value — \"almost every\" in the precise sense that the fraction of exceptions shrinks to zero as the numbers grow.",
  },
  {
    year: "1979",
    who: "—",
    body: "The bound tightened: almost all sequences fall below n^0.869 at some point along the way.",
  },
  {
    year: "1994",
    who: "—",
    body: "Tightened again, to n^0.7925 — a smaller and smaller ceiling, but still a ceiling, not a proof that every sequence obeys it.",
  },
  {
    year: "2019",
    who: "Terence Tao",
    body: "Proved that almost all Collatz orbits attain almost bounded values: for any function that creeps to infinity — log(n), even log(log(log(n))) — almost every starting number eventually dips below it.",
  },
];

const TAO_QUOTE = "This is about as close as one can get to the Collatz conjecture without actually solving it.";

/**
 * The sequence of "almost all" results tightening the noose around the
 * conjecture without ever closing it — each one a genuine advance, none of
 * them a proof, because "almost all" always leaves room for exceptions.
 */
export default function ProofProgress() {
  return (
    <div class="mt-10">
      <div class="grid gap-0 border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
        {MILESTONES.map((m) => (
          <div class="border-b border-r border-hairline p-5">
            <p class="font-display tnum text-[22px] font-bold leading-none text-hairline-strong">{m.year}</p>
            {m.who !== "—" && (
              <p class="label mt-3 text-primary">{m.who}</p>
            )}
            <p class="mt-2.5 text-[13px] leading-[1.7] text-on-surface-variant">{m.body}</p>
          </div>
        ))}
      </div>

      <div class="mt-8 border-l-2 border-primary bg-surface-container-low/50 px-6 py-5">
        <p class="font-serif text-[19px] leading-snug text-on-surface">“{TAO_QUOTE}”</p>
        <p class="label mt-3 text-outline">— Terence Tao, public lecture, 2020</p>
      </div>
    </div>
  );
}
