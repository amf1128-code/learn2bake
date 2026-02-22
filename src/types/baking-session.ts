export interface TimerState {
  isRunning: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  intervalCurrent: number;
  intervalTotal: number;
}

export interface BakingSessionState {
  recipeSlug: string;
  currentStepIndex: number;
  totalSteps: number;
  timer: TimerState | null;
  completedSteps: string[];
  startedAt: number;
  isPaused: boolean;
}

export type BakingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "START_TIMER" }
  | { type: "TICK" }
  | { type: "PAUSE_TIMER" }
  | { type: "RESUME_TIMER" }
  | { type: "COMPLETE_INTERVAL" }
  | { type: "SKIP_TIMER" }
  | { type: "RESET" };
