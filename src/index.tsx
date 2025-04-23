import NativeSplashView from './NativeSplashView';
import type { SplashOptions as NativeSplashOptions } from './NativeSplashView';
import { useHideSplash } from './useHideSplash';
import type { UseHideSplashOptions } from './useHideSplash';
import { Platform } from 'react-native';

export interface SplashOptions extends NativeSplashOptions {
  backgroundColor?: string;
  resizeMode?: 'cover' | 'contain';
  repeat?: boolean;
}

export function showSplash(options?: SplashOptions): void {
  if (Platform.OS === 'ios') return;
  return NativeSplashView.showSplash(options || {});
}

export function showTimedSplash(options?: SplashOptions): void {
  const {
    lottie,
    duration,
    backgroundColor,
    resizeMode = 'contain',
    repeat = false,
    ...restOptions
  } = options || {};
  const finalOptions: SplashOptions = { ...restOptions };

  if (lottie) {
    finalOptions.lottie = lottie;
  }
  if (backgroundColor) {
    finalOptions.backgroundColor = backgroundColor;
  }
  finalOptions.resizeMode = resizeMode;
  finalOptions.repeat = repeat;

  const parsedDuration =
    typeof duration === 'number' ? duration : parseInt(String(duration), 10);
  if (!isNaN(parsedDuration) && parsedDuration > 0) {
    finalOptions.duration = parsedDuration;
  } else if (duration !== undefined) {
    console.warn(
      `[showTimedSplash] Invalid or zero duration provided (${duration}). Splash might not auto-hide.`
    );
  }

  showSplash(finalOptions);
}

export function hideSplash(): void {
  if (Platform.OS === 'ios') return;
  return NativeSplashView.hideSplash();
}

export { useHideSplash };
export type { UseHideSplashOptions };

export default {
  showSplash,
  hideSplash,
  useHideSplash,
  showTimedSplash,
};
