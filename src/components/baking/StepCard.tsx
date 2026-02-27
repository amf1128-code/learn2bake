"use client";

import { RecipeStep } from "@/types/recipe";

interface StepCardProps {
  step: RecipeStep;
  stepNumber: number;
  totalSteps: number;
}

export function StepCard({ step, stepNumber, totalSteps }: StepCardProps) {
  return (
    <div className="bg-surface border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted uppercase tracking-widest">
          Step {stepNumber} of {totalSteps}
        </span>
        {step.conceptsReinforced && step.conceptsReinforced.length > 0 && (
          <div className="flex gap-1.5 ml-auto">
            {step.conceptsReinforced.map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-0.5 border border-border text-muted"
              >
                {c.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {step.image && (
        <div className="mb-4">
          <img
            src={step.image}
            alt={`Step ${stepNumber}`}
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      <p className="text-base leading-relaxed mb-4">{step.instruction}</p>

      {step.tips && step.tips.length > 0 && (
        <div className="border-t border-border pt-3 mt-3 space-y-2">
          <p className="text-xs text-muted uppercase tracking-widest">Tips</p>
          {step.tips.map((tip, i) => (
            <p key={i} className="text-sm text-muted">
              {tip}
            </p>
          ))}
        </div>
      )}

      {step.referenceVideos && step.referenceVideos.length > 0 && (
        <div className="border-t border-border pt-3 mt-3 space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Watch &mdash; what to look for
          </p>
          <div className="flex flex-wrap gap-2">
            {step.referenceVideos.map((vid, i) => (
              <a
                key={i}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-orange-800 underline"
              >
                <span>&#9654;</span>
                {vid.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
