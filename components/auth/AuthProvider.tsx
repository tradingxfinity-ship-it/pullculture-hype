"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import AuthModal, { type AuthMode } from "./AuthModal";

type AuthContext = { open: (mode: AuthMode) => void; close: () => void };

const Ctx = createContext<AuthContext | null>(null);

// Owns the log in / sign up modal so any button on the site can open it.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const open = useCallback((m: AuthMode) => setMode(m), []);
  const close = useCallback(() => setMode(null), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AuthModal mode={mode} onMode={setMode} onClose={close} />
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
