"use strict";

import { useEffect, useState } from 'react';
import { hideSplash } from "./index.js";
/**
 * Hook to manage hiding the initial native splash screen automatically.
 * It ensures the splash is visible for a minimum duration and considers
 * the app "ready" shortly after the component using the hook mounts.
 *
 * @param options Configuration options for the hook.
 */
export function useHideSplash(options) {
  const {
    minimumDuration = 0,
    readinessDelay = 1
  } = options || {};
  const [isMinDurationPassed, setIsMinDurationPassed] = useState(minimumDuration <= 0);
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
//# sourceMappingURL=useHideSplash.js.map