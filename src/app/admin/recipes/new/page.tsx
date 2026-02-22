import { getAllConcepts } from "@/lib/concepts";
import RecipeEditor from "../[slug]/RecipeEditor";
import { Recipe } from "@/types/recipe";

export const dynamic = "force-dynamic";

const emptyRecipe: Recipe = {
  slug: "",
  title: "",
  description: "",
  difficulty: "beginner",
  totalTime: "",
  activeTime: "",
  servings: "",
  conceptsTaught: [],
  ingredients: [],
  steps: [],
};

export default function NewRecipePage() {
  const concepts = getAllConcepts();

  return <RecipeEditor recipe={emptyRecipe} concepts={concepts} isNew={true} />;
}
