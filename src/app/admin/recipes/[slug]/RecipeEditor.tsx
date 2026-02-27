"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Recipe, RecipeStep, Ingredient, Difficulty } from "@/types/recipe";
import { Concept } from "@/types/concept";


interface Props {
  recipe: Recipe;
  concepts: Concept[];
  isNew: boolean;
}

export default function RecipeEditor({ recipe: initial, concepts, isNew }: Props) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  function update(patch: Partial<Recipe>) {
    setRecipe((r) => ({ ...r, ...patch }));
    setSaved(false);
  }

  // --- Ingredients ---
  function addIngredient() {
    update({
      ingredients: [
        ...recipe.ingredients,
        { name: "", amount: 0, unit: "g" },
      ],
    });
  }

  function updateIngredient(i: number, patch: Partial<Ingredient>) {
    const ingredients = [...recipe.ingredients];
    ingredients[i] = { ...ingredients[i], ...patch };
    update({ ingredients });
  }

  function removeIngredient(i: number) {
    update({ ingredients: recipe.ingredients.filter((_, idx) => idx !== i) });
  }

  // --- Steps ---
  function addStep() {
    const id = `${recipe.slug}-${Date.now()}`;
    const newStep: RecipeStep = { id, instruction: "" };
    update({ steps: [...recipe.steps, newStep] });
    setExpandedStep(id);
  }

  function updateStep(i: number, patch: Partial<RecipeStep>) {
    const steps = [...recipe.steps];
    steps[i] = { ...steps[i], ...patch };
    update({ steps });
  }

  function removeStep(i: number) {
    update({ steps: recipe.steps.filter((_, idx) => idx !== i) });
  }

  function moveStep(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= recipe.steps.length) return;
    const steps = [...recipe.steps];
    [steps[i], steps[j]] = [steps[j], steps[i]];
    update({ steps });
  }

  // --- Tips ---
  function addTip(stepIndex: number) {
    const step = recipe.steps[stepIndex];
    updateStep(stepIndex, { tips: [...(step.tips || []), ""] });
  }

  function updateTip(stepIndex: number, tipIndex: number, value: string) {
    const step = recipe.steps[stepIndex];
    const tips = [...(step.tips || [])];
    tips[tipIndex] = value;
    updateStep(stepIndex, { tips });
  }

  function removeTip(stepIndex: number, tipIndex: number) {
    const step = recipe.steps[stepIndex];
    updateStep(stepIndex, {
      tips: (step.tips || []).filter((_, idx) => idx !== tipIndex),
    });
  }

  // --- Image upload ---
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  async function uploadImage(stepIndex: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return;
    const { path } = await res.json();
    updateStep(stepIndex, { image: path });
  }

  // --- Save ---
  async function save() {
    setSaving(true);
    setError(null);
    try {
      const url = isNew
        ? `/api/recipes`
        : `/api/recipes/${recipe.slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setSaved(true);
      if (isNew) {
        router.push(`/admin/recipes/${recipe.slug}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // --- Delete ---
  async function deleteRecipe() {
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    const res = await fetch(`/api/recipes/${recipe.slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/recipes");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? "New Recipe" : `Edit: ${initial.title}`}
        </h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600">Saved</span>
          )}
          {error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {!isNew && (
            <button
              onClick={deleteRecipe}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Recipe Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => update({ title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={recipe.slug}
              onChange={(e) => update({ slug: e.target.value })}
              disabled={!isNew}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={recipe.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={recipe.difficulty}
              onChange={(e) =>
                update({ difficulty: e.target.value as Difficulty })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servings
            </label>
            <input
              type="text"
              value={recipe.servings}
              onChange={(e) => update({ servings: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Time
            </label>
            <input
              type="text"
              value={recipe.totalTime}
              onChange={(e) => update({ totalTime: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 3.5 hours"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Active Time
            </label>
            <input
              type="text"
              value={recipe.activeTime}
              onChange={(e) => update({ activeTime: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 25 minutes"
            />
          </div>
        </div>

        {/* Concepts taught */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Concepts Taught
          </label>
          <div className="flex flex-wrap gap-2">
            {concepts.map((c) => {
              const active = recipe.conceptsTaught.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  onClick={() =>
                    update({
                      conceptsTaught: active
                        ? recipe.conceptsTaught.filter((s) => s !== c.slug)
                        : [...recipe.conceptsTaught, c.slug],
                    })
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    active
                      ? "bg-orange-100 border-orange-300 text-orange-800"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Ingredients</h2>
          <button
            onClick={addIngredient}
            className="text-sm text-orange-700 hover:text-orange-800 font-medium"
          >
            + Add Ingredient
          </button>
        </div>
        <div className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={ing.name}
                onChange={(e) =>
                  updateIngredient(i, { name: e.target.value })
                }
                placeholder="Name"
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                value={ing.amount}
                onChange={(e) =>
                  updateIngredient(i, { amount: Number(e.target.value) })
                }
                className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) =>
                  updateIngredient(i, { unit: e.target.value })
                }
                placeholder="unit"
                className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                value={ing.bakersPercentage ?? ""}
                onChange={(e) =>
                  updateIngredient(i, {
                    bakersPercentage: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="%"
                className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
              <button
                onClick={() => removeIngredient(i)}
                className="text-red-400 hover:text-red-600 text-sm px-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Steps</h2>
          <button
            onClick={addStep}
            className="text-sm text-orange-700 hover:text-orange-800 font-medium"
          >
            + Add Step
          </button>
        </div>
        <div className="space-y-3">
          {recipe.steps.map((step, i) => {
            const isExpanded = expandedStep === step.id;
            return (
              <div
                key={step.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Step header */}
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedStep(isExpanded ? null : step.id)
                  }
                >
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(i, -1);
                      }}
                      disabled={i === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >
                      &uarr;
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(i, 1);
                      }}
                      disabled={i === recipe.steps.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >
                      &darr;
                    </button>
                  </div>
                  <span className="text-sm font-mono text-gray-400 w-6">
                    {i + 1}
                  </span>
                  <span className="text-sm flex-1 truncate">
                    {step.instruction.slice(0, 80) || "(empty step)"}
                    {step.instruction.length > 80 ? "..." : ""}
                  </span>
                  {step.duration && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {step.timerType === "interval" ? "Interval" : "Timer"}{" "}
                      {Math.round(step.duration / 60)}m
                    </span>
                  )}
                  {step.image && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                      Photo
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(i);
                    }}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    &times;
                  </button>
                </div>

                {/* Step detail (expanded) */}
                {isExpanded && (
                  <div className="px-4 py-4 space-y-4">
                    {/* Instruction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instruction
                      </label>
                      <textarea
                        value={step.instruction}
                        onChange={(e) =>
                          updateStep(i, { instruction: e.target.value })
                        }
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    {/* Timer */}
                    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Timer
                        </label>
                        <button
                          onClick={() =>
                            updateStep(i, {
                              duration: step.duration ? undefined : 60,
                              timerLabel: step.duration
                                ? undefined
                                : "Timer",
                              timerType: step.duration
                                ? undefined
                                : "countdown",
                              intervalCount: undefined,
                            })
                          }
                          className={`text-xs px-3 py-1 rounded-full border ${
                            step.duration
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-gray-100 border-gray-200 text-gray-500"
                          }`}
                        >
                          {step.duration ? "Enabled" : "Off — click to add"}
                        </button>
                      </div>
                      {step.duration !== undefined && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              value={step.timerLabel || ""}
                              onChange={(e) =>
                                updateStep(i, {
                                  timerLabel: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Duration (minutes)
                            </label>
                            <input
                              type="number"
                              value={Math.round(step.duration / 60)}
                              onChange={(e) =>
                                updateStep(i, {
                                  duration: Number(e.target.value) * 60,
                                })
                              }
                              min={1}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Type
                            </label>
                            <select
                              value={step.timerType || "countdown"}
                              onChange={(e) =>
                                updateStep(i, {
                                  timerType: e.target.value as
                                    | "countdown"
                                    | "interval",
                                  intervalCount:
                                    e.target.value === "interval"
                                      ? step.intervalCount || 4
                                      : undefined,
                                })
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            >
                              <option value="countdown">Countdown</option>
                              <option value="interval">
                                Interval (repeat)
                              </option>
                            </select>
                          </div>
                          {step.timerType === "interval" && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Rounds
                              </label>
                              <input
                                type="number"
                                value={step.intervalCount || 4}
                                onChange={(e) =>
                                  updateStep(i, {
                                    intervalCount: Number(e.target.value),
                                  })
                                }
                                min={2}
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Tips */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Tips
                        </label>
                        <button
                          onClick={() => addTip(i)}
                          className="text-xs text-orange-700 hover:text-orange-800"
                        >
                          + Add Tip
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(step.tips || []).map((tip, ti) => (
                          <div key={ti} className="flex items-start gap-2">
                            <textarea
                              value={tip}
                              onChange={(e) =>
                                updateTip(i, ti, e.target.value)
                              }
                              rows={1}
                              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            />
                            <button
                              onClick={() => removeTip(i, ti)}
                              className="text-red-400 hover:text-red-600 text-sm mt-1"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Concepts reinforced */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concepts Reinforced
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {concepts.map((c) => {
                          const active = (
                            step.conceptsReinforced || []
                          ).includes(c.slug);
                          return (
                            <button
                              key={c.slug}
                              onClick={() =>
                                updateStep(i, {
                                  conceptsReinforced: active
                                    ? (
                                        step.conceptsReinforced || []
                                      ).filter((s) => s !== c.slug)
                                    : [
                                        ...(step.conceptsReinforced || []),
                                        c.slug,
                                      ],
                                })
                              }
                              className={`px-2 py-0.5 rounded-full text-xs border ${
                                active
                                  ? "bg-orange-100 border-orange-300 text-orange-800"
                                  : "bg-gray-50 border-gray-200 text-gray-400"
                              }`}
                            >
                              {c.icon} {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Photo
                      </label>
                      {step.image && (
                        <div className="mb-2 relative inline-block">
                          <img
                            src={step.image}
                            alt="Step"
                            className="w-40 h-28 object-cover rounded border"
                          />
                          <button
                            onClick={() => updateStep(i, { image: undefined })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >
                            &times;
                          </button>
                        </div>
                      )}
                      <input
                        ref={(el) => { fileInputRefs.current[i] = el; }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(i, file);
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
