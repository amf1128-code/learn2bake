"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress } from "@/types/progress";

const STORAGE_KEY = "learn2bake-progress";

const defaultProgress: UserProgress = {
  completedLessons: [],
  conceptsEncountered: [],
  recipesCompleted: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // localStorage not available
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = useCallback((updated: UserProgress) => {
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available
    }
  }, []);

  const completeRecipe = useCallback(
    (recipeSlug: string, conceptsSlugs: string[]) => {
      const updated: UserProgress = {
        ...progress,
        recipesCompleted: progress.recipesCompleted.includes(recipeSlug)
          ? progress.recipesCompleted
          : [...progress.recipesCompleted, recipeSlug],
        conceptsEncountered: [
          ...new Set([...progress.conceptsEncountered, ...conceptsSlugs]),
        ],
      };
      saveProgress(updated);
    },
    [progress, saveProgress]
  );

  const completeLesson = useCallback(
    (lessonSlug: string, recipeUsed: string) => {
      const updated: UserProgress = {
        ...progress,
        completedLessons: [
          ...progress.completedLessons,
          {
            lessonSlug,
            recipeUsed,
            completedAt: new Date().toISOString(),
          },
        ],
      };
      saveProgress(updated);
    },
    [progress, saveProgress]
  );

  return {
    progress,
    isLoaded,
    completeRecipe,
    completeLesson,
  };
}
