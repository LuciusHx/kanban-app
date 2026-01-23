import { CdkDragDrop, CdkDropList, CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task, TaskFormModel, TaskStatus } from './models/task.interface';
import { TaskModal } from './components/task-modal/task-modal';

@Component({
  selector: 'app-root',
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, TaskModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  taskService = inject(TaskService);

  showModal = signal(false);

  ngOnInit() {
    this.taskService.loadTasks();
  }

  drop(event: CdkDragDrop<Task[]>, status: TaskStatus) {
    const task = event.item.data as Task;

    if (!task) return;

    this.taskService.moveTask(task.id, status);
  }

  //---------- MODAl
  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  createTask(task: TaskFormModel) {
    this.taskService.createTask(task);
    this.closeModal();
  }
}
