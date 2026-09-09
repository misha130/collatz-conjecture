const CARDS = [
  {
    tag: "Failure mode 01",
    title: "A number that never comes down",
    body: "Nobody has found a starting number whose sequence grows forever instead of falling to 1. Nobody has proven one can't exist, either — the search space beyond 2^71 is vastly larger than the space already checked.",
  },
  {
    tag: "Failure mode 02",
    title: "A hidden loop",
    body: "Besides 4 → 2 → 1, could some other set of numbers cycle among themselves forever, disconnected from the main structure? Current bounds rule out any such loop shorter than 355,504,839,929 steps under the unshortened rule used here — but not a longer one.",
  },
];

/**
 * Two ways the conjecture could still be false, plus the field's standing
 * reminder that "true for everything checked" and "true" are different
 * claims: Pólya's conjecture held for every case tested until a
 * counterexample turned up almost incomprehensibly far out.
 */
export default function OpenQuestions() {
  return (
    <div class="mt-10">
      <div class="grid gap-0 border-l border-t border-hairline sm:grid-cols-2">
        {CARDS.map((c) => (
          <div class="border-b border-r border-hairline p-6">
            <p class="label text-primary">{c.tag}</p>
            <h3 class="font-display mt-3 text-[14px] font-bold uppercase tracking-[0.05em] text-on-surface">{c.title}</h3>
            <p class="mt-3 text-[13.5px] leading-[1.7] text-on-surface-variant">{c.body}</p>
          </div>
        ))}
      </div>

      <div class="mt-8 border border-hairline">
        <div class="border-b border-hairline p-6">
          <p class="label text-primary">A cautionary tale</p>
          <h3 class="font-display mt-3 text-[14px] font-bold uppercase tracking-[0.05em] text-on-surface">
            Pólya's conjecture
          </h3>
          <p class="mt-3 max-w-3xl text-[13.5px] leading-[1.7] text-on-surface-variant">
            For an integer n ≥ 2, let Ω(n) count its prime factors with multiplicity (so Ω(12) = 3,
            since 12 = 2 × 2 × 3). In 1919, George Pólya conjectured that for every N ≥ 2, at least
            half the integers from 2 to N have Ω(n) odd rather than even. It matched every case
            checked by hand and, later, by computer — for decades.
          </p>
        </div>

        <div class="grid gap-0 sm:grid-cols-[auto_1fr]">
          <div class="border-b border-r-0 border-hairline p-6 sm:border-b-0 sm:border-r">
            <p class="label text-outline">Smallest counterexample</p>
            <p class="font-display tnum mt-2 text-[26px] font-bold leading-none text-error">
              906,150,257
            </p>
            <p class="mt-2 text-[11.5px] text-outline">
              found by Minoru Tanaka, 1980
            </p>
          </div>
          <div class="p-6 text-[13.5px] leading-[1.7] text-on-surface-variant">
            C. Brian Haselgrove disproved the conjecture in 1958 by proving that a violation existed,
            estimating one near 1.845 × 10<sup>361</sup>. An explicit counterexample near 906 million
            was found in 1960; Tanaka later identified the smallest one shown here. A conjecture can
            survive an enormous body of computation and still fail.
          </div>
        </div>
      </div>

      <p class="mt-5 max-w-3xl text-[13px] leading-[1.7] text-outline">
        Collatz has been checked up to 2<sup>71</sup> — about 2.36 × 10<sup>21</sup>. Against the scale a
        false conjecture can hide at, that is not nearly the wall of evidence it looks like.
      </p>
    </div>
  );
}
