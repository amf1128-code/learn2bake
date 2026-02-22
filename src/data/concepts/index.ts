import { Concept } from "@/types/concept";

import glutenDevelopment from "./gluten-development.json";
import hydration from "./hydration.json";
import fermentation from "./fermentation.json";
import enrichment from "./enrichment.json";
import shaping from "./shaping.json";
import scoringAndCrust from "./scoring-and-crust.json";

export const concepts: Concept[] = [
  glutenDevelopment,
  hydration,
  fermentation,
  enrichment,
  shaping,
  scoringAndCrust,
] as Concept[];
