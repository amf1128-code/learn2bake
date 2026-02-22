"use client";

import { BakingAction } from "@/types/baking-session";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  dispatch: React.Dispatch<BakingAction>;
  onComplete: () => void;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  dispatch,
  onComplete,
}: StepNavigationProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => dispatch({ type: "PREV_STEP" })}
        disabled={isFirst}
        className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &larr; Previous
      </button>

      {isLast ? (
        <button
          onClick={onComplete}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Finish Bake!
        </button>
      ) : (
        <button
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-orange-800 transition-colors"
        >
          Next Step &rarr;
        </button>
      )}
    </div>
  );
}
