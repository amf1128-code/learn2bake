import { NextResponse } from "next/server";
import { readJsonDir } from "@/lib/data";
import { Concept } from "@/types/concept";

export async function GET() {
  const concepts = readJsonDir<Concept>("concepts").sort(
    (a, b) => a.order - b.order
  );
  return NextResponse.json(concepts);
}
