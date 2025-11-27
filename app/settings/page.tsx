"use client";

import { useState } from "react";
import { Moon, Sun, UserCircle } from "lucide-react";
import { useToastStore } from "../../stores/use-toast-store";

export default function SettingsPage() {
  const { push } = useToastStore();
  const [name, setName] = useState("Operator");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const save = () => {
    push({ title: "Profile saved", description: "Name and theme updated.", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Profile & settings</p>
        <h1 className="text-3xl font-bold text-gray-900">Own your GauntletFuse cockpit</h1>
        <p className="text-gray-700">Manage profile details, theme preference, and auth scaffolding placeholders.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Signed in via Supabase (stub)</p>
              <p className="font-semibold text-gray-900">{name}</p>
            </div>
          </div>
          <label className="space-y-1">
            <span className="label">Display name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="space-y-2">
            <p className="label">Theme</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  theme === "light" ? "border-primary bg-primary/10" : "border-gray-200"
                }`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  theme === "dark" ? "border-primary bg-primary/10" : "border-gray-200"
                }`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>
          </div>
          <button className="btn-primary w-full" onClick={save}>
            Save settings
          </button>
        </div>
        <div className="card p-6 space-y-3 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Authentication scaffold</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Email/password sign-in with Supabase Auth</li>
            <li>OAuth providers: Google, GitHub, Discord (wiring points ready)</li>
            <li>Email verification pending / profile sync to `profiles` table</li>
            <li>Protected routes via middleware once keys exist</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
