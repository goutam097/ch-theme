import type { CSSProperties } from "react";
import type { TemplateTheme } from "@/types";

/**
 * THEME SYSTEM
 * ------------
 * A template's `theme` preset is projected onto scoped CSS custom properties
 * (prefixed `--site-`). Section variants never hardcode colors — they read
 * these variables through Tailwind arbitrary values, e.g.
 * `bg-[var(--site-primary)]` or `text-[color:var(--site-foreground)]`.
 *
 * Because the variables live on a wrapping element (see <ThemeScope/>), the
 * exact same component renders in the editor, the preview, and the published
 * site with whatever theme the active template declares — no recompilation.
 */
export function themeToCssVars(theme: TemplateTheme): CSSProperties {
  return {
    "--site-primary": theme.primary,
    "--site-secondary": theme.secondary,
    "--site-accent": theme.accent,
    "--site-background": theme.background,
    "--site-foreground": theme.foreground,
    "--site-muted": theme.muted,
    "--site-radius": theme.radius,
    "--site-font-heading": theme.fontHeading,
    "--site-font-body": theme.fontBody,
  } as CSSProperties;
}
