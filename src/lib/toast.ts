"use client";

type Listener = (message: string) => void;

let listener: Listener | null = null;

export function showToast(message: string) {
  listener?.(message);
}

export function subscribeToast(fn: Listener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}
