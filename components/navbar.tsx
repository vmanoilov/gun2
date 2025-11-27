import Link from "next/link";
import { ShieldCheck, Sparkles, User } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/providers", label: "Providers" },
  { href: "/personas", label: "Personas" },
  { href: "/arenas/build", label: "Arena Builder" }
];

export function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="container-layout flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-primary">
          <ShieldCheck className="h-6 w-6" /> GauntletFuse
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-secondary text-sm">
            <Sparkles className="mr-2 h-4 w-4" /> Start a run
          </Link>
          <Link href="/settings" className="btn-primary text-sm">
            <User className="mr-2 h-4 w-4" /> Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
