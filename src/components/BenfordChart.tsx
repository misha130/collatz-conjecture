import { createMemo, createResource, For, Show } from "solid-js";
import { benfordFrequency, collectBenfordDigits } from "../lib/collatz";

const SEED_COUNT = 20_000;

/**
 * Every leading digit that appears across thousands of hailstone sequences,
 * tabulated against the theoretical Benford curve. Shared values are counted
 * again each time they appear in a different trajectory.
 */
export default function BenfordChart() {
  const [data] = createResource(() => collectBenfordDigits(SEED_COUNT));

  const bars = createMemo(() => {
    const d = data();
    if (!d) return [];
    return Array.from({ length: 9 }, (_, i) => {
      const digit = i + 1;
      const observed = d.counts[digit] / d.total;
      const expected = benfordFrequency(digit);
      return { digit, observed, expected };
    });
  });

  const maxFrac = createMemo(() => Math.max(...bars().map((b) => Math.max(b.observed, b.expected)), 0.32));

  return (
    <div class="corner-ticks min-w-0 border border-hairline bg-surface-container-low/40 p-6">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p class="label text-outline">Leading digits in {SEED_COUNT.toLocaleString()} trajectories</p>
        <div class="flex items-center gap-4 text-[11.5px]">
          <span class="flex items-center gap-1.5 text-on-surface-variant">
            <span class="h-2.5 w-2.5 bg-primary" /> observed
          </span>
          <span class="flex items-center gap-1.5 text-on-surface-variant">
            <span class="h-2.5 w-[2px] bg-outline" /> Benford's law
          </span>
        </div>
      </div>

      <Show when={data()} fallback={<p class="text-on-surface-variant">Scanning {SEED_COUNT.toLocaleString()} sequences…</p>}>
        <div class="flex items-end gap-1 sm:gap-4" style={{ height: "220px" }}>
          <For each={bars()}>
            {(b) => (
              <div class="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div class="relative flex h-[170px] w-full items-end justify-center">
                  <div
                    class="w-full max-w-9 bg-primary/85 transition-[height] duration-700 ease-out"
                    style={{ height: `${(b.observed / maxFrac()) * 100}%` }}
                  />
                  <div
                    class="absolute w-full max-w-11 border-t-2 border-dashed border-outline"
                    style={{ bottom: `${(b.expected / maxFrac()) * 100}%` }}
                  />
                </div>
                <p class="font-display text-[13px] font-bold text-on-surface">{b.digit}</p>
                <p class="font-mono tnum hidden text-[10.5px] text-on-surface-variant min-[360px]:block">
                  {(b.observed * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </For>
        </div>
        <p class="mt-6 border-t border-hairline pt-4 text-[13px] leading-[1.7] text-on-surface-variant">
          This scan contains {data()!.total.toLocaleString()} values, counting a value again each time it appears
          in another trajectory. About {(bars()[0]?.observed * 100).toFixed(0)}% begin with 1; Benford's law
          predicts {(benfordFrequency(1) * 100).toFixed(1)}%. Similar distributions often appear in data that
          span several orders of magnitude, although a wide range alone is not enough to produce one.
        </p>
      </Show>
    </div>
  );
}
