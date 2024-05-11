import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal(false)


  constructor() { }

  /** Currently being used for set loading flag of 'Lend Item' and 'Return Item' button
   * in device-details page.
   * 
   * If this signal flag is true, then the buttons will be disabled.
   * Because it's a bad idea to let user POST two times to backend while the first request
   * is being processed.
   * That's why the loading signal is here.
   */
  setLoading(loading: boolean): void {
    this.loading = signal(loading)
  }
}
