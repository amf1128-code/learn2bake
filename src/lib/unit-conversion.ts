import { Ingredient } from "@/types/recipe";

/**
 * Approximate grams-per-cup for common baking ingredients.
 * We match on substrings of the ingredient name.
 */
const DENSITY_MAP: { pattern: RegExp; gramsPerCup: number }[] = [
  { pattern: /bread flour|all[- ]purpose flour|ap flour|flour/i, gramsPerCup: 120 },
  { pattern: /whole wheat/i, gramsPerCup: 128 },
  { pattern: /rye flour/i, gramsPerCup: 102 },
  { pattern: /cocoa/i, gramsPerCup: 86 },
  { pattern: /granulated sugar|white sugar|sugar/i, gramsPerCup: 200 },
  { pattern: /brown sugar/i, gramsPerCup: 220 },
  { pattern: /powdered sugar|confectioner/i, gramsPerCup: 120 },
  { pattern: /butter/i, gramsPerCup: 227 },
  { pattern: /olive oil|vegetable oil|oil/i, gramsPerCup: 216 },
  { pattern: /honey/i, gramsPerCup: 340 },
  { pattern: /milk|cream|buttermilk/i, gramsPerCup: 240 },
  { pattern: /water/i, gramsPerCup: 237 },
  { pattern: /egg/i, gramsPerCup: 243 },
];

/**
 * Small-quantity ingredients: grams per teaspoon.
 * Used when the gram amount is small (< 30g).
 */
const SMALL_DENSITY_MAP: { pattern: RegExp; gramsPerTsp: number }[] = [
  { pattern: /instant yeast|active dry yeast|yeast/i, gramsPerTsp: 3.1 },
  { pattern: /fine salt|kosher salt|salt/i, gramsPerTsp: 6 },
  { pattern: /flaky salt|maldon/i, gramsPerTsp: 3.5 },
  { pattern: /baking powder/i, gramsPerTsp: 4.6 },
  { pattern: /baking soda/i, gramsPerTsp: 4.8 },
  { pattern: /cinnamon|spice|vanilla/i, gramsPerTsp: 2.6 },
];

interface ConvertedIngredient {
  name: string;
  display: string;
}

function formatFraction(value: number): string {
  // Round to nearest common fraction
  const fractions: [number, string][] = [
    [0.125, "⅛"],
    [0.25, "¼"],
    [0.333, "⅓"],
    [0.375, "⅜"],
    [0.5, "½"],
    [0.667, "⅔"],
    [0.75, "¾"],
  ];

  const whole = Math.floor(value);
  const frac = value - whole;

  if (frac < 0.0625) {
    return whole === 0 ? "a pinch" : `${whole}`;
  }

  // Find closest fraction
  let closestFrac = "";
  let closestDist = Infinity;
  for (const [num, str] of fractions) {
    const dist = Math.abs(frac - num);
    if (dist < closestDist) {
      closestDist = dist;
      closestFrac = str;
    }
  }

  if (whole === 0) return closestFrac;
  return `${whole} ${closestFrac}`;
}

export function convertToImperial(ingredient: Ingredient): ConvertedIngredient {
  const { name, amount, unit } = ingredient;

  // Only convert if currently in grams
  if (unit !== "g") {
    return { name, display: `${amount} ${unit}` };
  }

  // Try small quantities first (< 30g)
  if (amount < 30) {
    for (const { pattern, gramsPerTsp } of SMALL_DENSITY_MAP) {
      if (pattern.test(name)) {
        const tsp = amount / gramsPerTsp;
        if (tsp < 3) {
          return { name, display: `${formatFraction(tsp)} tsp` };
        }
        const tbsp = tsp / 3;
        return { name, display: `${formatFraction(tbsp)} tbsp` };
      }
    }
  }

  // Try cup-based conversion
  for (const { pattern, gramsPerCup } of DENSITY_MAP) {
    if (pattern.test(name)) {
      const cups = amount / gramsPerCup;

      // If less than ¼ cup, show as tablespoons
      if (cups < 0.2) {
        const tbsp = cups * 16;
        if (tbsp < 1) {
          const tsp = tbsp * 3;
          return { name, display: `${formatFraction(tsp)} tsp` };
        }
        return { name, display: `${formatFraction(tbsp)} tbsp` };
      }

      return { name, display: `${formatFraction(cups)} cup${cups >= 1.5 ? "s" : ""}` };
    }
  }

  // Fallback: can't convert, show grams with an oz approximation
  const oz = amount / 28.35;
  if (oz < 1) {
    return { name, display: `${oz.toFixed(1)} oz` };
  }
  return { name, display: `${formatFraction(oz)} oz` };
}
