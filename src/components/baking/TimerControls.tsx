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
      <div className="flex justify-center">
        <span className="text-sm text-green-600 font-medium">
          Timer complete!
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3">
      {!timer.isRunning ? (
        <button
          onClick={() => dispatch({ type: "START_TIMER" })}
          className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-orange-800 transition-colors"
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
          className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-white transition-colors"
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
