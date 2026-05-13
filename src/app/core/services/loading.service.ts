import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = signal<boolean>(false);
  readonly isLoading = this.loading.asReadonly();

  private loadingCount = 0;

  show(): void {
    this.loadingCount++;
    this.loading.set(true);
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading.set(false);
    }
  }

  reset(): void {
    this.loadingCount = 0;
    this.loading.set(false);
  }
}
