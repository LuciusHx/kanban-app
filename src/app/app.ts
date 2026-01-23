import { CdkDragDrop, CdkDropList, CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task, TaskStatus } from './models/task.interface';

@Component({
  selector: 'app-root',
  imports: [CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  taskService = inject(TaskService);

  ngOnInit() {
    this.taskService.loadTasks();
  }

  drop(event: CdkDragDrop<Task[]>, status: TaskStatus) {
    const task = event.item.data as Task;

    if (!task) return;

    this.taskService.moveTask(task.id, status);
  }
}
