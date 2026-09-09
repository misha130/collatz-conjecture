export default function Footer() {
  return (
    <footer class="border-t border-hairline bg-ink text-on-ink">
      <div class="ruled mx-auto max-w-[1440px] px-5 py-14">
        <div class="grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="flex h-6 w-6 items-center justify-center border border-on-ink" aria-hidden="true">
                <span class="font-display text-[12px] font-bold leading-none text-on-ink">C</span>
              </span>
              <span class="font-display text-[14px] font-bold uppercase tracking-[0.04em] text-on-ink">Collatz</span>
            </div>
            <p class="mt-4 max-w-sm text-[13px] leading-[1.7] text-on-ink-muted">
              n → n/2 if even, 3n + 1 if odd. Every chart and simulation on this page runs client-side,
              in your browser, from that one rule.
            </p>
          </div>

          <div>
            <p class="label text-on-ink-muted">On this page</p>
            <ul class="mt-3 space-y-2 text-[13px] text-on-ink-muted">
              <li><a href="#rule" class="transition-colors hover:text-on-ink">The rule</a></li>
              <li><a href="#explorer" class="transition-colors hover:text-on-ink">Explorer</a></li>
              <li><a href="#map" class="transition-colors hover:text-on-ink">The coral</a></li>
              <li><a href="#statistics" class="transition-colors hover:text-on-ink">Statistics</a></li>
              <li><a href="#unsolved" class="transition-colors hover:text-on-ink">Why it's hard</a></li>
            </ul>
          </div>

          <div>
            <p class="label text-on-ink-muted">Reference</p>
            <ul class="mt-3 space-y-2 text-[13px] text-on-ink-muted">
              <li>
                <a
                  href="https://oeis.org/A006577"
                  target="_blank"
                  rel="noreferrer"
                  class="transition-colors hover:text-on-ink"
                >
                  OEIS A006577 — total stopping times
                </a>
              </li>
              <li>
                <a
                  href="https://oeis.org/A006370"
                  target="_blank"
                  rel="noreferrer"
                  class="transition-colors hover:text-on-ink"
                >
                  OEIS A006370 — the map itself
                </a>
              </li>
              <li>
                <a
                  href="https://pcbarina.fit.vutbr.cz/"
                  target="_blank"
                  rel="noreferrer"
                  class="transition-colors hover:text-on-ink"
                >
                  Barina — verification limit
                </a>
              </li>
              <li>
                <a
                  href="https://arxiv.org/abs/1909.03562"
                  target="_blank"
                  rel="noreferrer"
                  class="transition-colors hover:text-on-ink"
                >
                  Tao — almost bounded orbits
                </a>
              </li>
              <li>
                <a
                  href="https://doi.org/10.1112/S0025579300001480"
                  target="_blank"
                  rel="noreferrer"
                  class="transition-colors hover:text-on-ink"
                >
                  Haselgrove — Pólya disproof
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>All computation runs client-side, in the page you're reading.</p>
          <a href="https://ryware.dev" target="_blank" rel="noreferrer" class="transition-colors hover:text-on-ink">
            ryware.dev
          </a>
        </div>
      </div>
    </footer>
  );
}
