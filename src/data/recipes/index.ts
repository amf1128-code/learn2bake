import { Recipe } from "@/types/recipe";

import basicFocaccia from "./basic-focaccia.json";
import sandwichLoaf from "./sandwich-loaf.json";
import brioche from "./brioche.json";
import sourdoughBoule from "./sourdough-boule.json";
import cinnamonRolls from "./cinnamon-rolls.json";

export const recipes: Recipe[] = [
  basicFocaccia,
  sandwichLoaf,
  brioche,
  sourdoughBoule,
  cinnamonRolls,
] as Recipe[];
