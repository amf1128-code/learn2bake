"use client";

import { useState } from "react";
import { Ingredient } from "@/types/recipe";
import { convertToImperial } from "@/lib/unit-conversion";

export function IngredientList({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const [useImperial, setUseImperial] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleToggle() {
    if (!useImperial) {
      setShowHint(true);
    }
    setUseImperial(!useImperial);
  }

  return (
    <div className="bg-surface border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl">Ingredients</h2>
        <div className="flex items-center bg-background border border-border rounded-lg text-xs">
          <button
            onClick={() => { setUseImperial(false); setShowHint(false); }}
            className={`px-3 py-1.5 rounded-l-lg transition-colors ${
              !useImperial ? "bg-accent text-white" : "text-muted hover:text-foreground"
            }`}
          >
            Metric
          </button>
          <button
            onClick={handleToggle}
            className={`px-3 py-1.5 rounded-r-lg transition-colors ${
              useImperial ? "bg-accent text-white" : "text-muted hover:text-foreground"
            }`}
          >
            US Volume
          </button>
        </div>
      </div>

      {showHint && useImperial && (
        <p className="text-xs text-muted bg-accent-light/50 border border-accent-light rounded-lg px-3 py-2 mb-4 leading-relaxed">
          Volume measurements are approximate. Baking is all about
          consistency, and weighing ingredients (even with a cheap
          kitchen scale) will give you more reliable results
          every time.
        </p>
      )}

      <ul className="space-y-2">
        {ingredients.map((ing, i) => {
          const imperial = useImperial ? convertToImperial(ing) : null;
          return (
            <li key={i} className="flex justify-between text-sm">
              <span>{ing.name}</span>
              <span className="text-muted font-mono">
                {useImperial ? (
                  imperial!.display
                ) : (
                  <>
                    {ing.amount}
                    {ing.unit}
                    {ing.bakersPercentage !== undefined && (
                      <span className="text-xs ml-1">({ing.bakersPercentage}%)</span>
                    )}
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
