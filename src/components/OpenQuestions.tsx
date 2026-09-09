const CARDS = [
  {
    tag: "Failure mode 01",
    title: "A number that never comes down",
    body: "No starting value is known to grow forever, but no proof excludes one. Direct computer verification currently reaches 2^71.",
  },
  {
    tag: "Failure mode 02",
    title: "A hidden loop",
    body: "A counterexample could also enter a cycle that does not include 1. Under the rule used here, any such cycle must be longer than 355,504,839,929 steps.",
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
          <p class="label text-primary">A useful comparison</p>
          <h3 class="font-display mt-3 text-[14px] font-bold uppercase tracking-[0.05em] text-on-surface">
            Pólya's conjecture
          </h3>
          <p class="mt-3 max-w-3xl text-[13.5px] leading-[1.7] text-on-surface-variant">
            Let Ω(n) count the prime factors of n with multiplicity, so Ω(12) = 3 and Ω(1) = 0.
            Pólya studied the claim that, for every N ≥ 2, at least half the integers from 1 to N have
            odd Ω(n). Every value checked at the time supported the claim.
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
            C. Brian Haselgrove disproved the claim in 1958 by showing that a counterexample existed
            near 1.845 × 10<sup>361</sup>. A much smaller explicit example was found in 1960. Tanaka
            later identified the smallest one, shown here.
          </div>
        </div>
      </div>

      <p class="mt-5 max-w-3xl text-[13px] leading-[1.7] text-outline">
        The Collatz conjecture has been checked up to 2<sup>71</sup>, about 2.36 × 10<sup>21</sup>. That is
        strong computational evidence, but it is not a proof.
      </p>
    </div>
  );
}
