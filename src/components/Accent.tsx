import type { JSX } from "solid-js";

/** One or two words of Instrument Serif italic inside a display headline. */
export default function Accent(props: { children: JSX.Element }) {
  return <span class="font-serif text-primary">{props.children}</span>;
}
