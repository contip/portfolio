'use client'

import React from "react";
import { useCloudflareTurnstile } from "@/hooks/use-turnstile";

export interface TurnstileWidgetProps {
  action: string;
  onVerify: (token: string) => void;
  className?: string;
}

export default function TurnstileWidget({
  action,
  onVerify,
  className = "",
}: TurnstileWidgetProps) {
  const { ref } = useCloudflareTurnstile(action, onVerify);

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: 65 }}
    />
  );
}
