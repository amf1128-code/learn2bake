import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { DifficultyBadge } from "./DifficultyBadge";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="block bg-surface border border-border hover:border-foreground transition-colors group"
    >
      {/* Image area */}
      <div className="aspect-[3/2] bg-[#e8e3db] overflow-hidden">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <DifficultyBadge difficulty={recipe.difficulty} />
          <span className="text-xs text-muted">{recipe.totalTime}</span>
        </div>
        <h3 className="font-medium mb-1">{recipe.title}</h3>
        <p className="text-sm text-muted line-clamp-2">{recipe.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {recipe.conceptsTaught.map((concept) => (
            <span
              key={concept}
              className="text-xs px-2 py-0.5 border border-border text-muted"
            >
              {concept.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
