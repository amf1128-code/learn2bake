export interface RecipeOption {
  recipeSlug: string;
  whyThisRecipe: string;
  recommended: boolean;
}

export interface Lesson {
  slug: string;
  title: string;
  conceptSlug: string;
  order: number;
  introduction: string;
  objectives: string[];
  recipeOptions: RecipeOption[];
  wrapUp: string;
}
