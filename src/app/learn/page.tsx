import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";

export default async function LearnPage() {
  const lessons = await getAllLessons();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl mb-2">The Curriculum</h1>
      <p className="text-muted mb-10">
        {lessons.length} lessons that build on each other. Each one teaches a
        core concept of baking through hands-on recipes.
      </p>

      <div className="border-t border-border">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/learn/${lesson.slug}`}
            className="flex items-center gap-6 py-5 border-b border-border hover:bg-surface transition-colors px-2 -mx-2"
          >
            <span className="font-serif italic text-muted text-lg w-6 shrink-0 text-right">
              {index + 1}
            </span>
            <div className="flex-1">
              <h2 className="font-medium mb-1">{lesson.title}</h2>
              <p className="text-sm text-muted line-clamp-1">
                {lesson.introduction.slice(0, 120)}...
              </p>
            </div>
            <span className="text-sm text-muted shrink-0">
              {lesson.recipeOptions.length} recipe
              {lesson.recipeOptions.length !== 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
