
# React Native Lottie Splash View

| Android Demo | iOS Demo | Only Lottie Splash |
|--------------|----------|--------------------|
| ![Demo Android](./demo/android-demo.gif) | ![Demo iOS](./demo/ios-demo.gif) | ![Only Lottie Splash](./demo/lottie-only-demo.gif) |



## ⚡️ Quick Start

```bash
npm install react-native-lottie-splash-view
# or
yarn add react-native-lottie-splash-view
```

---

## 🚀 Why Use This Library?

This library provides a smoother and more native **launch experience** compared to a JS-only splash screen.  
On Android, it supports **showing the splash before React Native is initialized**, and on iOS, it integrates with the required **LaunchScreen.storyboard**.

---

## ✅ iOS Setup

### 1. Add the Lottie JSON

- Drag `logoanimation.json` into your `ios/YourApp` folder
- Enable **"Copy items if needed"**
- Ensure it's added in **Build Phases → Copy Bundle Resources**

### 2. Modify `AppDelegate.swift`

> 📍 Path: `ios/YourApp/AppDelegate.swift`

Import `SplashView` at the top:
```swift
import SplashView
```

Add this method:
```swift
private func showSplashScreen() {
  let options: [String: Any] = [
    "lottie": "logoanimation",
    "backgroundColor": "#2a37e6",
    "duration": 10000,
    "resizeMode": "cover",
    "repeat": true
  ]
  SplashView.shared.showSplash(options: options)
}
```

Then call `showSplashScreen()` inside:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  showSplashScreen()
  return true
}
```

### 🎨 LaunchScreen.storyboard

We recommend editing `LaunchScreen.storyboard` to:
- Match the **background color** of your Lottie animation
- Optionally show your **logo** or **first animation frame**

> This creates a **seamless transition** from native splash to Lottie.

---

## ✅ Android Setup

### 1. Add the Lottie JSON

> 📍 Path: `android/app/src/main/res/raw/logoanimation.json`

Use lowercase and underscores in the filename.

### 2. MainActivity Setup

> 📍 Path: `android/app/src/main/java/com/<your_project_name>/MainActivity.kt`

At the top, **import**:

```kotlin
import com.splashview.SplashView
```

Then modify the `onCreate` method:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)

  if (!SplashView.splashShownFromJS) {
    val options = mapOf(
      "lottie" to "logoanimation",
      "backgroundColor" to "#2a37e6",
      "resizeMode" to "cover",
      "duration" to 10000
    )
    SplashView.showSplashView(this, options)
  }
}
```

---

## 🎯 Splash Behavior Overview

### iOS

1. **LaunchScreen.storyboard** is shown  
2. Then **Lottie animation**  
3. Then your app  

### Android

1. **launch_screen.xml** (if present)  
2. Then **Lottie animation**  
3. Then your app  

> If `launch_screen.xml` is missing, Android will show the background defined in your theme, or default to a black screen.

---

### ⏱ Splash Timing Logic

The splash screen will be hidden only when **both** of the following conditions are met:

1. The native `duration` timer (if set) has completed  
2. The conditions inside `useHideSplash` are satisfied (i.e., the app is ready **and** the minimum duration has elapsed)

This means:

- If you set `duration: 10000` and your app becomes ready in 5 seconds, the splash will stay visible for the full 10 seconds.  
- If your app takes 15 seconds to become ready, the splash will remain visible for 15 seconds, **ignoring** the 10-second duration.

This ensures both proper timing and visual consistency between native and JS readiness.

---


## 📂 Optional Static Splash Layout (Android)

If no Lottie is passed or you want a custom fallback:

> 📍 Path: `android/app/src/main/res/layout/launch_screen.xml`

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/splash_background">

    <ImageView
        android:layout_gravity="center"
        android:src="@drawable/my_new_logo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />
</FrameLayout>
```

> If this file is missing, Android will fallback to the app icon from the mipmap folders or to the window background color.

---

## 🎨 Themes and Translucent Option (Android)

> 📍 File: `android/app/src/main/res/values/styles.xml`

### Use `windowIsTranslucent` to Show Lottie Instantly

To display the Lottie animation immediately on app start (skipping `launch_screen.xml`), you can add:

```xml
<item name="android:windowIsTranslucent">true</item>
```

Example:

```xml
<resources>
  <!-- Base application theme. -->
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:windowNoTitle">true</item>
    <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    <item name="android:autofilledHighlight">@drawable/autofill_highlight</item>
    <item name="android:windowIsTranslucent">true</item>
  </style>
