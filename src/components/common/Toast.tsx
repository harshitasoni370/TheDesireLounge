"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToast } from "@/lib/toast";

export function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return subscribeToast((msg) => {
      setMessage(msg);
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 2200);
    });
  }, []);

  return (
    <div id="toast" className={`toast${visible ? " is-visible" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
