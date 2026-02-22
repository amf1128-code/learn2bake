import { readJsonDir, readJsonFile } from "@/lib/data";
import { Recipe, Difficulty } from "@/types/recipe";

export function getAllRecipes(): Recipe[] {
  return readJsonDir<Recipe>("recipes").sort((a, b) => {
    const order: Record<Difficulty, number> = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
    };
    return order[a.difficulty] - order[b.difficulty];
  });
}

export function getRecipe(slug: string): Recipe | undefined {
  return readJsonFile<Recipe>("recipes", slug);
}

export function getRecipesByDifficulty(difficulty: Difficulty): Recipe[] {
  return getAllRecipes().filter((r) => r.difficulty === difficulty);
}

export function getRecipesByConcept(conceptSlug: string): Recipe[] {
  return getAllRecipes().filter((r) => r.conceptsTaught.includes(conceptSlug));
}
