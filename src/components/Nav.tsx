import { createSignal, onCleanup, onMount } from "solid-js";

const LINKS = [
  { href: "#rule", label: "The rule" },
  { href: "#explorer", label: "Explorer" },
  { href: "#map", label: "The coral" },
  { href: "#statistics", label: "Statistics" },
  { href: "#unsolved", label: "Why it's hard" },
];

export default function Nav() {
  const [open, setOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  const onScroll = () => setScrolled(window.scrollY > 8);
  onMount(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });
  onCleanup(() => window.removeEventListener("scroll", onScroll));

  return (
    <header
      class={`sticky top-0 z-40 border-b transition-colors ${
        scrolled() ? "border-hairline bg-background/92 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <nav class="ruled mx-auto flex h-14 max-w-[1440px] items-center gap-1 px-5">
        <a href="#top" class="mr-4 flex shrink-0 items-center gap-2.5">
          <span
            class="flex h-6 w-6 items-center justify-center border border-on-surface bg-on-surface"
            aria-hidden="true"
          >
            <span class="font-display text-[12px] font-bold leading-none text-background">C</span>
          </span>
          <span class="font-display text-[14px] font-bold uppercase tracking-[0.04em] text-on-surface">
            Collatz
          </span>
        </a>

        <div class="hidden flex-1 items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <a
              href={l.href}
              class="label px-3 py-2 text-outline transition-colors hover:text-on-surface"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          class="label ml-auto flex items-center gap-2 px-2 py-2 text-on-surface lg:hidden"
          aria-expanded={open()}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open())}
        >
          <span class="relative block h-3.5 w-4">
            <span
              class={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform ${open() ? "translate-y-[6.5px] rotate-45" : ""}`}
            />
            <span class={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity ${open() ? "opacity-0" : ""}`} />
            <span
              class={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform ${open() ? "-translate-y-[6.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {open() && (
        <div class="border-t border-hairline bg-surface-container-lowest lg:hidden">
          <div class="mx-auto flex max-w-[1440px] flex-col px-5 py-2">
            {LINKS.map((l) => (
              <a
                href={l.href}
                class="label border-b border-hairline py-3.5 text-outline last:border-none"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
