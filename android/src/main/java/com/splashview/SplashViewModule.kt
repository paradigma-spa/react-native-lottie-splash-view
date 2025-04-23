package com.splashview

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = SplashViewModule.NAME)
class SplashViewModule(reactContext: ReactApplicationContext) :
  NativeSplashViewSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun showSplash(options: ReadableMap?) {
    val activity = currentActivity ?: return
    val optionsMap = options?.toHashMap() as? Map<String, Any>
    SplashView.showSplashView(activity, optionsMap)
  }

  override fun hideSplash() {
    SplashView.hideSplashView()
  }

  companion object {
    const val NAME = "SplashView"
  }
}
