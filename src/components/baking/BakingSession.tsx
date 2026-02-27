"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipe";
import { useBakingSession } from "@/hooks/useBakingSession";
import { useTimer } from "@/hooks/useTimer";
import { useWakeLock } from "@/hooks/useWakeLock";
import { BakingProgress } from "./BakingProgress";
import { StepCard } from "./StepCard";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { StepNavigation } from "./StepNavigation";
import { DoughAssistant } from "./DoughAssistant";

interface BakingSessionProps {
  recipe: Recipe;
  returnUrl?: string;
}

export function BakingSession({ recipe, returnUrl }: BakingSessionProps) {
  const router = useRouter();
  const { state, dispatch } = useBakingSession(recipe.slug, recipe.steps);
  const currentStep = recipe.steps[state.currentStepIndex];

  const timerIsRunning = state.timer?.isRunning ?? false;

  // Keep screen awake while timer is running
  useWakeLock(timerIsRunning);

  // Tick the timer every second
  useTimer(timerIsRunning, () => {
    dispatch({ type: "TICK" });
  });

  // Play a beep when timer completes
  const playAlert = useCallback(() => {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      // Try to vibrate on mobile
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {
      // Audio not available
    }
  }, []);

  // Watch for timer completion to play alert
  const timerComplete =
    state.timer !== null && state.timer.remainingSeconds === 0;
  const intervalAdvanced =
    state.timer !== null &&
    !state.timer.isRunning &&
    state.timer.remainingSeconds === state.timer.totalSeconds &&
    state.timer.intervalCurrent > 1;

  // Simple completion detection using refs would be better,
  // but for MVP this works: play alert when we detect completion state
  if (timerComplete || intervalAdvanced) {
    // Schedule alert outside render
    setTimeout(playAlert, 0);
  }

  const handleComplete = () => {
    router.push(returnUrl ?? `/recipes/${recipe.slug}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">{recipe.title}</h1>
        <BakingProgress
          currentStep={state.currentStepIndex}
          totalSteps={state.totalSteps}
        />
      </div>

      <StepCard
        step={currentStep}
        stepNumber={state.currentStepIndex + 1}
        totalSteps={state.totalSteps}
      />

      {state.timer && (
        <div className="mt-4">
          <TimerDisplay
            timer={state.timer}
            label={currentStep.timerLabel}
          />
          <TimerControls timer={state.timer} dispatch={dispatch} />
        </div>
      )}

      <StepNavigation
        currentStep={state.currentStepIndex}
        totalSteps={state.totalSteps}
        dispatch={dispatch}
        onComplete={handleComplete}
      />

      <DoughAssistant
        recipeName={recipe.title}
        currentStepNumber={state.currentStepIndex + 1}
        stepInstruction={currentStep.instruction}
      />
    </div>
  );
}
