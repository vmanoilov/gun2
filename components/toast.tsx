"use client";

import { useEffect, useRef } from "react";
import { useToastStore } from "../stores/use-toast-store";

export function Toasts() {
  const { toasts, dismiss } = useToastStore();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clear any existing timers before setting new ones
    timersRef.current.forEach(clearTimeout);
    timersRef.current = toasts.map((toast) =>
      setTimeout(() => dismiss(toast.id), 4000)
    );
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [toasts, dismiss]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 shadow-lg text-sm text-white ${
            toast.variant === "error"
              ? "bg-red-500"
              : toast.variant === "success"
              ? "bg-green-600"
              : "bg-gray-900"
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description ? <p className="mt-1 text-white/80">{toast.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
