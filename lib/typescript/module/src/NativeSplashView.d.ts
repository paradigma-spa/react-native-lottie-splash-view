import type { TurboModule } from 'react-native';
export interface SplashOptions {
    lottie?: string;
    duration?: number;
    backgroundColor?: string;
}
export interface Spec extends TurboModule {
    showSplash(options?: SplashOptions): void;
    hideSplash(): void;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeSplashView.d.ts.map