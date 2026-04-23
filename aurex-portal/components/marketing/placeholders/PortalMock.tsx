/**
 * Hand-built static mockups of the procurement portal, rendered in the
 * new paper/ink design system. Used on the homepage to replace generic
 * SaaS feature cards with proof-of-product visuals. Swap to real
 * screenshots later without layout changes.
 */

type Variant = "approvals" | "budget" | "catalog";

export default function PortalMock({ variant }: { variant: Variant }) {
  return (
    <div className="relative border border-rule bg-white">
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-rule px-3 py-2">
        <span className="h-2 w-2 rounded-full border border-rule-strong" />
        <span className="h-2 w-2 rounded-full border border-rule-strong" />
        <span className="h-2 w-2 rounded-full border border-rule-strong" />
        <span className="ml-3 font-mono text-[0.65rem] text-ink-subtle">
          portal.aurexmedical.com / {variant}
        </span>
      </div>
      {variant === "approvals" && <Approvals />}
      {variant === "budget" && <Budget />}
      {variant === "catalog" && <Catalog />}
    </div>
  );
}

function Approvals() {
  const rows = [
    { who: "R. Chen, BIO", item: "Insulin syringes, 1mL (qty 500)", amt: "$412.00", state: "pending" },
    { who: "A. Novak, CHEM", item: "ACS ethanol, 4L (qty 6)", amt: "$189.40", state: "approved" },
    { who: "M. Okafor, PHYS", item: "Nitrile gloves, M (qty 20 boxes)", amt: "$268.00", state: "flagged" },
    { who: "S. Patel, BIO", item: "Filter tips 200μL (qty 12 racks)", amt: "$94.50", state: "approved" },
  ];
  return (
    <div className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-sans text-xs font-medium text-ink">Pending approvals</span>
        <span className="font-mono text-[0.65rem] text-ink-muted">dept head · week 17</span>
      </div>
      <div className="divide-y divide-rule border border-rule">
        {rows.map((r) => (
          <div key={r.item} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-2.5">
            <div className="min-w-0">
              <div className="truncate font-sans text-[0.72rem] text-ink">{r.item}</div>
              <div className="font-sans text-[0.65rem] text-ink-subtle">{r.who}</div>
            </div>
            <div className="font-sans text-[0.72rem] tabular-nums text-ink">{r.amt}</div>
            <StateTag state={r.state} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StateTag({ state }: { state: string }) {
  const map: Record<string, string> = {
    pending: "border-rule-strong text-ink-muted",
    approved: "border-ink text-ink",
    flagged: "border-aurex-rust text-aurex-rust",
  };
  return (
    <span className={`border px-2 py-0.5 font-sans text-[0.6rem] uppercase tracking-widest ${map[state] ?? ""}`}>
      {state}
    </span>
  );
}

function Budget() {
  const depts = [
    { name: "Biology", used: 72, amt: "$43,200 of $60,000" },
    { name: "Chemistry", used: 54, amt: "$27,000 of $50,000" },
    { name: "Physics", used: 88, amt: "$35,200 of $40,000", warn: true },
    { name: "Materials Sci.", used: 31, amt: "$9,300 of $30,000" },
  ];
  return (
    <div className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-sans text-xs font-medium text-ink">FY26 supply budget</span>
        <span className="font-mono text-[0.65rem] text-ink-muted">fiscal year to date</span>
      </div>
      <div className="flex flex-col gap-3">
        {depts.map((d) => (
          <div key={d.name}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="font-sans text-[0.72rem] text-ink">{d.name}</span>
              <span className="font-sans text-[0.65rem] tabular-nums text-ink-subtle">{d.amt}</span>
            </div>
            <div className="relative h-1.5 w-full border border-rule-strong">
              <div
                className={`absolute left-0 top-0 h-full ${d.warn ? "bg-aurex-rust" : "bg-ink"}`}
                style={{ width: `${d.used}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Catalog() {
  const items = [
    { sku: "AX-SYR-1ML-28G", name: "Insulin syringe, 1mL, 28G × ½″", price: "$0.84", unit: "each" },
    { sku: "AX-GLV-NIT-M", name: "Nitrile glove, powder-free, medium", price: "$12.40", unit: "box/100" },
    { sku: "AX-ETH-200-4L", name: "Ethanol 200 proof, ACS grade", price: "$31.50", unit: "4L" },
    { sku: "AX-TIP-200F", name: "Filter tip 200μL, sterile rack", price: "$7.90", unit: "rack/96" },
  ];
  return (
    <div className="p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-sans text-xs font-medium text-ink">Institution catalog</span>
        <span className="font-mono text-[0.65rem] text-ink-muted">contract pricing</span>
      </div>
      <div className="divide-y divide-rule border border-rule">
        {items.map((it) => (
          <div key={it.sku} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5">
            <span className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-subtle">{it.sku}</span>
            <span className="truncate font-sans text-[0.72rem] text-ink">{it.name}</span>
            <span className="font-sans text-[0.72rem] tabular-nums text-ink">
              {it.price} <span className="text-ink-subtle">/ {it.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