</resources>
```

> ✅ In this setup, there’s **no need** for `SplashTheme` or `launch_screen.xml`.  
> The Lottie animation will appear right away.

---

## 🎭 Optional: SplashTheme Explanation

You can optionally define a `SplashTheme` if you want to apply a separate theme **only during the initial app launch**:

### 1. Define SplashTheme in `styles.xml`

```xml
<resources>
  <style name="SplashScreen_SplashAnimation">
    <item name="android:windowExitAnimation">@android:anim/fade_out</item>
  </style>

  <style name="SplashScreen_SplashTheme" parent="Theme.AppCompat.NoActionBar">
    <item name="android:windowAnimationStyle">@style/SplashScreen_SplashAnimation</item>
  </style>
</resources>
```

### 2. Apply it in `AndroidManifest.xml` (optional)

```xml
<activity
    android:name=".MainActivity"
    android:theme="@style/SplashScreen_SplashTheme"
    ... >
```

> This will show the custom SplashTheme **only during the native app start**.

### 3. Remove it in `MainActivity.kt`

In `MainActivity.kt`, reset the theme to your app theme:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  setTheme(R.style.AppTheme) // Revert to main theme
  super.onCreate(savedInstanceState)
  ...
}
```

**When to use this?**

- If you want a visually distinct splash (e.g. no app bar, a different background)
- If you want an exit animation before Lottie loads

**When you can skip this?**

- If you're fine using the app's normal theme from launch
- If you're using `windowIsTranslucent` to show Lottie immediately

---

## 💡 Tips & Notes

- `SplashTheme` is **optional**, only needed if you want a custom look during the launch
- If you're not using `launch_screen.xml`, you **don’t need** to reference it in `AndroidManifest.xml`
- You can fully skip the static splash and `SplashTheme` if you enable `windowIsTranslucent` and let the Lottie animation play immediately

---

## 📘 API Reference (Android Only)

| Function           | Description                             |
|--------------------|-----------------------------------------|
| `showSplash`       | Show splash manually                    |
| `hideSplash`       | Hide splash                             |
| `showTimedSplash`  | Show splash for a duration              |
| `useHideSplash`    | Hook to auto-hide after delay           |

### Splash Options

| Key               | Type       | Description                            |
|-------------------|------------|----------------------------------------|
| `lottie`          | `string`   | File name without `.json` (optional)   |
| `duration`        | `number`   | Duration in milliseconds (optional)    |
| `backgroundColor` | `string`   | Hex color (e.g. `#FFFFFF`) (optional)  |
| `resizeMode`      | `string`   | `'cover'` or `'contain'` (default: `'contain'`) |
| `repeat`          | `boolean`  | Repeat animation (default: false)      |

---

## 💻 Usage Example

```tsx
import { showTimedSplash, useHideSplash } from 'react-native-lottie-splash-view';

function App() {
  useHideSplash({ minimumDuration: 3000 });

  const showSplash = () => {
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

## ⚠ Platform Differences

| Feature                     | Android                | iOS                        |
|----------------------------|------------------------|----------------------------|
| JS control (`show/hide`)   | ✅ Yes                 | ❌ No                      |
| Lottie before React loads  | ✅ Yes                 | ❌ No (storyboard required)|
| Static splash fallback     | ✅ launch_screen.xml   | ✅ storyboard              |
| Timed splash               | ✅ Yes                 | ❌ No                      |

---

## 🛠 Troubleshooting

### iOS

```bash
cd ios && pod install && cd ..
```

- Ensure `.json` is in "Copy Bundle Resources"
- Check casing and spelling

### Android

- Place file in `res/raw/`
- Filename must not include `.json`
- If build fails:

```bash
cd android && ./gradlew clean && cd ..
```

---

## 🧱 Architecture Support

- ✅ React Native `0.68+`
- ✅ Fabric & Classic bridge compatible

---

## 📄 License

MIT
