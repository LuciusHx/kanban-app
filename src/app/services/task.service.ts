import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Task, TaskFormModel, TaskStatus } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly url = 'assets/tasks.json';

  http = inject(HttpClient);

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
  }

  editTask(id: string, data: Partial<Task>) {
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
  }

  deleteTask(id: string) {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  //--------- LocalStorage
  private saveToStorage(tasks: Task[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  private loadFromStorage(): Task[] | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? (JSON.parse(data) as Task[]) : null;
  }
}
