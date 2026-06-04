"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.hideSplash = hideSplash;
exports.showSplash = showSplash;
exports.showTimedSplash = showTimedSplash;
Object.defineProperty(exports, "useHideSplash", {
  enumerable: true,
  get: function () {
    return _useHideSplash.useHideSplash;
  }
});
var _NativeSplashView = _interopRequireDefault(require("./NativeSplashView.js"));
var _useHideSplash = require("./useHideSplash.js");
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function showSplash(options) {
  if (_reactNative.Platform.OS === 'ios') return;
  return _NativeSplashView.default.showSplash(options || {});
}
function showTimedSplash(options) {
  const {
    lottie,
    duration,
    backgroundColor,
    resizeMode = 'contain',
    repeat = false,
    ...restOptions
  } = options || {};
  const finalOptions = {
    ...restOptions
  };
  if (lottie) {
    finalOptions.lottie = lottie;
  }
  if (backgroundColor) {
    finalOptions.backgroundColor = backgroundColor;
  }
  finalOptions.resizeMode = resizeMode;
  finalOptions.repeat = repeat;
  const parsedDuration = typeof duration === 'number' ? duration : parseInt(String(duration), 10);
  if (!isNaN(parsedDuration) && parsedDuration > 0) {
    finalOptions.duration = parsedDuration;
  } else if (duration !== undefined) {
    console.warn(`[showTimedSplash] Invalid or zero duration provided (${duration}). Splash might not auto-hide.`);
  }
  showSplash(finalOptions);
}
function hideSplash() {
  if (_reactNative.Platform.OS === 'ios') return;
  return _NativeSplashView.default.hideSplash();
}
var _default = exports.default = {
  showSplash,
  hideSplash,
  useHideSplash: _useHideSplash.useHideSplash,
  showTimedSplash
};
//# sourceMappingURL=index.js.map