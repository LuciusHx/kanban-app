import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly url = 'assets/tasks.json';

  http = inject(HttpClient);

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

  loadTasks() {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Task[]>(this.url).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Erro ao carregar tarefas');
        this._loading.set(false);
      },
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
}
