import type { Mod } from './mods';

type Theme = Mod['data']['theme'];

// CSS-переменные темы мода
export function themeVars(t: Theme) {
  const v: Record<string, string> = {
    '--accent': t.accent,
    '--accent2': t.accent2 || t.accent,
    '--bg': t.bg,
    '--surface': t.surface,
    '--surface-2': `color-mix(in srgb, ${t.surface} 80%, ${t.text} 6%)`,
    '--text': t.text,
    '--muted': t.muted,
    '--border': t.border || `color-mix(in srgb, ${t.surface} 75%, ${t.text} 14%)`,
    '--on-accent': t.onAccent,
  };
  if (t.font) v['--font'] = `'${t.font}', system-ui, sans-serif`;
  if (t.headingFont) v['--heading-font'] = `'${t.headingFont}', var(--font)`;
  return Object.entries(v).map(([k, val]) => `${k}:${val}`).join(';');
}

// Переменные для карточки на главной (без смены всей страницы)
export function cardVars(t: Theme) {
  return [
    `--t-bg:${t.bg}`,
    `--t-text:${t.text}`,
    `--t-muted:${t.muted}`,
    `--accent:${t.accent}`,
    `--accent2:${t.accent2 || t.accent}`,
    `--bg:${t.bg}`,
    `--card-accent:${t.accent}`,
    t.headingFont ? `--t-heading:'${t.headingFont}', sans-serif` : '',
  ].filter(Boolean).join(';');
}

export function themeFonts(t: Theme) {
  return [t.font, t.headingFont].filter(Boolean) as string[];
}

export function googleFontsHref(families: string[]) {
  const uniq = [...new Set(families)];
  if (!uniq.length) return undefined;
  const q = uniq.map((f) => 'family=' + f.trim().replace(/ /g, '+') + ':wght@400;500;600;700;800').join('&');
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}
