import { Component, input, output, signal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-card',
  imports: [CdkDrag],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  task = input.required<Task | null>();

  taskDetails = output();
  editTask = output();
  deleteTask = output();

  selectedTask = signal<Task | null>(null);


}
