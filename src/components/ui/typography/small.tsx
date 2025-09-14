import type React from "react";

export function TypographySmall({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm leading-none font-light text-muted-foreground">
      {children}
    </small>
  );
}
