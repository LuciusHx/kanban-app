import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = signal(false);

  //getter
  readonly loading = this._loading.asReadonly();

  //loading
  showLoading() {
    this._loading.set(true);
  }

  closeLoading() {
    this._loading.set(false);
  }
}
