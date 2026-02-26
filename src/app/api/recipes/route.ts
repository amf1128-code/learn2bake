import { NextResponse } from "next/server";
import { readJsonDir, writeJsonFile } from "@/lib/data";
import { Recipe } from "@/types/recipe";

export async function GET() {
  const recipes = await readJsonDir<Recipe>("recipes");
  return NextResponse.json(recipes);
}

export async function POST(request: Request) {
  const recipe: Recipe = await request.json();

  if (!recipe.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const existing = await readJsonDir<Recipe>("recipes");
  if (existing.some((r) => r.slug === recipe.slug)) {
    return NextResponse.json(
      { error: "Recipe with this slug already exists" },
      { status: 409 }
    );
  }

  await writeJsonFile("recipes", recipe.slug, recipe);
  return NextResponse.json(recipe, { status: 201 });
}
