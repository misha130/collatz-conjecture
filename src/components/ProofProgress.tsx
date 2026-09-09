const MILESTONES = [
  {
    year: "1976",
    who: "Riho Terras",
    body: "Showed that almost every Collatz sequence eventually falls below its starting value. The possible exceptions have natural density zero.",
  },
  {
    year: "1979",
    who: "—",
    body: "Later work showed that almost all sequences eventually fall below n^0.869.",
  },
  {
    year: "1994",
    who: "Ivan Korec",
    body: "Improved the exponent again: almost all sequences eventually fall below n^0.7925.",
  },
  {
    year: "2019",
    who: "Terence Tao",
    body: "Proved that almost all orbits reach almost bounded values, using logarithmic density. The bound may grow toward infinity as slowly as desired.",
  },
];

const TAO_QUOTE = "You can get as close as you want to the Collatz conjecture, but it’s still out of reach.";

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
        <p class="label mt-3 text-outline">— Terence Tao, Quanta interview, 2019</p>
      </div>
    </div>
  );
}
