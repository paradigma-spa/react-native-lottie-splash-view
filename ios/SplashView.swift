import Foundation
import UIKit
import React
import Lottie

@objc(SplashView)
public class SplashView: NSObject, RCTBridgeModule {

    public static func moduleName() -> String! {
        return "SplashView" 
    }

    public static func requiresMainQueueSetup() -> Bool {
        return true
    }

    public func constantsToExport() -> [AnyHashable : Any]! {
        return [:]
    }

    @objc public static let shared = SplashView()

    private var splashWindow: UIWindow?
    private var hideTimer: Timer?
    private var lottieAnimationView: LottieAnimationView?

    public var methodQueue: DispatchQueue! {
        return DispatchQueue.main
    }

    @objc(showSplash:)
    public func showSplash(options: [String: Any]) {
        hideTimer?.invalidate()
        hideTimer = nil

        if splashWindow != nil {
            hideSplashInternal(animated: false)
        }

        let lottieName = options["lottie"] as? String
        let durationNumber = options["duration"] as? NSNumber
        let backgroundColorHex = options["backgroundColor"] as? String

        var windowScene: UIWindowScene? = nil
        if #available(iOS 13.0, *) {
            windowScene = UIApplication.shared.connectedScenes
                .filter { $0.activationState == .foregroundActive || $0.activationState == .foregroundInactive }
                .compactMap { $0 as? UIWindowScene }
                .first
        }

        if windowScene == nil && UIDevice.current.systemVersion.compare("13.0", options: .numeric) != .orderedAscending {
             print("[SplashViewModule][WARN] No active window scene found for splash.")
        }


        let screenBounds = UIScreen.main.bounds
        let containerView = UIView(frame: screenBounds)
        containerView.backgroundColor = parseColor(hexString: backgroundColorHex, defaultColor: .black)

        if let lottieName = lottieName, !lottieName.isEmpty {
            var animationPath = Bundle.main.path(forResource: lottieName, ofType: "json")

            if animationPath == nil {
                 self.lottieAnimationView = LottieAnimationView(name: lottieName)
                 if self.lottieAnimationView?.animation == nil {
                     print("[SplashViewModule][WARN] Lottie animation '\(lottieName)' not found using name.")
                     self.lottieAnimationView = nil
                 }
            } else {
                 self.lottieAnimationView = LottieAnimationView(filePath: animationPath!)
            }


            let resizeMode = options["resizeMode"] as? String ?? "contain"
            let repeatLottie = options["repeat"] as? Bool ?? false
            if let lottieView = self.lottieAnimationView {
                lottieView.contentMode = (resizeMode == "cover") ? .scaleAspectFill : .scaleAspectFit
                lottieView.loopMode = repeatLottie ? .loop : .playOnce
                lottieView.frame = containerView.bounds
                lottieView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                containerView.addSubview(lottieView)
                lottieView.play()
            } else {
                 print("[SplashViewModule][WARN] Lottie animation file or resource not found: \(lottieName)")
            }
        }

        let newWindow = UIWindow(frame: screenBounds)
        if #available(iOS 13.0, *) {
            newWindow.windowScene = windowScene
        }
        newWindow.windowLevel = .statusBar + 1
        let rootVC = UIViewController()
        rootVC.view = containerView
        newWindow.rootViewController = rootVC
        newWindow.makeKeyAndVisible()
        self.splashWindow = newWindow

        if let durationNum = durationNumber, durationNum.doubleValue > 0 {
            let durationInSeconds = durationNum.doubleValue / 1000.0
            hideTimer = Timer.scheduledTimer(withTimeInterval: durationInSeconds, repeats: false) { [weak self] _ in
                self?.hideSplash()
            }
        }
    }

    @objc(hideSplash)
    public func hideSplash() {
        hideSplashInternal(animated: true)
    }

    private func hideSplashInternal(animated: Bool) {
        hideTimer?.invalidate()
        hideTimer = nil

        guard let windowToDismiss = self.splashWindow else {
            return
        }

        self.lottieAnimationView?.stop()
        self.lottieAnimationView?.removeFromSuperview()
        self.lottieAnimationView = nil

        self.splashWindow = nil

        if animated {
            UIView.animate(withDuration: 0.3, animations: {
                windowToDismiss.alpha = 0.0
            }) { finished in
                windowToDismiss.isHidden = true
            }
        } else {
            windowToDismiss.isHidden = true
        }
    }

    @objc public func invalidate() {
        DispatchQueue.main.async { [weak self] in
             self?.hideSplashInternal(animated: false)
        }
    }

    private func parseColor(hexString: String?, defaultColor: UIColor) -> UIColor {
        guard let hexString = hexString else {
            return defaultColor
        }

        let hex = hexString.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        guard hex.count == 3 || hex.count == 6 || hex.count == 8 else {
            return defaultColor
        }

        var hexValue: UInt64 = 0
        let scanner = Scanner(string: hex)
        guard scanner.scanHexInt64(&hexValue) else {
            return defaultColor
        }

        let r, g, b, a: CGFloat
        switch hex.count {
        case 3: // RGB (12-bit)
            r = CGFloat((hexValue >> 8) & 0xF) / 15.0
            g = CGFloat((hexValue >> 4) & 0xF) / 15.0
            b = CGFloat(hexValue & 0xF) / 15.0
            a = 1.0
        case 6: // RGB (24-bit)
            r = CGFloat((hexValue >> 16) & 0xFF) / 255.0
            g = CGFloat((hexValue >> 8) & 0xFF) / 255.0
            b = CGFloat(hexValue & 0xFF) / 255.0
            a = 1.0
        case 8: // ARGB (32-bit)
            r = CGFloat((hexValue >> 16) & 0xFF) / 255.0
            g = CGFloat((hexValue >> 8) & 0xFF) / 255.0
            b = CGFloat(hexValue & 0xFF) / 255.0
            a = CGFloat((hexValue >> 24) & 0xFF) / 255.0
        default:
            return defaultColor
        }

        return UIColor(red: r, green: g, blue: b, alpha: a)
    }

    override public init() {
        super.init()
    }
}