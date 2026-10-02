"use client";

import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAccount, useIsFavorite } from "./AccountProvider";

// Heart toggle for packs (keyed by name) and listings (keyed by id).
export default function FavoriteButton({
  kind,
  id,
  label,
  variant = "pill",
  className = "",
}: {
  kind: "packs" | "listings";
  id: string;
  label: string;
  variant?: "pill" | "icon";
  className?: string;
}) {
  const { hydrated } = useAccount();
  const { is, toggle } = useIsFavorite();
  const toast = useToast();
  const on = hydrated && is(kind, id);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(kind, id);
    toast(on ? `Removed ${label} from favorites.` : `Saved ${label} to favorites.`, on ? "info" : "success");
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        aria-label={on ? `Remove ${label} from favorites` : `Save ${label} to favorites`}
        className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition-all duration-base active:scale-90 ${
          on ? "border-accent bg-accent text-accent-ink" : "border-white/20 bg-black/50 text-fg hover:border-accent hover:text-accent"
        } ${className}`}
      >
        <Heart className={`h-4 w-4 transition-transform duration-base ${on ? "scale-110 fill-current" : ""}`} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex h-11 items-center gap-2 rounded-sm border px-4 text-sm font-semibold transition-colors ${
        on ? "border-accent bg-accent/10 text-accent" : "border-line-strong text-fg hover:border-accent hover:text-accent"
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-current" : ""}`} />
      {on ? "Saved" : "Save"}
    </button>
  );
}
