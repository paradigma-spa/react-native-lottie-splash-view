# React Native Lottie Splash View
## ⚡️ Quick Start

```bash
# Install splash view and lottie dependency
npm install react-native-lottie-splash-view
# or
yarn add react-native-lottie-splash-view
```

### 🟢 Android
- Splash can show **before React Native is initialized** (native-only splash).
- Can be **animated (Lottie)** or **static**.
- Full control from JS (`show`, `hide`, `timed splash`, etc.)

### 🍎 iOS
- Splash **must start from native** (AppDelegate).
- No runtime control from JS.
- Use **Lottie inside AppDelegate**, after native `Storyboard` is shown.

---

## ✨ Features

- Show/hide splash programmatically (Android only)
- Lottie animation support (static & dynamic)
- Static fallback if no Lottie is provided
- Custom themes and layouts
- Supports **iOS** and **Android**
- Compatible with **Fabric/JSI** and **Classic Bridge**

---

## ⚙️ Native Setup

### 🖼 Create Your Lottie

Create a `logoanimation.json` using Adobe After Effects + [LottieFiles](https://lottiefiles.com/).

---

## ✅ Android Setup

### 1. Add Lottie file

- Path: `android/app/src/main/res/raw/logoanimation.json`
- Use lowercase & underscores (`logo_animation.json` if needed)

### 2. Static Splash (Optional Fallback)

If no Lottie is passed, this layout is shown as static splash:

#### `launch_screen.xml`

**Path:** `android/app/src/main/res/layout/launch_screen.xml`

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <com.airbnb.lottie.LottieAnimationView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:lottie_rawRes="@raw/logoanimation"
        app:lottie_autoPlay="true"
        app:lottie_loop="false"
        app:lottie_renderMode="hardware"
        android:scaleType="centerCrop"/>
</FrameLayout>
```

#### `styles.xml`

```xml
<resources>
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:windowNoTitle">true</item>
  </style>

  <style name="SplashTheme" parent="Theme.MaterialComponents.DayNight.NoActionBar">
    <item name="android:windowBackground">@color/splash_background</item>
    <item name="android:windowExitAnimation">@android:anim/fade_out</item>
    <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    <item name="android:windowFullscreen">true</item>
    <item name="android:fitsSystemWindows">false</item>
  </style>
</resources>
```

#### `build.gradle`

```gradle
android {
  sourceSets {
    main {
      resources.srcDirs = ['src/main/res', 'src/main/res/raw']
    }
  }
}

dependencies {
  implementation "com.airbnb.android:lottie:6.1.0"
}
```

### 3. `MainActivity.kt`

```kotlin
class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "LottieSplashViewExample"

  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.AppTheme)
    super.onCreate(savedInstanceState)

    if (!SplashView.splashShownFromJS) {
      val options = mapOf(
        "lottie" to "logoanimation", // optional
        "backgroundColor" to "#2a37e6", // optional
        "resizeMode" to "cover", // optional
        "duration" to 10000 // optional
      )
      SplashView.showSplashView(this, options)
    }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

---

## ✅ iOS Setup

### 1. Add Lottie file

- Drag `logoanimation.json` into `ios/YourApp`
- Enable **"Copy items if needed"**
- Go to `Build Phases` → `Copy Bundle Resources`, and ensure it's included

### 2. `AppDelegate.swift`

```swift
private func showSplashScreen() {
  let options: [String: Any] = [ //optional
    "lottie": "logoanimation",
    "backgroundColor": "#2a37e6",
    "duration": 10000,
    "resizeMode": "cover",
    "repeat": true
  ]
  SplashView.shared.showSplash(options: options)
}
```

Add `showSplashScreen()` inside:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  showSplashScreen()
  return true
}
```

> ℹ️ Su iOS **il Lottie parte solo dopo il caricamento dello Storyboard**, non prima!

---

## 📘 API Reference

### Functions (Android only)

| Function           | Description                             |
|--------------------|-----------------------------------------|
| `showSplash`       | Show splash manually                    |
| `hideSplash`       | Hide splash                             |
| `showTimedSplash`  | Show splash for a duration              |
| `useHideSplash`    | Hook to auto-hide after delay           |

> ⚠️ On **iOS**, these are no-ops (splash is controlled from native only)

### Splash Options

| Key               | Type       | Description                            |
|-------------------|------------|----------------------------------------|
| `lottie`          | `string`   | File name without `.json` (optional)   |
| `duration`        | `number`   | Duration in milliseconds (optional)                |
| `backgroundColor` | `string`   | Hex color (e.g. `#FFFFFF`) (optional)             |
| `resizeMode`      | `string`   | `'cover'` or `'contain'`  (default:'contain')             |
| `repeat`          | `boolean`  | Repeat animation (default: false)      |

---

## 💡 Usage Example (Android)

```tsx
import { showTimedSplash, useHideSplash } from 'react-native-lottie-splash-view';

function App() {
  useHideSplash({ minimumDuration: 3000 });

  const showLottie = () => {
    showTimedSplash({
      lottie: 'logoanimation',
      duration: 4000,
      backgroundColor: '#ffffff',
      resizeMode: 'contain',
      repeat: false,
    });
  };

  return <YourApp />;
}
```

---

## 🧠 Platform Differences

| Feature                     | Android                | iOS                        |
|----------------------------|------------------------|----------------------------|
| JS control (`show/hide`)   | ✅ Yes                 | ❌ No                      |
| Lottie pre-RN init         | ✅ Yes (native start)  | ❌ No                      |
| Static splash fallback     | ✅ Supported           | ✅ Via storyboard          |
| Timed splash               | ✅ Yes                 | ❌ No                      |

---

## 🛠 Troubleshooting

### iOS

```bash
cd ios && pod install && cd ..
```

- Ensure `.json` is in `Copy Bundle Resources`
- Check casing and spelling

### Android

- Place file in `res/raw/`
- Filename must not include `.json`
- If build fails:

```bash
cd android && ./gradlew clean && cd ..
```

---

## 🏗 Architecture Compatibility

- ✅ React Native `0.68+`
- ✅ Works with **Fabric/JSI** and **Classic bridge**

---

## 📄 License

MIT