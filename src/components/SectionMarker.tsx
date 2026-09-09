import { reveal } from "../lib/useReveal";
reveal; // referenced so the `use:reveal` directive below resolves & survives noUnusedLocals

interface Props {
  label: string;
  note?: string;
}

/** The band that separates one movement of the page from the next. */
export default function SectionMarker(props: Props) {
  return (
    <div class="border-y border-hairline bg-surface-container-low/40" use:reveal={undefined}>
      <div class="ruled relative mx-auto flex max-w-[1440px] items-center px-5 py-2.5">
        <span class="h-1.5 w-1.5 shrink-0 bg-hairline-strong" aria-hidden="true" />
        <span class="label flex-1 text-center text-outline">{props.label}</span>
        {props.note && (
          <span class="label absolute right-8 hidden text-outline/70 md:inline">{props.note}</span>
        )}
        <span class="h-1.5 w-1.5 shrink-0 bg-hairline-strong" aria-hidden="true" />
      </div>
    </div>
  );
}
