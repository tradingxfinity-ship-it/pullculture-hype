import Logo from "@/components/ui/Logo";

// Back of a graded slab: acrylic case, a plain black label with the HYP3
// mark, and a dark card back behind the window. Sized in container units
// of the card slot. Spans, since it sits inside the flip button.
export default function SlabBack() {
  return (
    <>
      <span className="sb-label">
        <Logo link={false} className="sb-logo" />
      </span>
      <span className="sb-window">
        <Logo link={false} className="sb-mark" />
        <span className="sb-cta">Tap to reveal</span>
      </span>
      <span className="rip-back-sheen" />
    </>
  );
}
