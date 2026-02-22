import { notFound } from "next/navigation";
import { getAllRecipes, getRecipe } from "@/lib/recipes";
import { BakingSession } from "@/components/baking/BakingSession";

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export default async function BakePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return <BakingSession recipe={recipe} />;
}
