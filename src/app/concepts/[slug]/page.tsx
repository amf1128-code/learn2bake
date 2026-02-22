import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllConcepts, getConcept } from "@/lib/concepts";
import { getRecipesByConcept } from "@/lib/recipes";
import { getLessonByConcept } from "@/lib/lessons";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export function generateStaticParams() {
  return getAllConcepts().map((c) => ({ slug: c.slug }));
}

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const recipes = getRecipesByConcept(concept.slug);
  const lesson = getLessonByConcept(concept.slug);
  const allConcepts = getAllConcepts();
  const prereqs = concept.prerequisites
    .map((p) => allConcepts.find((c) => c.slug === p))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/concepts"
        className="text-sm text-muted hover:text-foreground mb-4 inline-block"
      >
        &larr; All Concepts
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{concept.icon}</span>
          <h1 className="text-3xl font-bold">{concept.name}</h1>
        </div>
        <p className="text-muted leading-relaxed">{concept.description}</p>
      </div>

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Prerequisites</h2>
          <div className="flex flex-wrap gap-2">
            {prereqs.map((p) =>
              p ? (
                <Link
                  key={p.slug}
                  href={`/concepts/${p.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm hover:border-accent transition-colors"
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Related lesson */}
      {lesson && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Lesson</h2>
          <Link
            href={`/learn/${lesson.slug}`}
            className="block p-4 bg-surface border border-accent rounded-lg hover:bg-orange-50 transition-colors"
          >
            <h3 className="font-medium mb-1">{lesson.title}</h3>
            <p className="text-sm text-muted">
              {lesson.objectives.length} objectives &middot;{" "}
              {lesson.recipeOptions.length} recipes to choose from
            </p>
          </Link>
        </div>
      )}

      {/* Recipes that teach this concept */}
      <div>
        <h2 className="font-semibold mb-3">
          Recipes That Teach {concept.name}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
