const THEME_KEY = "honoraires_theme";

interface ThemeConfig {
  primaryColor: string; // hex
}

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#4a5568", // Gris ardoise
};

export function getTheme(): ThemeConfig {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_THEME;
}

export function saveTheme(config: ThemeConfig) {
  localStorage.setItem(THEME_KEY, JSON.stringify(config));
  applyTheme(config);
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function applyTheme(config?: ThemeConfig) {
  const theme = config || getTheme();
  const { h, s, l } = hexToHSL(theme.primaryColor);
  const root = document.documentElement;

  root.style.setProperty("--primary", `${h} ${s}% ${l}%`);
  root.style.setProperty("--ring", `${h} ${s}% ${l}%`);
  root.style.setProperty("--sidebar-primary", `${h} ${s}% ${l}%`);
  root.style.setProperty("--sidebar-ring", `${h} ${s}% ${l}%`);

  // Accent: lighter version
  root.style.setProperty("--accent", `${h} ${Math.max(s - 30, 10)}% 92%`);
  root.style.setProperty("--accent-foreground", `${h} ${s}% ${Math.max(l - 10, 15)}%`);
  root.style.setProperty("--sidebar-accent", `${h} ${Math.max(s - 30, 10)}% 92%`);
  root.style.setProperty("--sidebar-accent-foreground", `${h} ${s}% ${Math.max(l - 10, 15)}%`);
}
