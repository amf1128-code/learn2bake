import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";
import { getAllRecipes } from "@/lib/recipes";
import { getSiteSettings } from "@/lib/settings";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export default async function HomePage() {
  const [lessons, recipes, settings] = await Promise.all([
    getAllLessons(),
    getAllRecipes(),
    getSiteSettings(),
  ]);

  return (
    <div>
      {/* Hero — full-width with optional background image */}
      <section
        className="relative w-full"
        style={
          settings.heroImage
            ? {
                backgroundImage: `url(${settings.heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {settings.heroImage && (
          <div className="absolute inset-0 bg-white/65" />
        )}
        <div className="relative max-w-5xl mx-auto px-4 py-24">
          <h1 className="font-serif text-6xl leading-tight mb-6 max-w-2xl whitespace-pre-line">
            {settings.heroTitle || "Learn to bake\nfrom scratch."}
          </h1>
          <p className="text-lg text-muted max-w-xl mb-8 leading-relaxed">
            {settings.heroSubtitle || "A guided curriculum that teaches you the principles of dough and baking, one concept at a time. Start with simple doughs and build up to sourdough boules."}
          </p>
          <div className="flex gap-5 items-center">
            <Link
              href="/learn"
              className="px-6 py-3 bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              Start Learning
            </Link>
            <Link
              href="/recipes"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Browse Recipes &rarr;
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* How it works */}
        <section className="mb-24">
          <h2 className="font-serif text-3xl mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="font-serif text-5xl italic text-muted mb-4">1</div>
              <h3 className="font-medium mb-2">Learn a concept</h3>
              <p className="text-sm text-muted leading-relaxed">
                Each lesson focuses on one building block of baking — gluten,
                hydration, fermentation, and more.
              </p>
            </div>
            <div>
              <div className="font-serif text-5xl italic text-muted mb-4">2</div>
              <h3 className="font-medium mb-2">Pick a recipe</h3>
              <p className="text-sm text-muted leading-relaxed">
                Choose from multiple recipes that teach the same concept. Learn
                your way.
              </p>
            </div>
            <div>
              <div className="font-serif text-5xl italic text-muted mb-4">3</div>
              <h3 className="font-medium mb-2">Bake with guidance</h3>
              <p className="text-sm text-muted leading-relaxed">
                Built-in timers and step-by-step instructions guide you through
                every fold, rest, and bake.
              </p>
            </div>
          </div>
        </section>

        {/* Curriculum preview */}
        <section className="mb-24">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-3xl">The Curriculum</h2>
            <span className="text-sm text-muted">
              {lessons.length} lessons
            </span>
          </div>
          <div className="space-y-px border-t border-border">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.slug}
                href={`/learn/${lesson.slug}`}
                className="flex items-center gap-6 py-4 border-b border-border hover:bg-surface transition-colors px-2 -mx-2"
              >
                <span className="font-serif italic text-muted text-lg w-6 shrink-0 text-right">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <span className="font-medium">{lesson.title}</span>
                </div>
                <span className="text-sm text-muted shrink-0">
                  {lesson.recipeOptions.length} recipe
                  {lesson.recipeOptions.length !== 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recipe preview */}
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-3xl">Recipe Library</h2>
            <Link
              href="/recipes"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              All recipes &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
