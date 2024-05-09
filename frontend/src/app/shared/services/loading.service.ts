import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal(false)


  constructor() { }

  setLoading(loading: boolean): void {
    this.loading = signal(loading)
  }
}
