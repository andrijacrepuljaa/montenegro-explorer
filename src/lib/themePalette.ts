export type ThemePalette = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  heroBg: string;
  heroFg: string;
  darkSurface: string;
  darkBorder: string;
};

export const defaultThemePalette: ThemePalette = {
  background: "#ffffff",
  foreground: "#141b1f",
  card: "#ffffff",
  cardForeground: "#141b1f",
  primary: "#0f82bc",
  primaryForeground: "#ffffff",
  secondary: "#f2f4f7",
  secondaryForeground: "#1f2630",
  muted: "#f2f4f7",
  mutedForeground: "#6a7280",
  accent: "#164e88",
  accentForeground: "#ffffff",
  border: "#e3e7ed",
  heroBg: "#0f131a",
  heroFg: "#ffffff",
  darkSurface: "#181d24",
  darkBorder: "#2c313b",
};

const cssVariableMap: Record<keyof ThemePalette, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  border: "--border",
  heroBg: "--hero-bg",
  heroFg: "--hero-fg",
  darkSurface: "--dark-surface",
  darkBorder: "--dark-border",
};

const normalizeHex = (value: string) => {
  const trimmed = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${trimmed.slice(1).split("").map((digit) => `${digit}${digit}`).join("")}`;
  }
  return null;
};

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
};

export const hexToHslCssValue = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
        break;
    }
  }

  const hue = (h * 60 + 360) % 360;
  const saturation = s * 100;
  const lightness = l * 100;
  return `${hue.toFixed(2)} ${saturation.toFixed(2)}% ${lightness.toFixed(2)}%`;
};

export const applyThemePalette = (palette: ThemePalette) => {
  const root = document.documentElement;

  (Object.keys(cssVariableMap) as Array<keyof ThemePalette>).forEach((key) => {
    const hslValue = hexToHslCssValue(palette[key]);
    if (hslValue) {
      root.style.setProperty(cssVariableMap[key], hslValue);
    }
  });

  const borderValue = hexToHslCssValue(palette.border);
  if (borderValue) {
    root.style.setProperty("--input", borderValue);
    root.style.setProperty("--sidebar-border", borderValue);
  }

  const accentValue = hexToHslCssValue(palette.accent);
  if (accentValue) {
    root.style.setProperty("--ring", accentValue);
    root.style.setProperty("--sidebar-ring", accentValue);
  }

  const backgroundValue = hexToHslCssValue(palette.background);
  if (backgroundValue) root.style.setProperty("--sidebar-background", backgroundValue);

  const foregroundValue = hexToHslCssValue(palette.foreground);
  if (foregroundValue) {
    root.style.setProperty("--sidebar-foreground", foregroundValue);
    root.style.setProperty("--sidebar-accent-foreground", foregroundValue);
  }

  const primaryValue = hexToHslCssValue(palette.primary);
  if (primaryValue) root.style.setProperty("--sidebar-primary", primaryValue);

  const primaryForegroundValue = hexToHslCssValue(palette.primaryForeground);
  if (primaryForegroundValue) root.style.setProperty("--sidebar-primary-foreground", primaryForegroundValue);

  const mutedValue = hexToHslCssValue(palette.muted);
  if (mutedValue) root.style.setProperty("--sidebar-accent", mutedValue);
};
