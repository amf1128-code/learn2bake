import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile, deleteJsonFile } from "@/lib/data";
import { Recipe } from "@/types/recipe";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const recipe = await readJsonFile<Recipe>("recipes", slug);
  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(recipe);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const recipe: Recipe = await request.json();
  await writeJsonFile("recipes", slug, recipe);
  return NextResponse.json(recipe);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = await deleteJsonFile("recipes", slug);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
