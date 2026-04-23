import type { SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement> & { size?: number };

function Frame({ size = 80, children, ...props }: MarkProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Lead product — Insulin Syringe */
export function SyringeMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M12 58l10-10" />
      <path d="M10 60l4 4" />
      <path d="M22 48l22-22" />
      <path d="M18 44l22-22" />
      <path d="M40 20l14 14" />
      <path d="M44 16l14 14" />
      <path d="M54 30l6 6 10-10-6-6z" />
      <path d="M48 24l4 4" />
      <path d="M44 28l4 4" />
      <path d="M40 32l4 4" />
      <path d="M36 36l4 4" />
    </Frame>
  );
}

export function PipetteMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <rect x="34" y="8" width="12" height="14" rx="1" />
      <path d="M38 22h4v24l-2 6-2-6V22z" />
      <path d="M38 28h4M38 34h4M38 40h4" />
      <path d="M40 58v6" />
      <path d="M36 64h8" />
    </Frame>
  );
}

export function PpeMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M24 22c4-6 8-8 16-8s12 2 16 8" />
      <path d="M20 30c0 14 8 24 20 24s20-10 20-24" />
      <path d="M28 34c2 2 6 3 12 3s10-1 12-3" />
      <path d="M32 42a4 4 0 008 0" />
      <path d="M40 42a4 4 0 008 0" />
      <path d="M36 52v4" />
      <path d="M44 52v4" />
    </Frame>
  );
}

export function ReagentMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M32 10h16" />
      <path d="M34 10v14l-12 28a6 6 0 005 9h26a6 6 0 005-9L46 24V10" />
      <path d="M26 42h28" />
      <circle cx="32" cy="50" r="1.5" />
      <circle cx="44" cy="54" r="1.5" />
      <circle cx="38" cy="46" r="1" />
    </Frame>
  );
}

export function GlasswareMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M20 14h18" />
      <path d="M22 14v28c0 6-6 8-6 14v8h26v-8c0-6-6-8-6-14V14" />
      <path d="M16 50h26" />
      <path d="M48 22h16" />
      <path d="M50 22v34a4 4 0 004 4h6a4 4 0 004-4V22" />
      <path d="M50 40h14" />
    </Frame>
  );
}

export function InstrumentMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <rect x="10" y="22" width="60" height="36" rx="2" />
      <path d="M10 32h60" />
      <circle cx="22" cy="44" r="6" />
      <circle cx="22" cy="44" r="2" />
      <path d="M36 42h24M36 48h16" />
      <path d="M14 28h2M20 28h2M26 28h2" />
    </Frame>
  );
}

export function TubesMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M14 14h14v40a7 7 0 01-14 0V14z" />
      <path d="M14 20h14M14 30h14M14 40h14" />
      <path d="M36 14h14v40a7 7 0 01-14 0V14z" />
      <path d="M36 24h14M36 34h14" />
      <path d="M58 14h12v28a6 6 0 01-12 0V14z" />
    </Frame>
  );
}

export function FiltrationMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M18 12h44l-14 22v20a4 4 0 01-8 0V34z" />
      <path d="M20 18h40" />
      <path d="M28 26h24" />
      <circle cx="40" cy="56" r="1" />
      <circle cx="40" cy="62" r="1" />
      <circle cx="40" cy="68" r="1" />
    </Frame>
  );
}

export function NeedleMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M12 62l8-8" />
      <path d="M18 56l36-36" />
      <path d="M54 20l6 6" />
      <path d="M60 14l6 6-6 6-6-6z" />
    </Frame>
  );
}
