import { createBrowserClient } from "@supabase/ssr";

export const supabaseBrowserClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return undefined;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      },
      set(name: string, value: string, options: any) {
        if (typeof document === 'undefined') return;
        let cookie = `${name}=${value}`;
        if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
        if (options?.path) cookie += `; path=${options.path}`;
        if (options?.domain) cookie += `; domain=${options.domain}`;
        if (options?.secure) cookie += '; secure';
        if (options?.httpOnly) cookie += '; httponly';
        if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
        document.cookie = cookie;
      },
      remove(name: string, options: any) {
        if (typeof document === 'undefined') return;
        let cookie = `${name}=`;
        if (options?.path) cookie += `; path=${options.path}`;
        if (options?.domain) cookie += `; domain=${options.domain}`;
        cookie += '; max-age=0';
        document.cookie = cookie;
      },
    },
  }
);
