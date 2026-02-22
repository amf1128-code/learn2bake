import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";
import { getConcept } from "@/lib/concepts";

export default function LearnPage() {
  const lessons = getAllLessons();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">The Curriculum</h1>
      <p className="text-muted mb-8">
        {lessons.length} lessons that build on each other. Each one teaches a
        core concept of baking through hands-on recipes.
      </p>

      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const concept = getConcept(lesson.conceptSlug);

          return (
            <Link
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
              className="flex items-start gap-4 p-5 bg-surface border border-border rounded-lg hover:border-accent transition-colors"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl">{concept?.icon}</span>
                <span className="text-xs font-mono text-muted mt-1">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold mb-1">{lesson.title}</h2>
                <p className="text-sm text-muted mb-2 line-clamp-2">
                  {lesson.introduction.slice(0, 150)}...
                </p>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>
                    {lesson.recipeOptions.length} recipe
                    {lesson.recipeOptions.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {lesson.objectives.length} objective
                    {lesson.objectives.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
