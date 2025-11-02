// android/app/build.gradle.kts

plugins {
    id("com.android.application")
    // ✅ Removed: id("com.google.gms.google-services")
}

android {
    namespace = "com.company.vision_vibe"
    compileSdk = 33

    defaultConfig {
        applicationId = "com.company.vision_vibe"
        minSdk = 21
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // ✅ Firebase native dependencies removed
}
