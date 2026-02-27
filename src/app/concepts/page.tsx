import Link from "next/link";
import { getAllConcepts } from "@/lib/concepts";
import { getRecipesByConcept } from "@/lib/recipes";
import { getLessonByConcept } from "@/lib/lessons";

export default async function ConceptsPage() {
  const concepts = await getAllConcepts();
  const conceptData = await Promise.all(
    concepts.map(async (concept) => ({
      concept,
      recipes: await getRecipesByConcept(concept.slug),
      lesson: await getLessonByConcept(concept.slug),
    }))
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl mb-2">Baking Concepts</h1>
      <p className="text-muted mb-10">
        The building blocks of baking. Each concept is a skill or principle
        that you&apos;ll use in every bread you make.
      </p>

      <div className="border-t border-border">
        {conceptData.map(({ concept, recipes, lesson }) => (
          <Link
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            className="flex items-start gap-6 py-5 border-b border-border hover:bg-surface transition-colors px-2 -mx-2"
          >
            <div className="flex-1">
              <h2 className="font-medium mb-1">{concept.name}</h2>
              <p className="text-sm text-muted mb-2 line-clamp-2">
                {concept.description}
              </p>
              <div className="flex gap-4 text-xs text-muted">
                <span>
                  {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
                </span>
                {lesson && <span>{lesson.title}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
