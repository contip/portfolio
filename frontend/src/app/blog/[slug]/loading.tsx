export default function BlogPostLoading() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border/60">
        <div className="container-art py-16">
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted/60" />
          <div className="mt-5 h-10 w-2/3 animate-pulse rounded-full bg-muted/50" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-muted/40" />
        </div>
      </section>
      <section className="container-art py-16">
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded-full bg-muted/40" />
          <div className="h-4 w-11/12 animate-pulse rounded-full bg-muted/40" />
          <div className="h-4 w-10/12 animate-pulse rounded-full bg-muted/40" />
        </div>
      </section>
    </div>
  );
}
