import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  standalone: true,
})
export class BaseComponent implements OnDestroy {
  componentDestroyed$ = new Subject<void>()
  intervalUpdate: any = null

  constructor() {}

  /** Emit null when components gets destroyed. Unsubscribe from Observables. */
  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
    if (this.intervalUpdate) {
      clearInterval(this.intervalUpdate)
      this.intervalUpdate = 0
    }
  }
}
