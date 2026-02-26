import { readJsonDir, readJsonFile } from "@/lib/data";
import { Recipe, Difficulty } from "@/types/recipe";

export async function getAllRecipes(): Promise<Recipe[]> {
  const recipes = await readJsonDir<Recipe>("recipes");
  const order: Record<Difficulty, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
  };
  return recipes.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  return readJsonFile<Recipe>("recipes", slug);
}

export async function getRecipesByDifficulty(difficulty: Difficulty): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  return recipes.filter((r) => r.difficulty === difficulty);
}

export async function getRecipesByConcept(conceptSlug: string): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  return recipes.filter((r) => r.conceptsTaught.includes(conceptSlug));
}
