'use client'

import { MutableRefObject, useEffect, useRef, useState } from "react";

interface TurnstileWindow extends Window {
  turnstile?: {
    render: (
      container: HTMLElement,
      options: {
        sitekey: string;
        action: string;
        callback: (token: string) => void;
      }
    ) => void;
  };
}

let turnstileLoader: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (!turnstileLoader) {
    turnstileLoader = new Promise((resolve, reject) => {
      if (document.getElementById("cf-turnstile-script")) {
        return resolve();
      }
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Turnstile script failed to load"));
      document.body.appendChild(script);
    });
  }
  return turnstileLoader;
}

export function useCloudflareTurnstile(
  action: string,
  onVerify: (token: string) => void
): { ref: MutableRefObject<HTMLDivElement | null> } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [didRender, setDidRender] = useState(false);

  useEffect(() => {
    let mounted = true;
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured");
      return;
    }

    loadTurnstileScript()
      .then(() => {
        if (!mounted || didRender) return;

        const turnstileWindow = window as TurnstileWindow;
        if (!turnstileWindow.turnstile) {
          console.error("window.turnstile not found after script load");
          return;
        }
        if (!ref.current) {
          console.error("Turnstile container not mounted");
          return;
        }

        turnstileWindow.turnstile.render(ref.current, {
          sitekey: siteKey,
          action,
          callback: (token: string) => {
            onVerify(token);
          },
        });

        setDidRender(true);
      })
      .catch((err) => {
        console.error("Failed to load Turnstile script:", err);
      });

    return () => {
      mounted = false;
    };
  }, [action, onVerify, didRender]);

  return { ref };
}
