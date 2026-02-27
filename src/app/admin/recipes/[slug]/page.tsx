import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/recipes";
import { getAllConcepts } from "@/lib/concepts";
import RecipeEditor from "./RecipeEditor";

// Returns [] so no pages are pre-generated in static export.
// The page only runs during local dev (npm run dev).
export function generateStaticParams() {
  return [];
}

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  const concepts = await getAllConcepts();

  return <RecipeEditor recipe={recipe} concepts={concepts} isNew={false} />;
}
