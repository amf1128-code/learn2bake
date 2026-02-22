import { lessons } from "@/data/lessons";
import { Lesson } from "@/types/lesson";

export function getAllLessons(): Lesson[] {
  return [...lessons].sort((a, b) => a.order - b.order);
}

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonByConcept(conceptSlug: string): Lesson | undefined {
  return lessons.find((l) => l.conceptSlug === conceptSlug);
}
