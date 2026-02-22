"use client";

import { useEffect, useRef } from "react";

export function useTimer(
  isRunning: boolean,
  onTick: () => void,
  onComplete?: () => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  onTickRef.current = onTick;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTickRef.current();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);
}
