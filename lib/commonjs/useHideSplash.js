"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHideSplash = useHideSplash;
var _react = require("react");
var _index = require("./index.js");
/**
 * Hook to manage hiding the initial native splash screen automatically.
 * It ensures the splash is visible for a minimum duration and considers
 * the app "ready" shortly after the component using the hook mounts.
 *
 * @param options Configuration options for the hook.
 */
function useHideSplash(options) {
  const {
    minimumDuration = 0,
    readinessDelay = 1
  } = options || {};
  const [isMinDurationPassed, setIsMinDurationPassed] = (0, _react.useState)(minimumDuration <= 0);
  const [isAppReady, setIsAppReady] = (0, _react.useState)(false);

  // 1. Timer for minimum splash duration
  (0, _react.useEffect)(() => {
    if (minimumDuration > 0 && !isMinDurationPassed) {
      const timer = setTimeout(() => {
        setIsMinDurationPassed(true);
      }, minimumDuration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [minimumDuration, isMinDurationPassed]);

  // Internal App Readiness Timer
  (0, _react.useEffect)(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, readinessDelay);
    return () => clearTimeout(timer);
  }, [readinessDelay]);

  // 3. Hide splash when both conditions are met
  (0, _react.useEffect)(() => {
    if (isAppReady && isMinDurationPassed) {
      (0, _index.hideSplash)?.();
    }
  }, [isAppReady, isMinDurationPassed]);
}
//# sourceMappingURL=useHideSplash.js.map