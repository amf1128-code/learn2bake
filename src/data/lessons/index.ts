import { Lesson } from "@/types/lesson";

import lessonGluten from "./lesson-gluten.json";
import lessonHydration from "./lesson-hydration.json";
import lessonFermentation from "./lesson-fermentation.json";
import lessonEnrichment from "./lesson-enrichment.json";
import lessonShaping from "./lesson-shaping.json";
import lessonScoring from "./lesson-scoring.json";

export const lessons: Lesson[] = [
  lessonGluten,
  lessonHydration,
  lessonFermentation,
  lessonEnrichment,
  lessonShaping,
  lessonScoring,
] as Lesson[];
