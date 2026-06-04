"use strict";

import NativeSplashView from "./NativeSplashView.js";
import { useHideSplash } from "./useHideSplash.js";
import { Platform } from 'react-native';
export function showSplash(options) {
  if (Platform.OS === 'ios') return;
  return NativeSplashView.showSplash(options || {});
}
export function showTimedSplash(options) {
  const {
    lottie,
    duration,
    backgroundColor,
    resizeMode = 'contain',
    repeat = false,
    ...restOptions
  } = options || {};
  const finalOptions = {
    ...restOptions
  };
  if (lottie) {
    finalOptions.lottie = lottie;
  }
  if (backgroundColor) {
    finalOptions.backgroundColor = backgroundColor;
  }
  finalOptions.resizeMode = resizeMode;
  finalOptions.repeat = repeat;
  const parsedDuration = typeof duration === 'number' ? duration : parseInt(String(duration), 10);
  if (!isNaN(parsedDuration) && parsedDuration > 0) {
    finalOptions.duration = parsedDuration;
  } else if (duration !== undefined) {
    console.warn(`[showTimedSplash] Invalid or zero duration provided (${duration}). Splash might not auto-hide.`);
  }
  showSplash(finalOptions);
}
export function hideSplash() {
  if (Platform.OS === 'ios') return;
  return NativeSplashView.hideSplash();
}
export { useHideSplash };
export default {
  showSplash,
  hideSplash,
  useHideSplash,
  showTimedSplash
};
//# sourceMappingURL=index.js.map