import { useEffect, useState } from 'react';
import { hideSplash } from './index';

export interface UseHideSplashOptions {
  /**
   * Minimum time in milliseconds the initial splash should be visible.
   * Defaults to 0.
   */
  minimumDuration?: number;
  /**
   * Delay in milliseconds after the hook mounts before considering the app ready.
   * Defaults to 1 (almost immediately). Set higher if needed.
   */
  readinessDelay?: number;
}

/**
 * Hook to manage hiding the initial native splash screen automatically.
 * It ensures the splash is visible for a minimum duration and considers
 * the app "ready" shortly after the component using the hook mounts.
 *
 * @param options Configuration options for the hook.
 */
export function useHideSplash(options?: UseHideSplashOptions): void {
  const { minimumDuration = 0, readinessDelay = 1 } = options || {};
  const [isMinDurationPassed, setIsMinDurationPassed] = useState(
    minimumDuration <= 0
  );
  const [isAppReady, setIsAppReady] = useState(false);

  // 1. Timer for minimum splash duration
  useEffect(() => {
    if (minimumDuration > 0 && !isMinDurationPassed) {
      const timer = setTimeout(() => {
        setIsMinDurationPassed(true);
      }, minimumDuration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [minimumDuration, isMinDurationPassed]);

  // Internal App Readiness Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, readinessDelay);

    return () => clearTimeout(timer);
  }, [readinessDelay]);

  // 3. Hide splash when both conditions are met
  useEffect(() => {
    if (isAppReady && isMinDurationPassed) {
      hideSplash?.();
    }
  }, [isAppReady, isMinDurationPassed]);
}
