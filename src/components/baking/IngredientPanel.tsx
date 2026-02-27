"use client";

import { useState } from "react";
import { Ingredient } from "@/types/recipe";

interface IngredientPanelProps {
  ingredients: Ingredient[];
  servings: string;
}

export function IngredientPanel({ ingredients, servings }: IngredientPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm hover:border-accent transition-colors"
      >
        <span className="font-medium">
          Ingredients
          <span className="text-muted font-normal ml-2">
            {ingredients.length} items &middot; {servings}
          </span>
        </span>
        <span className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}>
          &#9662;
        </span>
      </button>

      {isOpen && (
        <div className="mt-1 bg-surface border border-border rounded-lg p-4">
          <ul className="space-y-1.5">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex items-baseline justify-between text-sm">
                <span>{ing.name}</span>
                <span className="text-muted ml-2 tabular-nums">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
