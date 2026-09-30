import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="frame relative flex min-h-[70vh] flex-col justify-center overflow-hidden py-24">
      <div className="glow absolute left-1/3 top-1/4 h-96 w-[600px]" aria-hidden />
      <p className="eyebrow mb-6 text-accent">Error 404</p>
      <h1 className="text-display-lg font-bold">
        No pull
        <br />
        <span className="text-fg-dim">this time.</span>
      </h1>
      <p className="mt-6 max-w-md text-fg-muted">That page isn’t in the vault. Try ripping something else.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/" size="lg" arrow>
          Back home
        </Button>
        <Button href="/pack" variant="secondary" size="lg">
          Browse packs
        </Button>
      </div>
    </section>
  );
}
