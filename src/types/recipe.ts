export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  bakersPercentage?: number;
}

export interface RecipeStep {
  id: string;
  instruction: string;
  duration?: number; // seconds
  timerLabel?: string;
  timerType?: "countdown" | "interval";
  intervalCount?: number;
  tips?: string[];
  conceptsReinforced?: string[];
}

export interface Recipe {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  totalTime: string;
  activeTime: string;
  servings: string;
  conceptsTaught: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
}
