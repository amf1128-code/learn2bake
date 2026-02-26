import { supabase } from "./supabase";

export async function readJsonDir<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("data");
  if (error || !data) return [];
  return data.map((row) => row.data as T);
}

export async function readJsonFile<T>(
  table: string,
  slug: string,
): Promise<T | undefined> {
  const { data, error } = await supabase
    .from(table)
    .select("data")
    .eq("slug", slug)
    .single();
  if (error || !data) return undefined;
  return data.data as T;
}

export async function writeJsonFile(
  table: string,
  slug: string,
  payload: unknown,
): Promise<void> {
  await supabase.from(table).upsert({ slug, data: payload });
}

export async function deleteJsonFile(
  table: string,
  slug: string,
): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq("slug", slug);
  return !error;
}
