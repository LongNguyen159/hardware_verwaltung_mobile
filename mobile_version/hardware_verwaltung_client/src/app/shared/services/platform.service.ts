import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  isIos: boolean
  constructor(
    private _platform: Platform
  ) { 
    this.isIos = this._platform.is('ipad') || this._platform.is('iphone') || this._platform.is('ios')
  }

  isIOSPlatform(): boolean {
    return this.isIos
  }
}
