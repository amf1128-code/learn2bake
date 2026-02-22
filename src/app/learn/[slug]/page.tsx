import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLessons, getLesson } from "@/lib/lessons";
import { getConcept } from "@/lib/concepts";
import { getRecipe } from "@/lib/recipes";
import { DifficultyBadge } from "@/components/recipes/DifficultyBadge";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.slug }));
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const concept = getConcept(lesson.conceptSlug);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/learn"
        className="text-sm text-muted hover:text-foreground mb-4 inline-block"
      >
        &larr; All Lessons
      </Link>

      <div className="mb-8">
        {concept && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{concept.icon}</span>
            <span className="text-sm text-accent font-medium">
              {concept.name}
            </span>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

        {/* Introduction */}
        <div className="prose prose-sm max-w-none">
          {lesson.introduction.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-muted leading-relaxed mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Objectives */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-8">
        <h2 className="font-semibold mb-3">Learning Objectives</h2>
        <ul className="space-y-2">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-accent mt-0.5">&#9679;</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recipe picker */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4">
          Choose Your Recipe
        </h2>
        <div className="space-y-3">
          {lesson.recipeOptions.map((option) => {
            const recipe = getRecipe(option.recipeSlug);
            if (!recipe) return null;

            return (
              <div
                key={option.recipeSlug}
                className={`p-5 bg-surface border rounded-lg ${
                  option.recommended
                    ? "border-accent"
                    : "border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {option.recommended && (
                    <span className="text-xs px-2 py-0.5 bg-accent text-white rounded-full">
                      Recommended
                    </span>
                  )}
                  <DifficultyBadge difficulty={recipe.difficulty} />
                  <span className="text-xs text-muted">
                    {recipe.totalTime}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{recipe.title}</h3>
                <p className="text-sm text-muted mb-3">
                  {option.whyThisRecipe}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/recipes/${recipe.slug}/bake`}
                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-orange-800 transition-colors"
                  >
                    Start Baking
                  </Link>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-white transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrap-up preview */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <h2 className="font-semibold mb-2">After You Bake</h2>
        <p className="text-sm text-muted">{lesson.wrapUp}</p>
      </div>
    </div>
  );
}
