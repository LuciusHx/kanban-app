import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task.interface';
import { DateFormatPipe } from '../../pipes/date-pipe';

@Component({
  selector: 'app-task-details-modal',
  imports: [DateFormatPipe],
  templateUrl: './task-details-modal.html',
  styleUrl: './task-details-modal.scss',
})
export class TaskDetailsModal {
  open = input.required<boolean>();
  task = input<Task | null>(null);

  close = output<void>();
}
