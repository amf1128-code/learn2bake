import { recipes } from "@/data/recipes";
import { Recipe, Difficulty } from "@/types/recipe";

export function getAllRecipes(): Recipe[] {
  return recipes.sort((a, b) => {
    const order: Record<Difficulty, number> = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
    };
    return order[a.difficulty] - order[b.difficulty];
  });
}

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getRecipesByDifficulty(difficulty: Difficulty): Recipe[] {
  return recipes.filter((r) => r.difficulty === difficulty);
}

export function getRecipesByConcept(conceptSlug: string): Recipe[] {
  return recipes.filter((r) => r.conceptsTaught.includes(conceptSlug));
}
