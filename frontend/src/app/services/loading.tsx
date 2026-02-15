export default function ServicesLoading() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border/60">
        <div className="container-art py-20">
          <div className="h-5 w-28 animate-pulse rounded-full bg-muted/60" />
          <div className="mt-5 h-10 w-2/3 animate-pulse rounded-full bg-muted/50" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-muted/40" />
        </div>
      </section>
      <section className="container-art py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`service-skeleton-${index}`}
              className="h-64 rounded-[24px] border border-border/60 bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
