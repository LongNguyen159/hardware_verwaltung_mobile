import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private _isIos: boolean
  private _nativePlatforms =  ['ios', 'android', 'cordova', 'capacitor', 'ipad', 'iphone']
  constructor(
    private _platform: Platform
  ) {
    console.log('platforms:', _platform.platforms())
    this._isIos = this._platform.is('ipad') || this._platform.is('iphone') || this._platform.is('ios')
    console.log('is Platform native?', this.isNativePlatform())
  }

  isIOSPlatform(): boolean {
    return this._isIos
  }

  /** Some plugins only work on native platform (ios, android) and not on browser/web,
   * that's why we will need this function to check before using plugins.
   */
  isNativePlatform(): boolean {
    const currentPlatforms: string[] = this._platform.platforms()

    for (const platform of currentPlatforms) {
      if (this._nativePlatforms.includes(platform)) {
        return true
      }
    }
    return false
  }
}
