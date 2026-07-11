import type { ReactNode } from "react";
import { themeToCssVars } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { TemplateTheme } from "@/types";

interface ThemeScopeProps {
  theme: TemplateTheme;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps rendered website output and injects the active template's design tokens
 * as scoped CSS variables. Everything inside inherits the theme; nothing
 * outside is affected, so the dashboard chrome keeps its own styling.
 */
export function ThemeScope({ theme, children, className }: ThemeScopeProps) {
  return (
    <div
      style={themeToCssVars(theme)}
      className={cn(
        "bg-[color:var(--site-background)] text-[color:var(--site-foreground)] [font-family:var(--site-font-body)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
