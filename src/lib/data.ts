import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src/data");

export function readJsonDir<T>(subdir: string): T[] {
  const dir = path.join(dataDir, subdir);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"))
  );
}

export function readJsonFile<T>(
  subdir: string,
  filename: string
): T | undefined {
  const filePath = path.join(dataDir, subdir, `${filename}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function writeJsonFile(
  subdir: string,
  filename: string,
  data: unknown
): void {
  const dir = path.join(dataDir, subdir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

export function deleteJsonFile(subdir: string, filename: string): boolean {
  const filePath = path.join(dataDir, subdir, `${filename}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
