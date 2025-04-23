package com.splashview

import android.app.Activity
import android.app.Dialog
import android.graphics.Color
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import com.airbnb.lottie.LottieAnimationView
import android.widget.ImageView
import android.content.res.Resources

object SplashView {
    @JvmStatic
    var splashShownFromJS: Boolean = false
    private var splashDialog: Dialog? = null
    private var hideHandler: Handler? = null
    private var hideRunnable: Runnable? = null

    // Helper function to parse hex color string
    private fun parseColor(colorString: String?, defaultColor: Int): Int {
        if (colorString == null) return defaultColor
        return try {
            Color.parseColor(colorString)
        } catch (e: IllegalArgumentException) {
            println("⚠️ Invalid background color format: $colorString. Using default.")
            defaultColor
        }
    }

    // Method called by MainActivity and JS Module
    @JvmStatic
    fun showSplashView(activity: Activity, options: Map<String, Any>? = null) {
        // Check if the call likely came from JS module by checking if options exist
        // (MainActivity call might pass options, but JS call definitely will if setting lottie/duration)
        // A more robust way could involve adding a specific flag in options from JS module if needed.
        if (options != null) {
             splashShownFromJS = true // Mark that JS likely initiated this show call
        }

        val lottieName = options?.get("lottie") as? String
        // Get duration ONLY if passed in options. Native call won't have it.
        val duration = options?.get("duration") as? Number
        // *** Get background color from options ***
        val backgroundColorString = options?.get("backgroundColor") as? String
        // *** Parse color, default to black ***
        val backgroundColor = parseColor(backgroundColorString, Color.BLACK)
        val resizeMode = options?.get("resizeMode") as? String ?: "contain"
        val repeatLottie = options?.get("repeat") as? Boolean ?: false

        if (!lottieName.isNullOrEmpty()) {
            showLottieSplashView(activity, lottieName, duration?.toLong(), backgroundColor, resizeMode, repeatLottie)
        } else {
            showStaticSplashView(activity, duration?.toLong(), backgroundColor)
        }
    }

    private fun showLottieSplashView(
        activity: Activity,
        lottieName: String,
        duration: Long? = null,
        backgroundColor: Int,
        resizeMode: String = "contain",
        repeatLottie: Boolean = false
    ) {
        if (activity.isFinishing || activity.isDestroyed) {
            println("Skipping showLottieSplash: Activity is not ready.")
            return
        }

        activity.runOnUiThread {
            if (splashDialog?.isShowing == true) return@runOnUiThread

            try {
                val resourceId = activity.resources.getIdentifier(lottieName, "raw", activity.packageName)
                if (resourceId == 0) {
                    throw Resources.NotFoundException("Lottie animation '$lottieName' not found in res/raw")
                }

                val lottieView = LottieAnimationView(activity).apply {
                    setAnimation(resourceId)
                    layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    scaleType = when (resizeMode) {
                        "cover" -> ImageView.ScaleType.CENTER_CROP
                        "contain" -> ImageView.ScaleType.CENTER_INSIDE
                        else -> ImageView.ScaleType.CENTER_INSIDE
                    }
                    repeatCount = if (repeatLottie) com.airbnb.lottie.LottieDrawable.INFINITE else 0
                    setBackgroundColor(backgroundColor)
                    playAnimation()
                }

                val themeId =
                    activity.resources.getIdentifier("SplashViewTheme", "style", activity.packageName)
                val themeResId = if (themeId != 0) themeId else R.style.SplashScreen_SplashTheme

                splashDialog = Dialog(activity, themeResId).apply {
                    setContentView(lottieView)
                    setCancelable(false)
                    window?.apply {
                        setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                        setBackgroundDrawableResource(android.R.color.transparent)
                        setFlags(
                            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                        )
                        addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
                        statusBarColor = Color.TRANSPARENT
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                            setDecorFitsSystemWindows(false)
                        }
                    }
                    show()
                }

                if (duration != null && duration > 0) {
                    setupAutoHide(duration)
                }
            } catch (e: Exception) {
                println("⚠️ Error showing Lottie animation '$lottieName': ${e.message}. Falling back to static splash.")
                splashDialog?.dismiss()
                splashDialog = null
                showStaticSplashView(activity, duration, backgroundColor)
            }
        }
    }

    // Renamed for clarity
    private fun showStaticSplashView(activity: Activity, duration: Long? = null, backgroundColor: Int) { // Add backgroundColor parameter
        if (activity.isFinishing || activity.isDestroyed) {
            println("Skipping showStaticSplash: Activity is not ready.")
            return
        }
        activity.runOnUiThread {
            if (splashDialog?.isShowing == true) return@runOnUiThread

            try {
                val themeId =
                    activity.resources.getIdentifier("SplashViewTheme", "style", activity.packageName)
                val themeResId = if (themeId != 0) themeId else R.style.SplashScreen_SplashTheme

                // Use the standard Android splash screen mechanism if available,
                // otherwise, create a simple dialog with the launch_screen drawable.
                // Note: This example uses a Dialog for consistency with Lottie,
                // but a real app might just rely on the theme's windowBackground.
                val view = LayoutInflater.from(activity).inflate(R.layout.launch_screen, null, false)
                view.setBackgroundColor(backgroundColor)

                splashDialog = Dialog(activity, themeResId).apply {
                    setContentView(view)
                    setCancelable(false)
                    window?.apply {
                        setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                        setBackgroundDrawableResource(android.R.color.transparent)
                        setFlags(
                            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                        )
                        addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
                        statusBarColor = Color.TRANSPARENT
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                            setDecorFitsSystemWindows(false)
                        }
                    }
                    show()
                }

                // *** Set up auto-hide ONLY if duration was provided ***
                if (duration != null && duration > 0) {
                    setupAutoHide(duration)
                }
            } catch (e: Exception) {
                println("⛔️ Error showing static splash view: ${e.message}")
                e.printStackTrace()
                splashDialog?.dismiss()
                splashDialog = null
            }
        }
    }

    private fun setupAutoHide(duration: Long) {
        // Cancel any existing hide timer
        hideHandler?.removeCallbacks(hideRunnable ?: return)
        
        // Create new hide timer
        hideHandler = Handler(Looper.getMainLooper())
        hideRunnable = Runnable { hideSplashView() }
        hideHandler?.postDelayed(hideRunnable!!, duration)
    }

    fun hideSplashView() {
        // Cancel any pending hide timer
        hideHandler?.removeCallbacks(hideRunnable ?: return)
        hideHandler = null
        hideRunnable = null
        
        splashDialog?.takeIf { it.isShowing }?.let { dialog ->
            val view = dialog.window?.decorView
            view?.animate()
                ?.alpha(0f)
                ?.setDuration(500)
                ?.withEndAction {
                    dialog.dismiss()
                    splashDialog = null
                }
                ?.start()
        }
    }
}
