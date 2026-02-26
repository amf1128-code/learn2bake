import { NextResponse } from "next/server";
import { readJsonDir } from "@/lib/data";
import { Concept } from "@/types/concept";

export async function GET() {
  const concepts = await readJsonDir<Concept>("concepts");
  concepts.sort((a, b) => a.order - b.order);
  return NextResponse.json(concepts);
}
