import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {
  public darkMode$ = new BehaviorSubject<boolean>(false);

  // Check user preference for light/dark theme
  preferColorScheme: MediaQueryList
  UiMode: string = ''
  UiModeSubject = new BehaviorSubject<string>(this.UiMode)

  darkModeListener: (event: MediaQueryListEvent) => void;
  constructor() { 
    this.listenToUiModes()
  }
  listenToUiModes() {
    this.preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const initialMode = this.preferColorScheme.matches ? "dark" : "light"
    this.UiMode = initialMode
    this.UiModeSubject.next(this.UiMode)

    this.darkModeListener = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? "dark" : "light";
      this.UiMode = newColorScheme
      this.UiModeSubject.next(this.UiMode)


    }
    this.preferColorScheme.addEventListener('change', this.darkModeListener);
    return this.UiMode
  }

  getUserUiMode() {
    return this.UiModeSubject.asObservable()
  }

  removeSubscriptionDarkmodeLightmode() {
    this.preferColorScheme.removeEventListener('change', this.darkModeListener)
  }
}
