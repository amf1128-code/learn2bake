"use client";

import { TimerState, BakingAction } from "@/types/baking-session";
import { formatTime } from "@/lib/format-time";

interface TimerDisplayProps {
  timer: TimerState;
  label?: string;
  dispatch?: React.Dispatch<BakingAction>;
}

export function TimerDisplay({ timer, label, dispatch }: TimerDisplayProps) {
  const progress =
    timer.totalSeconds > 0
      ? ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) *
        100
      : 0;

  const isComplete = timer.remainingSeconds === 0;
  const isIntervalTimer = timer.intervalTotal > 1;

  return (
    <div className="text-center py-4">
      {label && (
        <p className="text-sm text-muted mb-2 font-medium">{label}</p>
      )}

      {/* Circular timer display */}
      <div className="relative inline-flex items-center justify-center w-48 h-48 mb-3">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-border"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            className="text-accent"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="relative">
          <span className="text-4xl font-mono font-bold">
            {isComplete ? "Done" : formatTime(timer.remainingSeconds)}
          </span>
        </div>
      </div>

      {/* Interval indicator — clickable round dots */}
      {isIntervalTimer && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted">Round</span>
          <div className="flex gap-1.5">
            {Array.from({ length: timer.intervalTotal }).map((_, i) => {
              const roundNum = i + 1;
              const isCurrent = roundNum === timer.intervalCurrent;
              const isDone = roundNum < timer.intervalCurrent;
              const canClick = dispatch && !timer.isRunning;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (canClick) {
                      dispatch({ type: "GO_TO_INTERVAL", round: roundNum });
                    }
                  }}
                  disabled={timer.isRunning}
                  title={`Round ${roundNum}${canClick ? " — tap to jump here" : ""}`}
                  className={`w-4 h-4 rounded-full transition-all ${
                    isDone || (isComplete && roundNum <= timer.intervalTotal)
                      ? "bg-accent"
                      : isCurrent
                        ? "bg-accent ring-2 ring-accent/30"
                        : "bg-border"
                  } ${
                    canClick
                      ? "cursor-pointer hover:ring-2 hover:ring-accent/40 hover:scale-110"
                      : "cursor-default"
                  }`}
                  aria-label={`Go to round ${roundNum}`}
                />
              );
            })}
          </div>
          <span className="text-sm text-muted">
            {timer.intervalCurrent} / {timer.intervalTotal}
          </span>
        </div>
      )}
    </div>
  );
}
