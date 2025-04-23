import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import SplashView

@main
class AppDelegate: RCTAppDelegate {
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        self.moduleName = "SplashViewExample"
        self.dependencyProvider = RCTAppDependencyProvider()
        self.initialProps = [:]
        
        showSplashScreen()
        
        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)
        
        return result
    }
    
    private func showSplashScreen() {
        let splash = SplashView.shared 

        let options: [String: Any] = [
            "lottie": "logoanimation",
            "backgroundColor": "#2a37e6",
            "duration": 10000,
            "resizeMode": "cover",
            "repeat": true,
        ]

        splash.showSplash(options: options)
        print("✅ Initial Splash Screen Shown via AppDelegate (Swift)")
    }
    
    override func bundleURL() -> URL? {
        #if DEBUG
            return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
    
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        #if DEBUG
            return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
