export interface CompletedLesson {
  lessonSlug: string;
  recipeUsed: string;
  completedAt: string;
}

export interface UserProgress {
  completedLessons: CompletedLesson[];
  conceptsEncountered: string[];
  recipesCompleted: string[];
}
