"use client";

import { TimerState, BakingAction } from "@/types/baking-session";

interface TimerControlsProps {
  timer: TimerState;
  dispatch: React.Dispatch<BakingAction>;
}

export function TimerControls({ timer, dispatch }: TimerControlsProps) {
  const isComplete = timer.remainingSeconds === 0;
  const isIntervalPause =
    !timer.isRunning &&
    timer.remainingSeconds === timer.totalSeconds &&
    timer.intervalCurrent > 1;

  if (isComplete) {
    return (
      <div className="flex justify-center gap-3">
        <span className="text-sm text-accent font-medium py-2.5">
          Timer complete!
        </span>
        <button
          onClick={() => dispatch({ type: "RESET_TIMER" })}
          className="px-4 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3">
      {!timer.isRunning ? (
        <button
          onClick={() => dispatch({ type: "START_TIMER" })}
          className="px-6 py-2.5 bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          {isIntervalPause
            ? `Start Round ${timer.intervalCurrent}`
            : timer.remainingSeconds === timer.totalSeconds
              ? "Start Timer"
              : "Resume"}
        </button>
      ) : (
        <button
          onClick={() => dispatch({ type: "PAUSE_TIMER" })}
          className="px-6 py-2.5 border border-border font-medium hover:border-foreground transition-colors"
        >
          Pause
        </button>
      )}
      <button
        onClick={() => dispatch({ type: "SKIP_TIMER" })}
        className="px-4 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
