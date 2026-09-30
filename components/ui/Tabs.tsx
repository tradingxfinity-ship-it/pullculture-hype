import Link from "next/link";

// Link-based segmented control. Scrolls horizontally on small screens.
export default function Tabs({
  items,
  active,
  className = "",
}: {
  items: { label: string; href: string; count?: number }[];
  active: string;
  className?: string;
}) {
  return (
    <nav className={`no-scrollbar -mx-gutter overflow-x-auto px-gutter ${className}`}>
      <ul className="flex w-max gap-1 border-b border-line">
        {items.map((t) => {
          const on = t.href === active;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                scroll={false}
                aria-current={on ? "page" : undefined}
                className={`relative flex h-12 items-center gap-2 px-4 text-sm font-medium transition-colors duration-fast ${
                  on ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {t.label}
                {t.count !== undefined && (
                  <span className={`font-mono text-[10px] ${on ? "text-accent" : "text-fg-dim"}`}>{String(t.count).padStart(2, "0")}</span>
                )}
                <span
                  className={`absolute inset-x-3 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-base ease-out ${
                    on ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
