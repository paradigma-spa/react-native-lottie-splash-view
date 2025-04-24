package splashview.example

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.splashview.SplashView

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "SplashViewExample"

  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.AppTheme)
    super.onCreate(savedInstanceState)

    // Only show splash natively if JS hasn't already shown it
    if (!com.splashview.SplashView.splashShownFromJS) {
        val options = mapOf(
            "lottie" to "logoanimation",
            "backgroundColor" to "#c4067f",
            "resizeMode" to "cover",
            "repeat" to true,
        )
        // showSplashView will internally handle Lottie or fallback to static
        com.splashview.SplashView.showSplashView(this, options)
    }
    // No else block needed - if splashShownFromJS is true, JS will handle showing/hiding.
}

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
