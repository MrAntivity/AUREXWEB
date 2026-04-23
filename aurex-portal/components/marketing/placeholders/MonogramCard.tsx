type Props = {
  initials: string;
  aspect?: "portrait" | "square";
};

/**
 * Designed placeholder for a team photo. Rule-bordered frame + serif
 * monogram — intentionally spartan so it reads as a deliberate sketch,
 * not a gradient blob. Swap to <Image /> later with no layout shift.
 */
export default function MonogramCard({ initials, aspect = "portrait" }: Props) {
  const aspectClass = aspect === "portrait" ? "aspect-[4/5]" : "aspect-square";
  return (
    <div className={`relative w-full ${aspectClass} border border-rule bg-paper-deep/60 overflow-hidden`}>
      {/* Corner tick marks — scientific-journal detail */}
      <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-ink/30" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-ink/30" />
      <span className="absolute left-2 bottom-2 h-3 w-3 border-l border-b border-ink/30" />
      <span className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-ink/30" />

      {/* Center monogram */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-[5rem] leading-none text-ink/70 select-none">
          {initials}
        </span>
      </div>

      {/* Bottom caption */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <span className="font-mono text-[0.65rem] tracking-wide text-ink-muted">
          photo forthcoming
        </span>
      </div>
    </div>
  );
}
