import { readJsonDir, readJsonFile } from "@/lib/data";
import { Lesson } from "@/types/lesson";

export async function getAllLessons(): Promise<Lesson[]> {
  const lessons = await readJsonDir<Lesson>("lessons");
  return lessons.sort((a, b) => a.order - b.order);
}

export async function getLesson(slug: string): Promise<Lesson | undefined> {
  return readJsonFile<Lesson>("lessons", slug);
}

export async function getLessonByConcept(conceptSlug: string): Promise<Lesson | undefined> {
  const lessons = await getAllLessons();
  return lessons.find((l) => l.conceptSlug === conceptSlug);
}
