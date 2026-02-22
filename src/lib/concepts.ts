import { concepts } from "@/data/concepts";
import { Concept } from "@/types/concept";

export function getAllConcepts(): Concept[] {
  return [...concepts].sort((a, b) => a.order - b.order);
}

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}
