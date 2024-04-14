import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private _isIos: boolean
  constructor(
    private _platform: Platform
  ) { 
    this._isIos = this._platform.is('ipad') || this._platform.is('iphone') || this._platform.is('ios')
  }

  isIOSPlatform(): boolean {
    return this._isIos
  }
}
