"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{
    recipes: number;
    lessons: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/recipes").then((r) => r.json()),
      fetch("/api/lessons").then((r) => r.json()),
    ])
      .then(([recipes, lessons]) =>
        setCounts({ recipes: recipes.length, lessons: lessons.length })
      )
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/recipes"
          className="bg-surface border border-border rounded-lg p-6 hover:border-foreground transition-colors"
        >
          <h2 className="font-semibold text-lg mb-1">Recipes</h2>
          <p className="text-3xl font-bold text-accent mb-2">
            {counts?.recipes ?? "—"}
          </p>
          <p className="text-sm text-muted">
            Create, edit, and manage recipes with steps, timers, and photos.
          </p>
        </Link>

        <Link
          href="/admin/curriculum"
          className="bg-surface border border-border rounded-lg p-6 hover:border-foreground transition-colors"
        >
          <h2 className="font-semibold text-lg mb-1">Curriculum</h2>
          <p className="text-3xl font-bold text-accent mb-2">
            {counts !== null ? `${counts.lessons} lessons` : "—"}
          </p>
          <p className="text-sm text-muted">
            Reorder lessons, edit objectives, and assign recipes to each step.
          </p>
        </Link>

        <Link
          href="/admin/site-settings"
          className="bg-surface border border-border rounded-lg p-6 hover:border-foreground transition-colors"
        >
          <h2 className="font-semibold text-lg mb-1">Site Settings</h2>
          <p className="text-sm text-muted">
            Upload a homepage hero background image and manage global site appearance.
          </p>
        </Link>
      </div>

      {counts === null && (
        <p className="text-sm text-muted mt-6">
          Loading dashboard data...
        </p>
      )}
    </div>
  );
}
