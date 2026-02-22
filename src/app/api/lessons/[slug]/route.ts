import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile, deleteJsonFile } from "@/lib/data";
import { Lesson } from "@/types/lesson";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lesson = readJsonFile<Lesson>("lessons", slug);
  if (!lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(lesson);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lesson: Lesson = await request.json();
  writeJsonFile("lessons", slug, lesson);
  return NextResponse.json(lesson);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = deleteJsonFile("lessons", slug);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
