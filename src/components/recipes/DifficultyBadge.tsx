import { Difficulty } from "@/types/recipe";

const styles: Record<Difficulty, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
