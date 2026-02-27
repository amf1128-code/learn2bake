"use client";

import { useState } from "react";
import { Ingredient } from "@/types/recipe";
import { convertToImperial } from "@/lib/unit-conversion";

interface IngredientPanelProps {
  ingredients: Ingredient[];
  servings: string;
}

export function IngredientPanel({ ingredients, servings }: IngredientPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [useImperial, setUseImperial] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleToggle() {
    if (!useImperial) {
      setShowHint(true);
    }
    setUseImperial(!useImperial);
  }

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
          {/* Unit toggle */}
          <div className="flex items-center justify-end mb-3">
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

          {/* Gentle hint about weight vs volume */}
          {showHint && useImperial && (
            <p className="text-xs text-muted bg-accent-light/50 border border-accent-light rounded-lg px-3 py-2 mb-3 leading-relaxed">
              Volume measurements are approximate. Baking is all about
              consistency, and weighing ingredients (even with a cheap
              kitchen scale) will give you more reliable results
              every time.
            </p>
          )}

          <ul className="space-y-1.5">
            {ingredients.map((ing, i) => {
              const imperial = useImperial ? convertToImperial(ing) : null;
              return (
                <li key={i} className="flex items-baseline justify-between text-sm">
                  <span>{ing.name}</span>
                  <span className="text-muted ml-2 tabular-nums">
                    {useImperial ? imperial!.display : `${ing.amount} ${ing.unit}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
