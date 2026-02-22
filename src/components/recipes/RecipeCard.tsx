import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { DifficultyBadge } from "./DifficultyBadge";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="block p-5 bg-surface border border-border rounded-lg hover:border-accent transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <DifficultyBadge difficulty={recipe.difficulty} />
        <span className="text-xs text-muted">{recipe.totalTime}</span>
      </div>
      <h3 className="font-semibold mb-1">{recipe.title}</h3>
      <p className="text-sm text-muted line-clamp-2">{recipe.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {recipe.conceptsTaught.map((concept) => (
          <span
            key={concept}
            className="text-xs px-2 py-0.5 bg-accent-light text-accent rounded-full"
          >
            {concept.replace(/-/g, " ")}
          </span>
        ))}
      </div>
    </Link>
  );
}
