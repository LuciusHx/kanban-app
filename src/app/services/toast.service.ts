import { Injectable, signal } from '@angular/core';

export type ToastType = 'error' | 'success' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toast = signal<Toast | null>(null);
  readonly toast = this._toast.asReadonly();

  show(message: string, type: ToastType = 'info') {
    this._toast.set({ message, type });

    setTimeout(() => {
      this._toast.set(null);
    }, 3000);
  }

  error(message: string) {
    this.show(message, 'error');
  }

  success(message: string) {
    this.show(message, 'success');
  }
}
