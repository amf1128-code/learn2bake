import { getAllRecipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export default async function RecipesPage() {
  const recipes = await getAllRecipes();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl mb-2">Recipe Library</h1>
      <p className="text-muted mb-10">
        All recipes, organized from beginner to advanced. Each one teaches
        specific baking concepts.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
