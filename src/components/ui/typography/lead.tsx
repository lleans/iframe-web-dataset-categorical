import type React from "react";

export function TypographyLead({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-xl">{children}</p>;
}
