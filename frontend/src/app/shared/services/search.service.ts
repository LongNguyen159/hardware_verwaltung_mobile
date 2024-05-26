import { Injectable, inject } from '@angular/core';
import { PlatformService } from './platform.service';
import { Keyboard } from '@capacitor/keyboard';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  platformService = inject(PlatformService)
  enableScrollEvent: boolean = false
  scrollEventSubject: Subject<boolean> = new Subject<boolean>()

  constructor() { }

  enableScrollEventOnSearchFocus() {
    this.enableScrollEvent = true
    this.scrollEventSubject.next(this.enableScrollEvent)
  }

  disableScrollEventOnSearchBlur() {
    this.enableScrollEvent = false
    this.scrollEventSubject.next(this.enableScrollEvent)
  }

  isScrollEventEnabled() { 
    return this.scrollEventSubject.asObservable()
   }

  async hideKeyboardOnScroll() {    
    if (this.platformService.isNativePlatform()) {
      await Keyboard.hide()

      /** Disable scroll events after successfully hiding the keyboard. Spare the 
       * computational resources.
       */
      this.disableScrollEventOnSearchBlur()
    }
  }
}
