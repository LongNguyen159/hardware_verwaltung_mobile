import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {
  public darkMode$ = new BehaviorSubject<boolean>(false)

  // Check user preference for light/dark theme
  private _preferColorScheme: MediaQueryList
  private _UiMode: string = ''
  private _UiModeSubject = new BehaviorSubject<string>(this._UiMode)

  darkModeListener: (event: MediaQueryListEvent) => void;

  constructor() { 
    this._listenToUiModes()
  }
  private _listenToUiModes() {
    this._preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const initialMode = this._preferColorScheme.matches ? "dark" : "light"
    this._UiMode = initialMode
    this._UiModeSubject.next(this._UiMode)

    this.darkModeListener = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? "dark" : "light";
      this._UiMode = newColorScheme
      this._UiModeSubject.next(this._UiMode)


    }
    this._preferColorScheme.addEventListener('change', this.darkModeListener);
    return this._UiMode
  }

  /** Get UI mode of system. Emits a value everytime user changes system mode (dark - light).
   * Observable string: 'dark', 'light'
   */
  getUserUiMode() {
    return this._UiModeSubject.asObservable()
  }

  removeSubscriptionDarkmodeLightmode() {
    this._preferColorScheme.removeEventListener('change', this.darkModeListener)
  }
}
