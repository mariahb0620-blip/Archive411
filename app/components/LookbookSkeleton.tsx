export default function LookbookSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="aspect-[4/5] rounded-lg bg-charcoal/60 md:aspect-[21/9] md:rounded-none" />
      <div className="space-y-3 border-b border-smoke/20 pb-8">
        <div className="h-3 w-24 rounded bg-charcoal/60" />
        <div className="h-10 w-3/4 max-w-md rounded bg-charcoal/60" />
        <div className="h-4 w-full max-w-xl rounded bg-charcoal/40" />
      </div>
      {[1, 2].map((n) => (
        <div key={n} className="space-y-4 border-b border-smoke/20 pb-10">
          <div className="h-8 w-2/3 max-w-sm rounded bg-charcoal/60" />
          <div className="h-4 w-full max-w-lg rounded bg-charcoal/40" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-charcoal/50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
