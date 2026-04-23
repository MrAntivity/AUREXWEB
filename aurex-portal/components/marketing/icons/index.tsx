import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
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

export function ArrowRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </Base>
  );
}

export function ArrowDownRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 8v10H8" />
    </Base>
  );
}

export function Check(props: IconProps) {
  return (
    <Base {...props} strokeWidth={1.5}>
      <path d="M4 12l5 5 11-12" />
    </Base>
  );
}

export function Dash(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14" />
    </Base>
  );
}

export function Plus(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export function Close(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Base>
  );
}

export function Menu(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

/* Concept marks used on homepage feature sections */

export function GavelMark(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="3" />
      <path d="M12 11v9" />
      <path d="M6 20h12" />
      <path d="M8 5h8" />
    </Base>
  );
}

export function LedgerMark(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 9h16" />
      <path d="M8 13h8M8 16h5" />
    </Base>
  );
}

export function ShippingMark(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 8h11v8H3z" />
      <path d="M14 11h4l3 3v2h-7" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </Base>
  );
}

export function CatalogMark(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 5h6a2 2 0 012 2v13" />
      <path d="M19 5h-6a2 2 0 00-2 2v13" />
      <path d="M5 5v15h14V5" />
    </Base>
  );
}

export function SpeedMark(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 14a8 8 0 0116 0" />
      <path d="M12 14l4-4" />
      <circle cx="12" cy="14" r="1" />
    </Base>
  );
}

export function CompassMark(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M15 9l-2 5-4 1 2-5 4-1z" />
    </Base>
  );
}

export function LinkedinMark(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" />
      <circle cx="8" cy="9" r="0.6" fill="currentColor" />
      <path d="M8 12v5" />
      <path d="M12 17v-5" />
      <path d="M12 14c0-1.5 1-2 2-2s2 .5 2 2v3" />
    </Base>
  );
}
