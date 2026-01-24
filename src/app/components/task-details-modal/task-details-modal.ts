import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-details-modal',
  imports: [DatePipe],
  templateUrl: './task-details-modal.html',
  styleUrl: './task-details-modal.scss',
})
export class TaskDetailsModal {
  open = input.required<boolean>();
  task = input<Task | null>(null);

  close = output<void>();
}
