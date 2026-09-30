import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "h-8 w-auto", link = true }: { className?: string; link?: boolean }) {
  const img = (
    <Image src="/assets/logo/hyp3.svg" alt="HYP3 — Pull Culture" width={3000} height={819} priority className={className} />
  );
  return link ? (
    <Link href="/" aria-label="HYP3 home" className="inline-flex transition-opacity duration-base hover:opacity-80">
      {img}
    </Link>
  ) : (
    img
  );
}
