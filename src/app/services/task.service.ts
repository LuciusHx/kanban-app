import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Task, TaskFormModel, TaskStatus } from '../models/task.interface';

import { ToastService } from './toast.service';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './localStorage.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly url = 'assets/tasks.json';

  http = inject(HttpClient);

  toastService = inject(ToastService);
  loadingService = inject(LoadingService);
  localStorageService = inject(LocalStorageService);
  errorService = inject(ErrorService);

  // estado
  private _tasks = signal<Task[]>([]);

  //getter
  readonly tasks = this._tasks.asReadonly();

  //filtro para as colunas
  readonly backlogTasks = computed(() =>
    this.tasks()
      .filter((t) => t.status === 'Backlog')
      .sort((a, b) => a.order - b.order),
  );
  readonly inProgressTasks = computed(() =>
    this.tasks()
      .filter((t) => t.status === 'Em andamento')
      .sort((a, b) => a.order - b.order),
  );
  readonly reviewTasks = computed(() =>
    this.tasks()
      .filter((t) => t.status === 'Em revisão')
      .sort((a, b) => a.order - b.order),
  );
  readonly doneTasks = computed(() =>
    this.tasks()
      .filter((t) => t.status === 'Concluído')
      .sort((a, b) => a.order - b.order),
  );

  constructor() {
    effect(() => {
      const tasks = this._tasks();
      this.localStorageService.saveToStorage(tasks);
    });
  }

  moveTask(taskId: string, newStatus: TaskStatus, newIndex: number) {
    this._tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return tasks;

      // Remove a task da lista original
      let updatedTasks = tasks.filter((t) => t.id !== taskId);

      // Tasks da coluna destino
      const destinationTasks = updatedTasks
        .filter((t) => t.status === newStatus)
        .sort((a, b) => a.order - b.order);

      // Insere na posição visual correta
      destinationTasks.splice(newIndex, 0, {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Recalcula order da coluna destino
      destinationTasks.forEach((t, index) => {
        t.order = index;
      });

      // Junta tudo de volta
      return [...updatedTasks.filter((t) => t.status !== newStatus), ...destinationTasks];
    });
  }

  // --------- CRUD
  loadTasks() {
    this.loadingService.showLoading();
    this.errorService.setError(null);

    const storedTasks = this.localStorageService.loadFromStorage();

    if (storedTasks) {
      this._tasks.set(storedTasks);
      this.loadingService.closeLoading();
    }

    this.http.get<Task[]>(this.url).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this.localStorageService.saveToStorage(tasks);
        this.loadingService.closeLoading();
      },
      error: () => {
        this.errorService.setError('Erro ao carregar tarefas');

        this.loadingService.closeLoading();
      },
    });
  }

  createTask(task: TaskFormModel) {
    this.loadingService.showLoading();

    const now = new Date().toISOString();

    const tasks = this._tasks();

    const backlogTasks = tasks.filter((t) => t.status === 'Backlog');

    const lastOrder = backlogTasks.length > 0 ? Math.max(...backlogTasks.map((t) => t.order)) : 0;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description,
      status: 'Backlog',
      priority: task.priority,
      order: lastOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    this._tasks.update((tasks) => [...tasks, newTask]);
    this.loadingService.closeLoading();
  }

  editTask(id: string, data: Partial<Task>) {
    this.loadingService.showLoading();
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
    this.loadingService.closeLoading();
  }

  deleteTask(id: string) {
    this.loadingService.showLoading();
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
    this.loadingService.closeLoading();
  }
}
