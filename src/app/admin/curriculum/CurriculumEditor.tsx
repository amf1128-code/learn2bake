"use client";

import { useState } from "react";
import { Lesson, RecipeOption } from "@/types/lesson";
import { Recipe } from "@/types/recipe";
import { Concept } from "@/types/concept";

const basePath = "/learn2bake";

interface Props {
  initialLessons: Lesson[];
  recipes: Recipe[];
  concepts: Concept[];
}

export default function CurriculumEditor({
  initialLessons,
  recipes,
  concepts,
}: Props) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newLesson, setNewLesson] = useState<Lesson>({
    slug: "",
    title: "",
    conceptSlug: "",
    order: lessons.length + 1,
    introduction: "",
    objective: "",
    recipeOptions: [],
    wrapUp: "",
  });

  function updateLesson(slug: string, patch: Partial<Lesson>) {
    setLessons((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, ...patch } : l))
    );
    setStatus(null);
  }

  // --- Reorder ---
  async function moveLesson(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= lessons.length) return;
    const reordered = [...lessons];
    [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
    // Update order numbers
    reordered.forEach((l, idx) => (l.order = idx + 1));
    setLessons(reordered);

    // Save reorder
    await fetch(`${basePath}/api/lessons/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs: reordered.map((l) => l.slug) }),
    });
    setStatus("Order saved");
  }

  // --- Save individual lesson ---
  async function saveLesson(lesson: Lesson) {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`${basePath}/api/lessons/${lesson.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus(`Saved "${lesson.title}"`);
      setEditingSlug(null);
    } catch {
      setStatus("Error saving");
    } finally {
      setSaving(false);
    }
  }

  // --- Create new lesson ---
  async function createLesson() {
    if (!newLesson.slug || !newLesson.title) return;
    setSaving(true);
    try {
      const res = await fetch(`${basePath}/api/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLesson),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setLessons((prev) => [...prev, newLesson]);
      setShowNewForm(false);
      setNewLesson({
        slug: "",
        title: "",
        conceptSlug: "",
        order: lessons.length + 2,
        introduction: "",
        objective: "",
        recipeOptions: [],
        wrapUp: "",
      });
      setStatus("Created!");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  // --- Delete lesson ---
  async function deleteLesson(slug: string) {
    if (!confirm("Delete this lesson?")) return;
    const res = await fetch(`${basePath}/api/lessons/${slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLessons((prev) => prev.filter((l) => l.slug !== slug));
      setStatus("Deleted");
    }
  }

  // --- Recipe options helpers ---
  function updateRecipeOptions(
    lessonSlug: string,
    options: RecipeOption[]
  ) {
    updateLesson(lessonSlug, { recipeOptions: options });
  }

  function addRecipeOption(lessonSlug: string) {
    const lesson = lessons.find((l) => l.slug === lessonSlug);
    if (!lesson) return;
    updateRecipeOptions(lessonSlug, [
      ...lesson.recipeOptions,
      { recipeSlug: "", whyThisRecipe: "", recommended: false },
    ]);
  }

  function removeRecipeOption(lessonSlug: string, i: number) {
    const lesson = lessons.find((l) => l.slug === lessonSlug);
    if (!lesson) return;
    updateRecipeOptions(
      lessonSlug,
      lesson.recipeOptions.filter((_, idx) => idx !== i)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Curriculum</h1>
        <div className="flex items-center gap-3">
          {status && (
            <span className="text-sm text-green-600">{status}</span>
          )}
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800"
          >
            + New Lesson
          </button>
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-4">
        {lessons.map((lesson, i) => {
          const isEditing = editingSlug === lesson.slug;
          const concept = concepts.find(
            (c) => c.slug === lesson.conceptSlug
          );

          return (
            <div
              key={lesson.slug}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Lesson header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveLesson(i, -1)}
                    disabled={i === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
                  >
                    &uarr;
                  </button>
                  <button
                    onClick={() => moveLesson(i, 1)}
                    disabled={i === lessons.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
                  >
                    &darr;
                  </button>
                </div>
                <span className="text-lg">{concept?.icon || "?"}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {i + 1}. {lesson.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lesson.objective}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setEditingSlug(isEditing ? null : lesson.slug)
                    }
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {isEditing ? "Collapse" : "Edit"}
                  </button>
                  <button
                    onClick={() => deleteLesson(lesson.slug)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded edit form */}
              {isEditing && (
                <div className="px-4 py-4 space-y-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(lesson.slug, {
                            title: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Concept
                      </label>
                      <select
                        value={lesson.conceptSlug}
                        onChange={(e) =>
                          updateLesson(lesson.slug, {
                            conceptSlug: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Select concept</option>
                        {concepts.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.icon} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objective
                    </label>
                    <input
                      type="text"
                      value={lesson.objective}
                      onChange={(e) =>
                        updateLesson(lesson.slug, {
                          objective: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Introduction
                    </label>
                    <textarea
                      value={lesson.introduction}
                      onChange={(e) =>
                        updateLesson(lesson.slug, {
                          introduction: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wrap-Up
                    </label>
                    <textarea
                      value={lesson.wrapUp}
                      onChange={(e) =>
                        updateLesson(lesson.slug, {
                          wrapUp: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Recipe options */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Recipe Options
                      </label>
                      <button
                        onClick={() => addRecipeOption(lesson.slug)}
                        className="text-xs text-orange-700 hover:text-orange-800"
                      >
                        + Add Recipe
                      </button>
                    </div>
                    <div className="space-y-3">
                      {lesson.recipeOptions.map((opt, oi) => (
                        <div
                          key={oi}
                          className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <select
                              value={opt.recipeSlug}
                              onChange={(e) => {
                                const opts = [...lesson.recipeOptions];
                                opts[oi] = {
                                  ...opts[oi],
                                  recipeSlug: e.target.value,
                                };
                                updateRecipeOptions(lesson.slug, opts);
                              }}
                              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            >
                              <option value="">Select recipe</option>
                              {recipes.map((r) => (
                                <option key={r.slug} value={r.slug}>
                                  {r.title}
                                </option>
                              ))}
                            </select>
                            <label className="flex items-center gap-1 text-xs text-gray-500">
                              <input
                                type="checkbox"
                                checked={opt.recommended}
                                onChange={(e) => {
                                  const opts = [...lesson.recipeOptions];
                                  opts[oi] = {
                                    ...opts[oi],
                                    recommended: e.target.checked,
                                  };
                                  updateRecipeOptions(lesson.slug, opts);
                                }}
                              />
                              Recommended
                            </label>
                            <button
                              onClick={() =>
                                removeRecipeOption(lesson.slug, oi)
                              }
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              &times;
                            </button>
                          </div>
                          <textarea
                            value={opt.whyThisRecipe}
                            onChange={(e) => {
                              const opts = [...lesson.recipeOptions];
                              opts[oi] = {
                                ...opts[oi],
                                whyThisRecipe: e.target.value,
                              };
                              updateRecipeOptions(lesson.slug, opts);
                            }}
                            rows={2}
                            placeholder="Why this recipe teaches the concept..."
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => saveLesson(lesson)}
                      disabled={saving}
                      className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Lesson"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New lesson form */}
      {showNewForm && (
        <div className="bg-white border-2 border-orange-200 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">New Lesson</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) =>
                  setNewLesson((l) => ({ ...l, title: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={newLesson.slug}
                onChange={(e) =>
                  setNewLesson((l) => ({ ...l, slug: e.target.value }))
                }
                placeholder="lesson-my-topic"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concept
              </label>
              <select
                value={newLesson.conceptSlug}
                onChange={(e) =>
                  setNewLesson((l) => ({
                    ...l,
                    conceptSlug: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select concept</option>
                {concepts.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objective
              </label>
              <input
                type="text"
                value={newLesson.objective}
                onChange={(e) =>
                  setNewLesson((l) => ({ ...l, objective: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Introduction
            </label>
            <textarea
              value={newLesson.introduction}
              onChange={(e) =>
                setNewLesson((l) => ({
                  ...l,
                  introduction: e.target.value,
                }))
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wrap-Up
            </label>
            <textarea
              value={newLesson.wrapUp}
              onChange={(e) =>
                setNewLesson((l) => ({ ...l, wrapUp: e.target.value }))
              }
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={createLesson}
              disabled={saving || !newLesson.slug || !newLesson.title}
              className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 disabled:opacity-50"
            >
              Create Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
