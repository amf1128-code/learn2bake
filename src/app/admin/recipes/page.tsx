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
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800"
        >
          + New Recipe
        </Link>
      </div>

      {recipes === null ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/admin/recipes/${recipe.slug}`}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold">{recipe.title}</h2>
                  <DifficultyBadge difficulty={recipe.difficulty} />
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {recipe.description}
                </p>
              </div>
              <div className="text-right text-sm text-gray-400 shrink-0 ml-4">
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
