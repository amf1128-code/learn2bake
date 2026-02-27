"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Recipe, RecipeStep, Ingredient, Difficulty, ReferenceVideo } from "@/types/recipe";
import { Concept } from "@/types/concept";
import {
  btnPrimary, btnDanger, btnLink, btnLinkXs, btnRemove, btnMove, btnImageRemove,
  inputBase, inputDisabled, inputSm,
  labelBase, labelSm, labelInline,
  card, cardFlush, cardInner,
  statusSuccess, statusError,
  badgeBlue, badgeGreen, badgePurple,
  pillLg, pillSm, pillOn, pillOff,
  timerToggleBase, timerToggleOn,
  bakersBase, colHeader,
} from "@/app/admin/styles";


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
  function recalcBakersPercentages(ingredients: Ingredient[]): Ingredient[] {
    const baseIdx = ingredients.findIndex((ing) => ing.bakersPercentage === 100);
    if (baseIdx === -1 || ingredients[baseIdx].amount <= 0) return ingredients;
    const baseAmount = ingredients[baseIdx].amount;
    const baseUnit = ingredients[baseIdx].unit;
    return ingredients.map((ing, i) => {
      if (i === baseIdx) return ing;
      if (ing.unit === baseUnit && ing.amount > 0) {
        return {
          ...ing,
          bakersPercentage: Math.round((ing.amount / baseAmount) * 1000) / 10,
        };
      }
      return { ...ing, bakersPercentage: undefined };
    });
  }

  function addIngredient() {
    update({
      ingredients: [
        ...recipe.ingredients,
        { name: "", amount: 0, unit: "g" },
      ],
    });
  }

  function updateIngredient(i: number, patch: Partial<Ingredient>) {
    let ingredients = [...recipe.ingredients];
    ingredients[i] = { ...ingredients[i], ...patch };
    // Auto-set flour as base when name is updated to contain "flour" and no base exists yet
    if ("name" in patch) {
      const name = (patch.name ?? "").toLowerCase();
      const hasBase = ingredients.some((ing) => ing.bakersPercentage === 100);
      if (name.includes("flour") && !hasBase) {
        ingredients[i] = { ...ingredients[i], bakersPercentage: 100 };
        ingredients = recalcBakersPercentages(ingredients);
      }
    }
    if ("amount" in patch || "unit" in patch) {
      ingredients = recalcBakersPercentages(ingredients);
    }
    update({ ingredients });
  }

  function removeIngredient(i: number) {
    const wasBase = recipe.ingredients[i].bakersPercentage === 100;
    let ingredients = recipe.ingredients.filter((_, idx) => idx !== i);
    if (wasBase) {
      ingredients = ingredients.map((ing) => ({ ...ing, bakersPercentage: undefined }));
    }
    update({ ingredients });
  }

  function setBaseIngredient(i: number) {
    const isCurrentBase = recipe.ingredients[i].bakersPercentage === 100;
    let ingredients = recipe.ingredients.map((ing, idx) => ({
      ...ing,
      bakersPercentage: idx === i && !isCurrentBase ? 100 : undefined,
    }));
    if (!isCurrentBase) {
      ingredients = recalcBakersPercentages(ingredients);
    }
    update({ ingredients });
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

  // --- Reference videos ---
  function addReferenceVideo(stepIndex: number) {
    const step = recipe.steps[stepIndex];
    updateStep(stepIndex, {
      referenceVideos: [...(step.referenceVideos || []), { label: "", url: "" }],
    });
  }

  function updateReferenceVideo(
    stepIndex: number,
    videoIndex: number,
    patch: Partial<ReferenceVideo>,
  ) {
    const step = recipe.steps[stepIndex];
    const videos = [...(step.referenceVideos || [])];
    videos[videoIndex] = { ...videos[videoIndex], ...patch };
    updateStep(stepIndex, { referenceVideos: videos });
  }

  function removeReferenceVideo(stepIndex: number, videoIndex: number) {
    const step = recipe.steps[stepIndex];
    updateStep(stepIndex, {
      referenceVideos: (step.referenceVideos || []).filter(
        (_, idx) => idx !== videoIndex,
      ),
    });
  }

  // --- Image upload ---
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  async function uploadHeroImage(file: File) {
    setUploadingHero(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "recipes");
    const res = await fetch(`/api/upload`, { method: "POST", body: formData });
    setUploadingHero(false);
    if (!res.ok) return;
    const { path } = await res.json();
    update({ image: path });
  }

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
        <h1 className="font-serif text-2xl">
          {isNew ? "New Recipe" : `Edit: ${initial.title}`}
        </h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className={statusSuccess}>Saved</span>
          )}
          {error && (
            <span className={statusError}>{error}</span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className={btnPrimary}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {!isNew && (
            <button
              onClick={deleteRecipe}
              className={btnDanger}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <section className={card}>
        <h2 className="font-semibold mb-4">Recipe Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelBase}>Title</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => update({ title: e.target.value })}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Slug</label>
            <input
              type="text"
              value={recipe.slug}
              onChange={(e) => update({ slug: e.target.value })}
              disabled={!isNew}
              className={inputDisabled}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelBase}>Description</label>
            <textarea
              value={recipe.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={2}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Difficulty</label>
            <select
              value={recipe.difficulty}
              onChange={(e) =>
                update({ difficulty: e.target.value as Difficulty })
              }
              className={inputBase}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelBase}>Servings</label>
            <input
              type="text"
              value={recipe.servings}
              onChange={(e) => update({ servings: e.target.value })}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Total Time</label>
            <input
              type="text"
              value={recipe.totalTime}
              onChange={(e) => update({ totalTime: e.target.value })}
              className={inputBase}
              placeholder="e.g. 3.5 hours"
            />
          </div>
          <div>
            <label className={labelBase}>Active Time</label>
            <input
              type="text"
              value={recipe.activeTime}
              onChange={(e) => update({ activeTime: e.target.value })}
              className={inputBase}
              placeholder="e.g. 25 minutes"
            />
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-4">
          <label className={`${labelBase} mb-2`}>Hero Image</label>
          {recipe.image && (
            <div className="mb-2 relative inline-block">
              <img
                src={recipe.image}
                alt="Recipe hero"
                className="w-64 h-36 object-cover rounded border border-border"
              />
              <button
                onClick={() => update({ image: undefined })}
                className={btnImageRemove}
              >
                &times;
              </button>
            </div>
          )}
          <div>
            <input
              ref={heroFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadHeroImage(file);
              }}
              className="text-sm"
            />
            {uploadingHero && (
              <span className="ml-2 text-sm text-muted">Uploading...</span>
            )}
          </div>
          <p className="text-xs text-muted mt-1">
            Shown at the top of the recipe page and on recipe cards.
          </p>
        </div>

        {/* Concepts taught */}
        <div className="mt-4">
          <label className={`${labelBase} mb-2`}>Concepts Taught</label>
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
                  className={`${pillLg} ${active ? pillOn : pillOff}`}
                >
                  {c.icon} {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className={card}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Ingredients</h2>
          <button
            onClick={addIngredient}
            className={btnLink}
          >
            + Add Ingredient
          </button>
        </div>
        <div className="space-y-2">
          {recipe.ingredients.length > 0 && (
            <div className="flex items-center gap-2 px-1 pb-1 border-b border-border">
              <span className={`flex-1 ${colHeader}`}>Name</span>
              <span className={`w-20 ${colHeader}`}>Amount</span>
              <span className={`w-16 ${colHeader}`}>Unit</span>
              <span className={`w-20 ${colHeader}`}>Baker&apos;s %</span>
              <span className="w-5" />
            </div>
          )}
          {recipe.ingredients.map((ing, i) => {
            const hasBase = recipe.ingredients.some((x) => x.bakersPercentage === 100);
            const isBase = ing.bakersPercentage === 100;
            return (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) =>
                    updateIngredient(i, { name: e.target.value })
                  }
                  placeholder="Name"
                  className={`flex-1 ${inputSm}`}
                />
                <input
                  type="number"
                  value={ing.amount}
                  onChange={(e) =>
                    updateIngredient(i, { amount: Number(e.target.value) })
                  }
                  className={`w-20 ${inputSm}`}
                />
                <input
                  type="text"
                  value={ing.unit}
                  onChange={(e) =>
                    updateIngredient(i, { unit: e.target.value })
                  }
                  placeholder="unit"
                  className={`w-16 ${inputSm}`}
                />
                <div className="w-20">
                  {isBase ? (
                    <button
                      onClick={() => setBaseIngredient(i)}
                      className={bakersBase}
                      title="Base ingredient (100%) — click to unset"
                    >
                      ★ 100%
                    </button>
                  ) : ing.bakersPercentage !== undefined ? (
                    <span className="block text-sm text-foreground px-2 py-1.5 text-right">
                      {ing.bakersPercentage}%
                    </span>
                  ) : !hasBase ? (
                    <button
                      onClick={() => setBaseIngredient(i)}
                      className="w-full text-xs text-muted hover:text-accent py-1 text-center"
                      title="Set as base ingredient (100%) for baker's percentages"
                    >
                      set base
                    </button>
                  ) : (
                    <span className="block text-sm text-muted px-2 py-1.5 text-center">
                      —
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeIngredient(i)}
                  className={`${btnRemove} px-1`}
                >
                  &times;
                </button>
              </div>
            );
          })}
          {recipe.ingredients.some((ing) => ing.bakersPercentage === 100) && (
            <p className="text-xs text-muted mt-2">
              Percentages auto-update relative to the ★ base ingredient.
            </p>
          )}
          {recipe.ingredients.length > 0 && !recipe.ingredients.some((ing) => ing.bakersPercentage === 100) && (
            <p className="text-xs text-muted mt-2">
              Click &quot;set base&quot; on the flour to enable auto-calculated baker&apos;s percentages.
            </p>
          )}
        </div>
      </section>

      {/* Steps */}
      <section className={card}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Steps</h2>
          <button
            onClick={addStep}
            className={btnLink}
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
                className={cardFlush}
              >
                {/* Step header */}
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-background cursor-pointer"
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
                      className={btnMove}
                    >
                      &uarr;
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(i, 1);
                      }}
                      disabled={i === recipe.steps.length - 1}
                      className={btnMove}
                    >
                      &darr;
                    </button>
                  </div>
                  <span className="text-sm font-mono text-muted w-6">
                    {i + 1}
                  </span>
                  <span className="text-sm flex-1 truncate">
                    {step.instruction.slice(0, 80) || "(empty step)"}
                    {step.instruction.length > 80 ? "..." : ""}
                  </span>
                  {step.duration && (
                    <span className={badgeBlue}>
                      {step.timerType === "interval" ? "Interval" : "Timer"}{" "}
                      {Math.round(step.duration / 60)}m
                    </span>
                  )}
                  {step.image && (
                    <span className={badgeGreen}>Photo</span>
                  )}
                  {step.referenceVideos && step.referenceVideos.length > 0 && (
                    <span className={badgePurple}>
                      {step.referenceVideos.length} video{step.referenceVideos.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(i);
                    }}
                    className={btnRemove}
                  >
                    &times;
                  </button>
                </div>

                {/* Step detail (expanded) */}
                {isExpanded && (
                  <div className="px-4 py-4 space-y-4">
                    {/* Instruction */}
                    <div>
                      <label className={labelBase}>Instruction</label>
                      <textarea
                        value={step.instruction}
                        onChange={(e) =>
                          updateStep(i, { instruction: e.target.value })
                        }
                        rows={3}
                        className={inputBase}
                      />
                    </div>

                    {/* Timer */}
                    <div className={cardInner}>
                      <div className="flex items-center gap-3 mb-3">
                        <label className={labelInline}>Timer</label>
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
                          className={`${timerToggleBase} ${
                            step.duration ? timerToggleOn : pillOff
                          }`}
                        >
                          {step.duration ? "Enabled" : "Off — click to add"}
                        </button>
                      </div>
                      {step.duration !== undefined && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className={labelSm}>Label</label>
                            <input
                              type="text"
                              value={step.timerLabel || ""}
                              onChange={(e) =>
                                updateStep(i, {
                                  timerLabel: e.target.value,
                                })
                              }
                              className={`w-full ${inputSm}`}
                            />
                          </div>
                          <div>
                            <label className={labelSm}>Duration (minutes)</label>
                            <input
                              type="number"
                              value={Math.round(step.duration / 60)}
                              onChange={(e) =>
                                updateStep(i, {
                                  duration: Number(e.target.value) * 60,
                                })
                              }
                              min={1}
                              className={`w-full ${inputSm}`}
                            />
                          </div>
                          <div>
                            <label className={labelSm}>Type</label>
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
                              className={`w-full ${inputSm}`}
                            >
                              <option value="countdown">Countdown</option>
                              <option value="interval">
                                Interval (repeat)
                              </option>
                            </select>
                          </div>
                          {step.timerType === "interval" && (
                            <div>
                              <label className={labelSm}>Rounds</label>
                              <input
                                type="number"
                                value={step.intervalCount || 4}
                                onChange={(e) =>
                                  updateStep(i, {
                                    intervalCount: Number(e.target.value),
                                  })
                                }
                                min={2}
                                className={`w-full ${inputSm}`}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Tips */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelInline}>Tips</label>
                        <button
                          onClick={() => addTip(i)}
                          className={btnLinkXs}
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
                              className={`flex-1 ${inputSm}`}
                            />
                            <button
                              onClick={() => removeTip(i, ti)}
                              className={`${btnRemove} mt-1`}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Concepts reinforced */}
                    <div>
                      <label className={`${labelBase} mb-2`}>
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
                              className={`${pillSm} ${active ? pillOn : pillOff}`}
                            >
                              {c.icon} {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Image */}
                    <div>
                      <label className={`${labelBase} mb-2`}>Step Photo</label>
                      {step.image && (
                        <div className="mb-2 relative inline-block">
                          <img
                            src={step.image}
                            alt="Step"
                            className="w-40 h-28 object-cover rounded border border-border"
                          />
                          <button
                            onClick={() => updateStep(i, { image: undefined })}
                            className={btnImageRemove}
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

                    {/* Reference Videos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelInline}>Reference Videos</label>
                        <button
                          onClick={() => addReferenceVideo(i)}
                          className={btnLinkXs}
                        >
                          + Add Video
                        </button>
                      </div>
                      <p className="text-xs text-muted mb-2">
                        YouTube links showing what the dough should look/feel like at this step. The AI assistant will share these with users.
                      </p>
                      <div className="space-y-2">
                        {(step.referenceVideos || []).map((vid, vi) => (
                          <div key={vi} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={vid.label}
                              onChange={(e) =>
                                updateReferenceVideo(i, vi, {
                                  label: e.target.value,
                                })
                              }
                              placeholder="Label (e.g. Windowpane test)"
                              className={`w-1/3 ${inputSm}`}
                            />
                            <input
                              type="url"
                              value={vid.url}
                              onChange={(e) =>
                                updateReferenceVideo(i, vi, {
                                  url: e.target.value,
                                })
                              }
                              placeholder="https://youtube.com/watch?v=..."
                              className={`flex-1 ${inputSm}`}
                            />
                            <button
                              onClick={() => removeReferenceVideo(i, vi)}
                              className={`${btnRemove} mt-1`}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
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
