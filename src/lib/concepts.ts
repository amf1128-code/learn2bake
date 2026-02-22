import { readJsonDir, readJsonFile } from "@/lib/data";
import { Concept } from "@/types/concept";

export function getAllConcepts(): Concept[] {
  return readJsonDir<Concept>("concepts").sort((a, b) => a.order - b.order);
}

export function getConcept(slug: string): Concept | undefined {
  return readJsonFile<Concept>("concepts", slug);
}
