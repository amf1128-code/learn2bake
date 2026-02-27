import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllRecipes, getRecipe } from "@/lib/recipes";
import { getConcept } from "@/lib/concepts";
import { IngredientList } from "@/components/recipes/IngredientList";
import { DifficultyBadge } from "@/components/recipes/DifficultyBadge";
import { formatTime } from "@/lib/format-time";

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((r) => ({ slug: r.slug }));
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  const concepts = await Promise.all(
    recipe.conceptsTaught.map(async (s) => ({ slug: s, concept: await getConcept(s) }))
  );

  const timedSteps = recipe.steps.filter((s) => s.duration);
  const totalTimedSeconds = timedSteps.reduce(
    (sum, s) => sum + (s.duration ?? 0) * (s.timerType === "interval" ? (s.intervalCount ?? 1) : 1),
    0
  );

  return (
    <div>
      {/* Hero image area */}
      <div className="w-full aspect-[16/7] bg-[#e8e3db] overflow-hidden">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/recipes"
          className="text-sm text-muted hover:text-foreground mb-6 inline-block"
        >
          &larr; All Recipes
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <DifficultyBadge difficulty={recipe.difficulty} />
            <span className="text-sm text-muted">{recipe.totalTime}</span>
            <span className="text-sm text-muted">Active: {recipe.activeTime}</span>
            <span className="text-sm text-muted">{recipe.servings}</span>
          </div>
          <h1 className="font-serif text-4xl mb-3">{recipe.title}</h1>
          <p className="text-muted leading-relaxed">{recipe.description}</p>
        </div>

        {/* Concepts taught */}
        <div className="flex flex-wrap gap-2 mb-8">
          {concepts.map(({ slug: conceptSlug, concept }) => (
            <Link
              key={conceptSlug}
              href={`/concepts/${conceptSlug}`}
              className="text-xs px-3 py-1 border border-border text-muted hover:border-foreground transition-colors"
            >
              {concept?.name ?? conceptSlug}
            </Link>
          ))}
        </div>

        <IngredientList ingredients={recipe.ingredients} />

        {/* Steps overview */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl">Steps</h2>
            {totalTimedSeconds > 0 && (
              <span className="text-sm text-muted">
                {timedSteps.length} timed &middot; {formatTime(totalTimedSeconds)} total
              </span>
            )}
          </div>

          <div className="space-y-px border-t border-border mb-8">
            {recipe.steps.map((step, i) => (
              <div
                key={step.id}
                className="py-4 border-b border-border"
              >
                <div className="flex items-start gap-5">
                  <span className="font-serif italic text-muted text-lg w-5 shrink-0 text-right mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{step.instruction}</p>
                    {step.duration && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-accent">
                        <span>
                          {step.timerType === "interval"
                            ? `${step.intervalCount}× ${formatTime(step.duration)}`
                            : formatTime(step.duration)}
                        </span>
                        {step.timerLabel && (
                          <span className="text-muted">{step.timerLabel}</span>
                        )}
                      </div>
                    )}
                    {step.tips && step.tips.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {step.tips.map((tip, j) => (
                          <p key={j} className="text-xs text-muted italic">
                            {tip}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/recipes/${recipe.slug}/bake`}
            className="block text-center px-6 py-4 bg-foreground text-background font-medium hover:opacity-90 transition-opacity text-base"
          >
            Start Baking &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
