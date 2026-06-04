import type { SplashOptions as NativeSplashOptions } from './NativeSplashView';
import { useHideSplash } from './useHideSplash';
import type { UseHideSplashOptions } from './useHideSplash';
export interface SplashOptions extends NativeSplashOptions {
    backgroundColor?: string;
    resizeMode?: 'cover' | 'contain';
    repeat?: boolean;
}
export declare function showSplash(options?: SplashOptions): void;
export declare function showTimedSplash(options?: SplashOptions): void;
export declare function hideSplash(): void;
export { useHideSplash };
export type { UseHideSplashOptions };
declare const _default: {
    showSplash: typeof showSplash;
    hideSplash: typeof hideSplash;
    useHideSplash: typeof useHideSplash;
    showTimedSplash: typeof showTimedSplash;
};
export default _default;
//# sourceMappingURL=index.d.ts.map