import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Task, TaskFormModel, TaskStatus } from '../models/task.interface';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly url = 'assets/tasks.json';

  http = inject(HttpClient);
  toastService = inject(ToastService);

  //localStorage key
  private readonly STORAGE_KEY = 'kanban_tasks';

  // estado
  private _tasks = signal<Task[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  //getter
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  //filtro para as colunas
  readonly backlogTasks = computed(() => this.tasks().filter((t) => t.status === 'Backlog'));
  readonly inProgressTasks = computed(() =>
    this.tasks().filter((t) => t.status === 'Em andamento'),
  );
  readonly reviewTasks = computed(() => this.tasks().filter((t) => t.status === 'Em revisão'));
  readonly doneTasks = computed(() => this.tasks().filter((t) => t.status === 'Concluído'));

  constructor() {
    effect(() => {
      const tasks = this._tasks();
      this.saveToStorage(tasks);
    });
  }

  moveTask(taskId: string, newStatus: TaskStatus) {
    this._tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  }

  // --------- CRUD
  loadTasks() {
    this._loading.set(true);
    this._error.set(null);

    const storedTasks = this.loadFromStorage();

    if (storedTasks) {
      this._tasks.set(storedTasks);
      this._loading.set(false);
    }

    this.http.get<Task[]>(this.url).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this.saveToStorage(tasks);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Erro ao carregar tarefas');
        this._loading.set(false);
      },
    });
  }

  createTask(task: TaskFormModel) {
    this._loading.set(true);

    const now = new Date().toISOString();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description,
      status: 'Backlog',
      priority: task.priority,
      createdAt: now,
      updatedAt: now,
    };

    this._tasks.update((tasks) => [...tasks, newTask]);
    this._loading.set(false);
  }

  editTask(id: string, data: Partial<Task>) {
    this._loading.set(true);
    const now = new Date().toISOString();

    this._tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...data,
              updatedAt: now,
            }
          : task,
      ),
    );
    this._loading.set(false);
  }

  deleteTask(id: string) {
    this._loading.set(true);
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
    this._loading.set(false);
  }

  //--------- LocalStorage
  private saveToStorage(tasks: Task[]) {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch {
      this._error.set('Não foi possível salvar as tarefas.');
    }
  }

  private loadFromStorage(): Task[] | null {
    try {
      const data = localStorage.getItem('tasks');
      return data ? JSON.parse(data) : [];
    } catch {
      this.setError('Dados salvos estão corrompidos.');
      return [];
    }
  }

  //loading
  setLoading() {
    this._loading.set(true);

    setTimeout(() => {
      this._loading.set(false);
    }, 3000);
  }

  //error
  private setError(message: string) {
    this._error.set(message);
  }
}
