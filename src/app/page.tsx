import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";
import { getAllRecipes } from "@/lib/recipes";

export default async function HomePage() {
  const lessons = await getAllLessons();
  const recipes = await getAllRecipes();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Learn to bake
          <br />
          <span className="text-accent">from scratch.</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
          A guided curriculum that teaches you the principles of dough and
          baking, one concept at a time. Start with simple doughs and build up
          to sourdough boules.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/learn"
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-orange-800 transition-colors"
          >
            Start Learning
          </Link>
          <Link
            href="/recipes"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-white transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-3">1</div>
            <h3 className="font-semibold mb-2">Learn a concept</h3>
            <p className="text-sm text-muted">
              Each lesson focuses on one building block of baking — gluten,
              hydration, fermentation, and more.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">2</div>
            <h3 className="font-semibold mb-2">Pick a recipe</h3>
            <p className="text-sm text-muted">
              Choose from multiple recipes that teach the same concept. Learn
              your way.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">3</div>
            <h3 className="font-semibold mb-2">Bake with guidance</h3>
            <p className="text-sm text-muted">
              Built-in timers and step-by-step instructions guide you through
              every fold, rest, and bake.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum preview */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-2">The Curriculum</h2>
        <p className="text-muted text-center mb-8">
          {lessons.length} lessons that take you from complete beginner to
          confident baker.
        </p>
        <div className="space-y-3 max-w-2xl mx-auto">
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
              className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg hover:border-accent transition-colors"
            >
              <span className="text-sm font-mono text-muted w-6 text-right">
                {index + 1}
              </span>
              <div>
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-muted">
                  {lesson.recipeOptions.length} recipe
                  {lesson.recipeOptions.length !== 1 ? "s" : ""} to choose from
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recipe preview */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-2">Recipe Library</h2>
        <p className="text-muted text-center mb-8">
          {recipes.length} recipes from beginner to advanced.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="p-4 bg-surface border border-border rounded-lg hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    recipe.difficulty === "beginner"
                      ? "bg-green-100 text-green-800"
                      : recipe.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {recipe.difficulty}
                </span>
                <span className="text-xs text-muted">{recipe.totalTime}</span>
              </div>
              <h3 className="font-medium mb-1">{recipe.title}</h3>
              <p className="text-sm text-muted line-clamp-2">
                {recipe.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
