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
export declare function useHideSplash(options?: UseHideSplashOptions): void;
//# sourceMappingURL=useHideSplash.d.ts.map