import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  preferColorScheme: MediaQueryList

  UiMode: string = ''
  UiModeSubject = new BehaviorSubject<string>(this.UiMode)

  darkModeListener: (event: MediaQueryListEvent) => void;
  constructor(private snackBar: MatSnackBar) { 
    this.listenToUiModes()
  }


  openSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    })
  }

  getRelativeTimeText(date: Date): string {
    const units = [
      { label: 'year', duration: 365 * 24 * 60 * 60 * 1000 },
      { label: 'month', duration: 30 * 24 * 60 * 60 * 1000 },
      { label: 'day', duration: 24 * 60 * 60 * 1000 },
      { label: 'hour', duration: 60 * 60 * 1000 },
      { label: 'minute', duration: 60 * 1000 }
    ];

    const now = new Date();
    const elapsed = now.getTime() - date.getTime();

    for (const unit of units) {
        const unitElapsed = elapsed / unit.duration;
        if (unitElapsed >= 1) {
            const rounded = Math.floor(unitElapsed);
            return rounded === 1 ? `a ${unit.label} ago` : `${rounded} ${unit.label}s ago`;
        }
    }

    return 'just now';
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
