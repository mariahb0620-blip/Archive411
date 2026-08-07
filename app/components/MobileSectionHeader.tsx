import Link from "next/link";

export default function MobileSectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "See all",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-xl text-ivory md:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
