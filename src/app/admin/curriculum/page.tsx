import { getAllLessons } from "@/lib/lessons";
import { getAllRecipes } from "@/lib/recipes";
import { getAllConcepts } from "@/lib/concepts";
import CurriculumEditor from "./CurriculumEditor";

export const dynamic = "force-dynamic";

export default function CurriculumPage() {
  const lessons = getAllLessons();
  const recipes = getAllRecipes();
  const concepts = getAllConcepts();

  return (
    <CurriculumEditor
      initialLessons={lessons}
      recipes={recipes}
      concepts={concepts}
    />
  );
}
