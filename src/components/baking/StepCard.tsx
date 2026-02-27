"use client";

import { RecipeStep } from "@/types/recipe";

interface StepCardProps {
  step: RecipeStep;
  stepNumber: number;
  totalSteps: number;
}

export function StepCard({ step, stepNumber, totalSteps }: StepCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono text-muted">
          Step {stepNumber} of {totalSteps}
        </span>
        {step.conceptsReinforced && step.conceptsReinforced.length > 0 && (
          <div className="flex gap-1 ml-auto">
            {step.conceptsReinforced.map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-0.5 bg-accent-light text-accent rounded-full"
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
            className="w-full max-h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <p className="text-base leading-relaxed mb-4">{step.instruction}</p>

      {step.tips && step.tips.length > 0 && (
        <div className="border-t border-border pt-3 mt-3 space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Tips
          </p>
          {step.tips.map((tip, i) => (
            <p key={i} className="text-sm text-muted">
              {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
