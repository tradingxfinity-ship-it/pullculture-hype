"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

// Email capture. No endpoint existed on the previous site either, so this
// only validates and confirms locally — wire `onSubmit` to your ESP.
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setDone(true);
      }}
      className="group/nl relative flex h-14 max-w-md items-center border-b border-line-strong transition-colors duration-base focus-within:border-accent"
    >
      <label htmlFor="nl-email" className="sr-only">
        Email
      </label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        disabled={done}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="h-full flex-1 bg-transparent text-lg text-fg outline-none placeholder:text-fg-dim"
      />
      <button
        type="submit"
        disabled={done}
        className="inline-flex h-10 items-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-ink transition-[box-shadow,transform] duration-base ease-out hover:shadow-[0_8px_30px_-8px_rgba(117,251,181,0.6)] active:scale-[0.98]"
      >
        {done ? (
          <>
            <Check className="h-4 w-4" /> You’re in
          </>
        ) : (
          <>
            Sign Up <ArrowRight className="h-4 w-4 transition-transform duration-base group-hover/nl:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
