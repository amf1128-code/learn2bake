import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllRecipes, getRecipe } from "@/lib/recipes";
import { getConcept } from "@/lib/concepts";
import { IngredientList } from "@/components/recipes/IngredientList";
import { DifficultyBadge } from "@/components/recipes/DifficultyBadge";
import { formatTime } from "@/lib/format-time";

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const timedSteps = recipe.steps.filter((s) => s.duration);
  const totalTimedSeconds = timedSteps.reduce(
    (sum, s) => sum + (s.duration ?? 0) * (s.timerType === "interval" ? (s.intervalCount ?? 1) : 1),
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/recipes"
        className="text-sm text-muted hover:text-foreground mb-4 inline-block"
      >
        &larr; All Recipes
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <DifficultyBadge difficulty={recipe.difficulty} />
          <span className="text-sm text-muted">{recipe.totalTime}</span>
          <span className="text-sm text-muted">
            Active: {recipe.activeTime}
          </span>
          <span className="text-sm text-muted">{recipe.servings}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
        <p className="text-muted">{recipe.description}</p>
      </div>

      {/* Concepts taught */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.conceptsTaught.map((conceptSlug) => {
          const concept = getConcept(conceptSlug);
          return (
            <Link
              key={conceptSlug}
              href={`/concepts/${conceptSlug}`}
              className="text-xs px-3 py-1 bg-accent-light text-accent rounded-full hover:bg-orange-200 transition-colors"
            >
              {concept?.icon} {concept?.name ?? conceptSlug}
            </Link>
          );
        })}
      </div>

      <IngredientList ingredients={recipe.ingredients} />

      {/* Steps overview */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">
            Steps ({recipe.steps.length})
          </h2>
          {totalTimedSeconds > 0 && (
            <span className="text-sm text-muted">
              {timedSteps.length} timed steps &middot;{" "}
              {formatTime(totalTimedSeconds)} total
            </span>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {recipe.steps.map((step, i) => (
            <div
              key={step.id}
              className="p-4 bg-surface border border-border rounded-lg"
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-mono text-muted mt-0.5 w-5 shrink-0 text-right">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm">{step.instruction}</p>
                  {step.duration && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-accent">
                      <span>
                        {step.timerType === "interval"
                          ? `${step.intervalCount}x ${formatTime(step.duration)}`
                          : formatTime(step.duration)}
                      </span>
                      <span className="text-muted">{step.timerLabel}</span>
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
          className="block text-center px-6 py-4 bg-accent text-white rounded-lg font-medium hover:bg-orange-800 transition-colors text-lg"
        >
          Start Baking &rarr;
        </Link>
      </div>
    </div>
  );
}
