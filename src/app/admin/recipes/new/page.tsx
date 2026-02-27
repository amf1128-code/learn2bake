"use client";

import { useState, useEffect } from "react";
import RecipeEditor from "../[slug]/RecipeEditor";
import { Concept } from "@/types/concept";
import { Recipe } from "@/types/recipe";

const emptyRecipe: Recipe = {
  slug: "",
  title: "",
  description: "",
  difficulty: "beginner",
  totalTime: "",
  activeTime: "",
  servings: "",
  conceptsTaught: [],
  ingredients: [],
  steps: [],
};

export default function NewRecipePage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    fetch("/api/concepts")
      .then((r) => r.json())
      .then(setConcepts)
      .catch(() => {});
  }, []);

  return <RecipeEditor recipe={emptyRecipe} concepts={concepts} isNew={true} />;
}
