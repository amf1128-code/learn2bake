import { readJsonDir, readJsonFile } from "@/lib/data";
import { Lesson } from "@/types/lesson";

export function getAllLessons(): Lesson[] {
  return readJsonDir<Lesson>("lessons").sort((a, b) => a.order - b.order);
}

export function getLesson(slug: string): Lesson | undefined {
  return readJsonFile<Lesson>("lessons", slug);
}

export function getLessonByConcept(conceptSlug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.conceptSlug === conceptSlug);
}
