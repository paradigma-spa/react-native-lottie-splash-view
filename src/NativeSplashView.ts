import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface SplashOptions {
  lottie?: string;
  duration?: number;
  backgroundColor?: string;
}

export interface Spec extends TurboModule {
  showSplash(options?: SplashOptions): void;
  hideSplash(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SplashView');
