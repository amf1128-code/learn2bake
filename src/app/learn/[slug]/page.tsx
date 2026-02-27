import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLessons, getLesson } from "@/lib/lessons";
import { getConcept } from "@/lib/concepts";
import { getRecipe } from "@/lib/recipes";
import { DifficultyBadge } from "@/components/recipes/DifficultyBadge";

export async function generateStaticParams() {
  const lessons = await getAllLessons();
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();

  const concept = await getConcept(lesson.conceptSlug);
  const recipeOptionsWithData = await Promise.all(
    lesson.recipeOptions.map(async (option) => ({
      option,
      recipe: await getRecipe(option.recipeSlug),
    }))
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/learn"
        className="text-sm text-muted hover:text-foreground mb-6 inline-block"
      >
        &larr; All Lessons
      </Link>

      <div className="mb-8">
        {concept && (
          <p className="text-sm text-accent font-medium mb-2">{concept.name}</p>
        )}
        <h1 className="font-serif text-4xl mb-5">{lesson.title}</h1>

        <div>
          {lesson.introduction.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-muted leading-relaxed mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Objective */}
      <div className="border-l-2 border-foreground pl-5 mb-10">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">Objective</p>
        <p className="text-sm leading-relaxed">{lesson.objective}</p>
      </div>

      {/* Recipe picker */}
      <div className="mb-10">
        <h2 className="font-serif text-2xl mb-5">Choose Your Recipe</h2>
        <div className="space-y-3">
          {recipeOptionsWithData.map(({ option, recipe }) => {
            if (!recipe) return null;

            return (
              <div
                key={option.recipeSlug}
                className={`p-5 bg-surface border ${
                  option.recommended ? "border-foreground" : "border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {option.recommended && (
                    <span className="text-xs px-2 py-0.5 bg-foreground text-background uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                  <DifficultyBadge difficulty={recipe.difficulty} />
                  <span className="text-xs text-muted">{recipe.totalTime}</span>
                </div>
                <h3 className="font-medium mb-1">{recipe.title}</h3>
                <p className="text-sm text-muted mb-4">{option.whyThisRecipe}</p>
                <div className="flex gap-3">
                  <Link
                    href={`/recipes/${recipe.slug}/bake`}
                    className="px-4 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Start Baking
                  </Link>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="px-4 py-2 border border-border text-sm font-medium hover:border-foreground transition-colors"
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
      <div className="border-t border-border pt-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-2">After You Bake</p>
        <p className="text-sm text-muted leading-relaxed">{lesson.wrapUp}</p>
      </div>
    </div>
  );
}
