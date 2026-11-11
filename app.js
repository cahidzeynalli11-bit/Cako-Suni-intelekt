package com.jako.assistant

import android.content.Intent
import android.provider.Settings
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager

class JakoModule(private val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {

    override fun getName() = "JakoAccessibility"

    @ReactMethod
    fun isEnabled(promise: Promise) {
        val enabled = Settings.Secure.getString(
            ctx.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: ""
        promise.resolve(
            enabled.contains(ctx.packageName) && enabled.contains("JakoAccessibilityService")
        )
    }

    @ReactMethod
    fun openSettings(promise: Promise) {
        val i = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        ctx.startActivity(i)
        promise.resolve(true)
    }

    @ReactMethod
    fun lockScreen(promise: Promise) {
        val svc = JakoAccessibilityService.instance
        if (svc == null) promise.reject("NOT_ENABLED", "Xüsusi imkanlar xidməti aktiv deyil")
        else promise.resolve(svc.lockScreen())
    }

    @ReactMethod
    fun powerDialog(promise: Promise) {
        val svc = JakoAccessibilityService.instance
        if (svc == null) promise.reject("NOT_ENABLED", "Xüsusi imkanlar xidməti aktiv deyil")
        else promise.resolve(svc.powerDialog())
    }
}

class JakoPackage : ReactPackage {
    override fun createNativeModules(c: ReactApplicationContext): List<NativeModule> =
        listOf(JakoModule(c))

    override fun createViewManagers(c: ReactApplicationContext): List<ViewManager<*, *>> =
        emptyList()
}
