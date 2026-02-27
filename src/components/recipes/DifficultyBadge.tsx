import { Difficulty } from "@/types/recipe";

const styles: Record<Difficulty, string> = {
  beginner: "border-border text-muted",
  intermediate: "border-muted text-foreground",
  advanced: "border-foreground text-foreground",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 border uppercase tracking-wider ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
