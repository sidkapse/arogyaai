/** Per-ailment colour palette. Use hex for inline styles, name for Tailwind classes. */
export type AilmentPalette = {
  name: string;        // Tailwind colour name
  hex500: string;      // primary
  hex200: string;      // light border
  hex50: string;       // lightest bg
  hex700: string;      // dark text
  gradient: string;    // CSS gradient for headers
};

const palette: Record<string, AilmentPalette> = {
  red:    { name: 'red',    hex500: '#ef4444', hex200: '#fecaca', hex50: '#fef2f2', hex700: '#b91c1c', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
  orange: { name: 'orange', hex500: '#f97316', hex200: '#fed7aa', hex50: '#fff7ed', hex700: '#c2410c', gradient: 'linear-gradient(135deg,#f97316,#ea580c)' },
  amber:  { name: 'amber',  hex500: '#f59e0b', hex200: '#fde68a', hex50: '#fffbeb', hex700: '#b45309', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  yellow: { name: 'yellow', hex500: '#eab308', hex200: '#fef08a', hex50: '#fefce8', hex700: '#a16207', gradient: 'linear-gradient(135deg,#eab308,#ca8a04)' },
  lime:   { name: 'lime',   hex500: '#84cc16', hex200: '#d9f99d', hex50: '#f7fee7', hex700: '#4d7c0f', gradient: 'linear-gradient(135deg,#84cc16,#65a30d)' },
  emerald:{ name: 'emerald',hex500: '#10b981', hex200: '#a7f3d0', hex50: '#ecfdf5', hex700: '#047857', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
  teal:   { name: 'teal',   hex500: '#14b8a6', hex200: '#99f6e4', hex50: '#f0fdfa', hex700: '#0f766e', gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)' },
  cyan:   { name: 'cyan',   hex500: '#06b6d4', hex200: '#a5f3fc', hex50: '#ecfeff', hex700: '#0e7490', gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
  blue:   { name: 'blue',   hex500: '#3b82f6', hex200: '#bfdbfe', hex50: '#eff6ff', hex700: '#1d4ed8', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  indigo: { name: 'indigo', hex500: '#6366f1', hex200: '#c7d2fe', hex50: '#eef2ff', hex700: '#4338ca', gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  violet: { name: 'violet', hex500: '#8b5cf6', hex200: '#ddd6fe', hex50: '#f5f3ff', hex700: '#6d28d9', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  purple: { name: 'purple', hex500: '#a855f7', hex200: '#e9d5ff', hex50: '#faf5ff', hex700: '#7e22ce', gradient: 'linear-gradient(135deg,#a855f7,#9333ea)' },
  pink:   { name: 'pink',   hex500: '#ec4899', hex200: '#fbcfe8', hex50: '#fdf2f8', hex700: '#be185d', gradient: 'linear-gradient(135deg,#ec4899,#db2777)' },
  rose:   { name: 'rose',   hex500: '#f43f5e', hex200: '#fecdd3', hex50: '#fff1f2', hex700: '#be123c', gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)' },
};

export function getPalette(color: string): AilmentPalette {
  return palette[color] ?? palette['emerald'];
}
