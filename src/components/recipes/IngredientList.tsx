import { Ingredient } from "@/types/recipe";

export function IngredientList({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h2 className="font-semibold text-lg mb-3">Ingredients</h2>
      <ul className="space-y-2">
        {ingredients.map((ing, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{ing.name}</span>
            <span className="text-muted font-mono">
              {ing.amount}
              {ing.unit}
              {ing.bakersPercentage !== undefined && (
                <span className="text-xs ml-1">({ing.bakersPercentage}%)</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
