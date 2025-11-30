"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, User, LogOut } from "lucide-react";
import { supabaseBrowserClient } from "../lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/providers", label: "Providers" },
  { href: "/personas", label: "Personas" },
  { href: "/participants", label: "Participants" },
  { href: "/arenas/build", label: "Arena Builder" }
];

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseBrowserClient.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="container-layout flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-primary">
          <ShieldCheck className="h-6 w-6" /> GauntletFuse
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href as any} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary text-sm">
                <Sparkles className="mr-2 h-4 w-4" /> Start a run
              </Link>
              <button onClick={handleLogout} className="btn-primary text-sm">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">
                <User className="mr-2 h-4 w-4" /> Login
              </Link>
              <Link href="/signup" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
