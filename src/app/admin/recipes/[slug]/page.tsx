import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/recipes";
import { getAllConcepts } from "@/lib/concepts";
import RecipeEditor from "./RecipeEditor";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const concepts = getAllConcepts();

  return <RecipeEditor recipe={recipe} concepts={concepts} isNew={false} />;
}
