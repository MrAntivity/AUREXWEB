export default function SupplyChain() {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 780 240"
        className="mx-auto block h-auto w-full max-w-3xl text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Baseline rule */}
        <path d="M20 160 H760" strokeOpacity={0.4} />
        {/* Tick marks on baseline */}
        <path d="M90 156v8M270 156v8M510 156v8M700 156v8" strokeOpacity={0.5} />

        {/* Manufacturers — stacked rectangles */}
        <g>
          <rect x="40" y="60" width="100" height="22" />
          <rect x="48" y="82" width="100" height="22" />
          <rect x="56" y="104" width="100" height="22" />
          <text x="90" y="186" textAnchor="middle" className="fill-ink" fontSize="11" fontFamily="var(--font-geist-sans)">
            Manufacturers
          </text>
          <text x="90" y="202" textAnchor="middle" className="fill-ink-muted" fontSize="9" fontFamily="var(--font-geist-mono)">
            direct relationships
          </text>
        </g>

        {/* Flow arrow 1 */}
        <path d="M170 95 H240" />
        <path d="M234 91l6 4-6 4" />

        {/* Aurex + 3PL — diamond framing */}
        <g>
          <rect x="244" y="70" width="130" height="70" />
          <path d="M244 70l65 35 65-35" strokeOpacity={0.3} />
          <text x="309" y="100" textAnchor="middle" className="fill-ink" fontSize="12" fontWeight="600" fontFamily="var(--font-geist-sans)" letterSpacing="-0.01em">
            Aurex
          </text>
          <text x="309" y="118" textAnchor="middle" className="fill-ink-muted" fontSize="10" fontFamily="var(--font-geist-sans)">
            + 3PL network
          </text>
          <text x="309" y="186" textAnchor="middle" className="fill-ink" fontSize="11" fontFamily="var(--font-geist-sans)">
            Warehouse &amp; portal
          </text>
          <text x="309" y="202" textAnchor="middle" className="fill-ink-muted" fontSize="9" fontFamily="var(--font-geist-mono)">
            faster ship, fewer handoffs
          </text>
        </g>

        {/* Flow arrow 2 with portal callout */}
        <path d="M378 95 H470" />
        <path d="M464 91l6 4-6 4" />

        {/* Small portal glyph above arrow */}
        <g transform="translate(410 60)">
          <rect x="0" y="0" width="28" height="20" strokeOpacity={0.6} />
          <path d="M0 6h28" strokeOpacity={0.6} />
          <path d="M4 12h12M4 16h8" strokeOpacity={0.6} />
          <text x="14" y="-6" textAnchor="middle" className="fill-aurex-rust" fontSize="9" fontFamily="var(--font-geist-mono)">
            approvals · budgets
          </text>
        </g>

        {/* Institutions — grouped small rects */}
        <g>
          <rect x="480" y="70" width="60" height="16" />
          <rect x="544" y="70" width="60" height="16" />
          <rect x="480" y="90" width="60" height="16" />
          <rect x="544" y="90" width="60" height="16" />
          <rect x="480" y="110" width="60" height="16" />
          <rect x="544" y="110" width="60" height="16" />
          <text x="510" y="78" textAnchor="middle" className="fill-ink-muted" fontSize="7" fontFamily="var(--font-geist-sans)">
            community college
          </text>
          <text x="574" y="78" textAnchor="middle" className="fill-ink-muted" fontSize="7" fontFamily="var(--font-geist-sans)">
            private university
          </text>
          <text x="510" y="98" textAnchor="middle" className="fill-ink-muted" fontSize="7" fontFamily="var(--font-geist-sans)">
            UC system
          </text>
          <text x="574" y="98" textAnchor="middle" className="fill-ink-muted" fontSize="7" fontFamily="var(--font-geist-sans)">
            medical school
          </text>
          <text x="510" y="118" textAnchor="middle" className="fill-ink-muted" fontSize="7" fontFamily="var(--font-geist-sans)">
            research lab
          </text>
          <text x="574" y="118" textAnchor="middle" className="fill-ink-muted" fontSize="7" fontFamily="var(--font-geist-sans)">
            district
          </text>
          <text x="542" y="186" textAnchor="middle" className="fill-ink" fontSize="11" fontFamily="var(--font-geist-sans)">
            Institutions
          </text>
          <text x="542" y="202" textAnchor="middle" className="fill-ink-muted" fontSize="9" fontFamily="var(--font-geist-mono)">
            real-time visibility
          </text>
        </g>

        {/* Legacy lane — shown below, thinner, for contrast */}
        <g strokeOpacity={0.35}>
          <text x="20" y="228" className="fill-ink-muted" fontSize="9" fontFamily="var(--font-geist-mono)">
            vs. legacy:
          </text>
          <path d="M90 220 H700" strokeDasharray="2 4" />
          <path d="M180 216v8M300 216v8M440 216v8M580 216v8" />
          <text x="180" y="236" textAnchor="middle" className="fill-ink-subtle" fontSize="8" fontFamily="var(--font-geist-sans)">
            mfr
          </text>
          <text x="300" y="236" textAnchor="middle" className="fill-ink-subtle" fontSize="8" fontFamily="var(--font-geist-sans)">
            import
          </text>
          <text x="440" y="236" textAnchor="middle" className="fill-ink-subtle" fontSize="8" fontFamily="var(--font-geist-sans)">
            distributor
          </text>
          <text x="580" y="236" textAnchor="middle" className="fill-ink-subtle" fontSize="8" fontFamily="var(--font-geist-sans)">
            reseller
          </text>
        </g>
      </svg>
    </div>
  );
}
