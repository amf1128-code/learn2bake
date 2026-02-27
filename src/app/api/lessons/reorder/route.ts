import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data";
import { Lesson } from "@/types/lesson";

export async function PUT(request: Request) {
  const { slugs }: { slugs: string[] } = await request.json();

  for (let i = 0; i < slugs.length; i++) {
    const lesson = await readJsonFile<Lesson>("lessons", slugs[i]);
    if (lesson) {
      lesson.order = i + 1;
      await writeJsonFile("lessons", slugs[i], lesson);
    }
  }

  return NextResponse.json({ success: true });
}
