import { NextResponse } from "next/server";
import { readJsonDir, writeJsonFile } from "@/lib/data";
import { Lesson } from "@/types/lesson";

export async function GET() {
  const lessons = await readJsonDir<Lesson>("lessons");
  lessons.sort((a, b) => a.order - b.order);
  return NextResponse.json(lessons);
}

export async function POST(request: Request) {
  const lesson: Lesson = await request.json();

  if (!lesson.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const existing = await readJsonDir<Lesson>("lessons");
  if (existing.some((l) => l.slug === lesson.slug)) {
    return NextResponse.json(
      { error: "Lesson with this slug already exists" },
      { status: 409 }
    );
  }

  await writeJsonFile("lessons", lesson.slug, lesson);
  return NextResponse.json(lesson, { status: 201 });
}
