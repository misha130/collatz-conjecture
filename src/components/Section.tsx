import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { reveal } from "../lib/useReveal";
reveal;

interface Props {
  eyebrow?: string;
  title: JSX.Element;
  lede?: JSX.Element;
  narrow?: boolean;
  center?: boolean;
  id?: string;
  children?: JSX.Element;
}

/** Shared section shell: eyebrow, display title, optional lede, then content. */
export default function Section(props: Props) {
  return (
    <section id={props.id} class={`scroll-mt-20 px-5 py-16 sm:py-20 ${props.narrow ? "mx-auto max-w-3xl" : ""}`}>
      <div class={props.narrow ? "" : "mx-auto max-w-[1440px]"}>
        <div class={props.center ? "mx-auto max-w-3xl text-center" : ""} use:reveal={undefined}>
          <Show when={props.eyebrow}>
            <p class={`label mb-4 flex items-center gap-2.5 text-primary ${props.center ? "justify-center" : ""}`}>
              <span class="h-1.5 w-1.5 bg-primary" aria-hidden="true" />
              {props.eyebrow}
            </p>
          </Show>
          <h2 class={`font-display text-[28px] font-bold uppercase leading-[1.12] tracking-[0.01em] text-on-surface sm:text-[34px] ${props.center ? "text-center" : ""}`}>
            {props.title}
          </h2>
          <Show when={props.lede}>
            <p class={`mt-4 text-[15px] leading-[1.75] text-on-surface-variant ${props.center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
              {props.lede}
            </p>
          </Show>
        </div>
        {props.children}
      </div>
    </section>
  );
}
