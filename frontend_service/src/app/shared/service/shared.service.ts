import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private snackBar: MatSnackBar) { }


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
}
