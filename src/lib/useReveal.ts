/**
 * Solid directive: `use:reveal` marks an element to fade/rise into place the
 * first time it crosses the viewport. One shared IntersectionObserver rather
 * than one per element.
 */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "");
            observer!.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

export function reveal(el: Element, value: () => number | undefined) {
  el.setAttribute("data-reveal", "");
  const d = value();
  if (d) (el as HTMLElement).style.transitionDelay = `${d}ms`;
  getObserver().observe(el);
}

// Solid picks up custom directives via this module augmentation.
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      reveal: number | undefined;
    }
  }
}
