import Logo from "@/components/ui/Logo";

// Back of a graded slab, matching the front art: acrylic case, a black
// HYP3 label (holo sticker, barcode, cert) and the card back seen through
// the window below it. Sized in container units of the card slot. Spans,
// since it sits inside the flip button.
export default function SlabBack({ cert }: { cert: string }) {
  return (
    <>
      <span className="sb-label">
        <Logo link={false} className="sb-logo" />
        <span className="sb-label-info">
          <span className="sb-holo" />
          <span className="sb-barcode" />
          <span className="sb-cert">Cert {cert}</span>
        </span>
      </span>
      <span className="sb-window">
        <span className="sb-corners" />
        <span className="sb-kicker">Graded · Vault</span>
        <span className="sb-medallion">
          <Logo link={false} className="sb-mark" />
        </span>
        <span className="sb-cta">Tap to reveal</span>
      </span>
      <span className="rip-back-sheen" />
    </>
  );
}
