package com.ruiobo;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.azure.mobile.react.analytics.RNAnalyticsPackage;
import com.microsoft.azure.mobile.react.crashes.RNCrashesPackage;
import com.microsoft.azure.mobile.react.mobilecenter.RNMobileCenterPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;

import org.lovebing.reactnative.baidumap.BaiduMapPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RealmReactPackage(),
          new RCTSplashScreenPackage(),
          new RNCrashesPackage(MainApplication.this, getResources().getString(R.string.mobileCenterCrashes_whenToSendCrashes)),
          new RNAnalyticsPackage(MainApplication.this, getResources().getString(R.string.mobileCenterAnalytics_whenToEnableAnalytics)),
          new RNMobileCenterPackage(MainApplication.this),
          new VectorIconsPackage(),
          new LinearGradientPackage(),
          new BaiduMapPackage(getApplicationContext())
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
