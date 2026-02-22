"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const basePath = "/learn2bake";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{
    recipes: number;
    lessons: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${basePath}/api/recipes`).then((r) => r.json()),
      fetch(`${basePath}/api/lessons`).then((r) => r.json()),
    ])
      .then(([recipes, lessons]) =>
        setCounts({ recipes: recipes.length, lessons: lessons.length })
      )
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/recipes"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors"
        >
          <h2 className="font-semibold text-lg mb-1">Recipes</h2>
          <p className="text-3xl font-bold text-orange-700 mb-2">
            {counts?.recipes ?? "—"}
          </p>
          <p className="text-sm text-gray-500">
            Create, edit, and manage recipes with steps, timers, and photos.
          </p>
        </Link>

        <Link
          href="/admin/curriculum"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors"
        >
          <h2 className="font-semibold text-lg mb-1">Curriculum</h2>
          <p className="text-3xl font-bold text-orange-700 mb-2">
            {counts !== null ? `${counts.lessons} lessons` : "—"}
          </p>
          <p className="text-sm text-gray-500">
            Reorder lessons, edit objectives, and assign recipes to each step.
          </p>
        </Link>
      </div>

      {counts === null && (
        <p className="text-sm text-gray-400 mt-6">
          Admin requires running locally with{" "}
          <code className="bg-gray-100 px-1 rounded">npm run dev</code>.
        </p>
      )}
    </div>
  );
}
