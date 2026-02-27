"use client";

import { useReducer, useCallback } from "react";
import { BakingSessionState, BakingAction, TimerState } from "@/types/baking-session";
import { RecipeStep } from "@/types/recipe";

function buildTimerForStep(step: RecipeStep): TimerState | null {
  if (!step.duration) return null;
  return {
    isRunning: false,
    remainingSeconds: step.duration,
    totalSeconds: step.duration,
    intervalCurrent: 1,
    intervalTotal: step.timerType === "interval" ? (step.intervalCount ?? 1) : 1,
  };
}

function createReducer(steps: RecipeStep[]) {
  return function bakingSessionReducer(
    state: BakingSessionState,
    action: BakingAction
  ): BakingSessionState {
    switch (action.type) {
      case "NEXT_STEP": {
        const nextIndex = state.currentStepIndex + 1;
        if (nextIndex >= state.totalSteps) return state;
        return {
          ...state,
          currentStepIndex: nextIndex,
          completedSteps: [...state.completedSteps, steps[state.currentStepIndex].id],
          timer: buildTimerForStep(steps[nextIndex]),
        };
      }

      case "PREV_STEP": {
        const prevIndex = state.currentStepIndex - 1;
        if (prevIndex < 0) return state;
        return {
          ...state,
          currentStepIndex: prevIndex,
          completedSteps: state.completedSteps.filter(
            (id) => id !== steps[prevIndex].id
          ),
          timer: buildTimerForStep(steps[prevIndex]),
        };
      }

      case "START_TIMER": {
        if (!state.timer) return state;
        return { ...state, timer: { ...state.timer, isRunning: true } };
      }

      case "PAUSE_TIMER": {
        if (!state.timer) return state;
        return { ...state, timer: { ...state.timer, isRunning: false } };
      }

      case "RESUME_TIMER": {
        if (!state.timer) return state;
        return { ...state, timer: { ...state.timer, isRunning: true } };
      }

      case "TICK": {
        if (!state.timer || !state.timer.isRunning) return state;
        const remaining = state.timer.remainingSeconds - 1;
        if (remaining <= 0) {
          if (state.timer.intervalCurrent < state.timer.intervalTotal) {
            // Interval timer: move to next interval, pause for user to start next
            return {
              ...state,
              timer: {
                ...state.timer,
                remainingSeconds: state.timer.totalSeconds,
                intervalCurrent: state.timer.intervalCurrent + 1,
                isRunning: false,
              },
            };
          }
          // Fully complete
          return {
            ...state,
            timer: { ...state.timer, remainingSeconds: 0, isRunning: false },
          };
        }
        return {
          ...state,
          timer: { ...state.timer, remainingSeconds: remaining },
        };
      }

      case "SKIP_TIMER": {
        if (!state.timer) return state;
        return {
          ...state,
          timer: { ...state.timer, remainingSeconds: 0, isRunning: false },
        };
      }

      case "COMPLETE_INTERVAL": {
        if (!state.timer) return state;
        if (state.timer.intervalCurrent < state.timer.intervalTotal) {
          return {
            ...state,
            timer: {
              ...state.timer,
              remainingSeconds: state.timer.totalSeconds,
              intervalCurrent: state.timer.intervalCurrent + 1,
              isRunning: false,
            },
          };
        }
        return state;
      }

      case "RESET_TIMER": {
        if (!state.timer) return state;
        const currentStep = steps[state.currentStepIndex];
        return {
          ...state,
          timer: buildTimerForStep(currentStep),
        };
      }

      case "GO_TO_INTERVAL": {
        if (!state.timer || state.timer.intervalTotal <= 1) return state;
        const round = Math.max(1, Math.min(action.round, state.timer.intervalTotal));
        return {
          ...state,
          timer: {
            ...state.timer,
            remainingSeconds: state.timer.totalSeconds,
            intervalCurrent: round,
            isRunning: false,
          },
        };
      }

      case "RESET": {
        return {
          ...state,
          currentStepIndex: 0,
          completedSteps: [],
          timer: buildTimerForStep(steps[0]),
          startedAt: Date.now(),
          isPaused: false,
        };
      }

      default:
        return state;
    }
  };
}

export function useBakingSession(recipeSlug: string, steps: RecipeStep[]) {
  const reducer = useCallback(createReducer(steps), [steps]);

  const initialState: BakingSessionState = {
    recipeSlug,
    currentStepIndex: 0,
    totalSteps: steps.length,
    timer: buildTimerForStep(steps[0]),
    completedSteps: [],
    startedAt: Date.now(),
    isPaused: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
}
