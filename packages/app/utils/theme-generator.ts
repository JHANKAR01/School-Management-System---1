/**
 * Sovereign Theme Generator
 * Generates a full Tailwind palette (50-950) from a single primary hex color.
 * Implementation allows dynamic white-labeling without external heavy libraries.
 */

// Helper: Hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper: RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Mix color with white (tint) or black (shade)
function mix(color: { r: number, g: number, b: number }, mixColor: { r: number, g: number, b: number }, weight: number) {
  const w = weight / 100;
  const w2 = 1 - w;
  return {
    r: Math.round(color.r * w2 + mixColor.r * w),
    g: Math.round(color.g * w2 + mixColor.g * w),
    b: Math.round(color.b * w2 + mixColor.b * w)
  };
}

export function generatePalette(baseHex: string): Record<number, string> {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return {};

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  // This is a simplified generation strategy for the Sovereign MVP
  return {
    50: rgbToHex(mix(rgb, white, 90).r, mix(rgb, white, 90).g, mix(rgb, white, 90).b),
    100: rgbToHex(mix(rgb, white, 80).r, mix(rgb, white, 80).g, mix(rgb, white, 80).b),
    200: rgbToHex(mix(rgb, white, 60).r, mix(rgb, white, 60).g, mix(rgb, white, 60).b),
    300: rgbToHex(mix(rgb, white, 40).r, mix(rgb, white, 40).g, mix(rgb, white, 40).b),
    400: rgbToHex(mix(rgb, white, 20).r, mix(rgb, white, 20).g, mix(rgb, white, 20).b),
    500: baseHex,
    600: rgbToHex(mix(rgb, black, 10).r, mix(rgb, black, 10).g, mix(rgb, black, 10).b),
    700: rgbToHex(mix(rgb, black, 20).r, mix(rgb, black, 20).g, mix(rgb, black, 20).b),
    800: rgbToHex(mix(rgb, black, 40).r, mix(rgb, black, 40).g, mix(rgb, black, 40).b),
    900: rgbToHex(mix(rgb, black, 60).r, mix(rgb, black, 60).g, mix(rgb, black, 60).b),
    950: rgbToHex(mix(rgb, black, 80).r, mix(rgb, black, 80).g, mix(rgb, black, 80).b),
  };
}
