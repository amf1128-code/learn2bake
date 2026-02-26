import { readJsonDir, readJsonFile } from "@/lib/data";
import { Concept } from "@/types/concept";

export async function getAllConcepts(): Promise<Concept[]> {
  const concepts = await readJsonDir<Concept>("concepts");
  return concepts.sort((a, b) => a.order - b.order);
}

export async function getConcept(slug: string): Promise<Concept | undefined> {
  return readJsonFile<Concept>("concepts", slug);
}
