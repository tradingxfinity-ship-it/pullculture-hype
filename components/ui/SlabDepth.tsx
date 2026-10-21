const LAYERS = 14;

// Acrylic case between a rotating card's two faces. Stacked rounded layers
// keep the slab's corners when it turns, and side strips fill the exact
// side-on angle where the thin layers vanish. Place inside a `.slab-3d`
// element whose faces use `.slab-face` / `.slab-face-back`, under an ancestor
// with `container-type: size` sized to the slab. Spans, so it can sit in a button.
export default function SlabDepth() {
  return (
    <>
      {Array.from({ length: LAYERS }, (_, i) => (
        <span
          key={i}
          className="slab-layer"
          style={{ "--z": (i / (LAYERS - 1) - 0.5) * 0.96 } as React.CSSProperties}
          aria-hidden
        />
      ))}
      <span className="slab-side slab-side-l" aria-hidden />
      <span className="slab-side slab-side-r" aria-hidden />
    </>
  );
}
