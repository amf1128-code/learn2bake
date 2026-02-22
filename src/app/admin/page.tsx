import Link from "next/link";
import { getAllRecipes } from "@/lib/recipes";
import { getAllLessons } from "@/lib/lessons";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const recipes = getAllRecipes();
  const lessons = getAllLessons();

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
            {recipes.length}
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
            {lessons.length} lessons
          </p>
          <p className="text-sm text-gray-500">
            Reorder lessons, edit objectives, and assign recipes to each step.
          </p>
        </Link>
      </div>
    </div>
  );
}
