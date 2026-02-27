import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllConcepts, getConcept } from "@/lib/concepts";
import { getRecipesByConcept } from "@/lib/recipes";
import { getLessonByConcept } from "@/lib/lessons";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export async function generateStaticParams() {
  const concepts = await getAllConcepts();
  return concepts.map((c) => ({ slug: c.slug }));
}

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = await getConcept(slug);
  if (!concept) notFound();

  const recipes = await getRecipesByConcept(concept.slug);
  const lesson = await getLessonByConcept(concept.slug);
  const allConcepts = await getAllConcepts();
  const prereqs = concept.prerequisites
    .map((p) => allConcepts.find((c) => c.slug === p))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/concepts"
        className="text-sm text-muted hover:text-foreground mb-6 inline-block"
      >
        &larr; All Concepts
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-3">{concept.name}</h1>
        <p className="text-muted leading-relaxed">{concept.description}</p>
      </div>

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">Prerequisites</p>
          <div className="flex flex-wrap gap-2">
            {prereqs.map((p) =>
              p ? (
                <Link
                  key={p.slug}
                  href={`/concepts/${p.slug}`}
                  className="px-3 py-1.5 bg-surface border border-border text-sm hover:border-foreground transition-colors"
                >
                  {p.name}
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Related lesson */}
      {lesson && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">Lesson</p>
          <Link
            href={`/learn/${lesson.slug}`}
            className="block p-4 bg-surface border border-border hover:border-foreground transition-colors"
          >
            <h3 className="font-medium mb-1">{lesson.title}</h3>
            <p className="text-sm text-muted">
              {lesson.recipeOptions.length} recipes to choose from
            </p>
          </Link>
        </div>
      )}

      {/* Recipes that teach this concept */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted mb-4">
          Recipes That Teach {concept.name}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
