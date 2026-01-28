import { Injectable } from '@angular/core';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'tasks';

  saveToStorage(tasks: Task[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      //add error service
    }
  }

  loadFromStorage(): Task[] | null {
    try {
      const data = localStorage.getItem('tasks');
      return data ? JSON.parse(data) : [];
    } catch {
      // this.setError('Dados salvos estão corrompidos.');
      return [];
    }
  }
}
