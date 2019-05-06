package com.invertase.rnfirebasestarter;
import com.imagepicker.ImagePickerPackage;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.RNFetchBlob.RNFetchBlobPackage;

//googleauth
import co.apptailor.googlesignin.RNGoogleSigninPackage;
//facebook
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  //facebook callback
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
   
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
    

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNFirebaseAuthPackage(),
          new RNFirebasePackage(),
          new FBSDKPackage(mCallbackManager),
          new RNFirebaseFirestorePackage(),
          new RNFirebaseStoragePackage(),
          new RNFetchBlobPackage(),
          // Image Upload Packages:
          new ImagePickerPackage(),
          //googleauth
          new RNGoogleSigninPackage(),
          new MapsPackage(),    
         
          new RNFirebaseDatabasePackage()
        );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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
