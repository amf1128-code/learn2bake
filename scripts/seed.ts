/**
 * Seed Supabase with data from the local JSON files.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * in .env or .env.local.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set them in .env.local or export them before running this script.",
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const dataDir = path.join(process.cwd(), "src/data");

async function seedTable(table: string, subdir: string) {
  const dir = path.join(dataDir, subdir);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  const rows = files.map((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return { slug: data.slug, data };
  });

  console.log(`Seeding ${table} with ${rows.length} rows...`);
  const { error } = await supabase.from(table).upsert(rows);
  if (error) {
    console.error(`  Error seeding ${table}:`, error.message);
  } else {
    console.log(`  Done.`);
  }
}

async function main() {
  await seedTable("recipes", "recipes");
  await seedTable("lessons", "lessons");
  await seedTable("concepts", "concepts");
  console.log("\nSeed complete!");
}

main();
