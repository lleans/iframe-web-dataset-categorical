import type React from "react";

export function TypographyCodeBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <pre
      className={`bg-muted rounded p-3 font-mono text-sm font-semibold max-h-60 max-w-full overflow-auto wrap-break-word whitespace-pre-wrap ${className}`}
    >
      {children}
    </pre>
  );
}
