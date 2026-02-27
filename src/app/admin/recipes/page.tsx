"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { DifficultyBadge } from "@/components/recipes/DifficultyBadge";

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then(setRecipes)
      .catch(() => setRecipes([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl">Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New Recipe
        </Link>
      </div>

      {recipes === null ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/admin/recipes/${recipe.slug}`}
              className="flex items-center justify-between bg-surface border border-border rounded-lg p-4 hover:border-foreground transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold">{recipe.title}</h2>
                  <DifficultyBadge difficulty={recipe.difficulty} />
                </div>
                <p className="text-sm text-muted line-clamp-1">
                  {recipe.description}
                </p>
              </div>
              <div className="text-right text-sm text-muted shrink-0 ml-4">
                <div>{recipe.steps.length} steps</div>
                <div>{recipe.ingredients.length} ingredients</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
