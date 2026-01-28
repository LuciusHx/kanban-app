import { CdkDragDrop, CdkDropList, CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, effect, inject, signal } from '@angular/core';

import { Task, TaskFormModel, TaskStatus } from './models/task.interface';

import { TaskModal } from './components/task-modal/task-modal';
import { TaskDetailsModal } from './components/task-details-modal/task-details-modal';
import { Toast } from './components/toast/toast';

import { TaskService } from './services/task.service';
import { ToastService } from './services/toast.service';
import { LoadingService } from './services/loading.service';
import { ErrorService } from './services/error.service';

@Component({
  selector: 'app-root',
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, TaskModal, TaskDetailsModal, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  taskService = inject(TaskService);
  toastService = inject(ToastService);
  loadingService = inject(LoadingService);
  errorService = inject(ErrorService);

  loading = this.loadingService.loading;

  showModal = signal(false);
  showDetailsModal = signal(false);

  selectedTask = signal<Task | null>(null);
  editingTask = signal<Task | null>(null);

  ngOnInit() {
    this.taskService.loadTasks();
  }

  constructor() {
    effect(() => {
      const error = this.errorService.error();

      if (error) {
        this.toastService.error(error);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: TaskStatus) {
    const task = event.item.data as Task;

    if (!task) return;

    this.taskService.moveTask(task.id, status, event.currentIndex);
  }

  //---------- MODAl
  openCreateModal() {
    this.editingTask.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTask.set(null);
  }

  openEditModal(task: Task) {
    this.editingTask.set(task);
    this.showModal.set(true);
  }

  //modal de detalhes da task
  openDetails(task: Task) {
    this.selectedTask.set(task);
    this.showDetailsModal.set(true);
  }

  closeDetails() {
    this.showDetailsModal.set(false);
    this.selectedTask.set(null);
  }

  //------ CRUD METHODS
  createTask(task: TaskFormModel) {
    this.taskService.createTask(task);
    this.closeModal();
  }

  editTask(data: TaskFormModel) {
    const task = this.editingTask();

    if (!task) return;

    this.taskService.editTask(task.id, data);
    this.closeModal();
    this.editingTask.set(null);
  }

  deleteTask(task: Task) {
    const confirmed = confirm(`Deseja remover a tarefa "${task.title}"?`);
    if (!confirmed) return;

    this.taskService.deleteTask(task.id);
  }

  //loading (apenas para demonstração que a funcionalidade EXISTE)
  showLoading() {
    this.loadingService.showLoading();

    setTimeout(() => this.loadingService.closeLoading(), 1000);
  }
}
