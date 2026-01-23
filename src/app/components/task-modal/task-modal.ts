import { Component, input, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { TaskFormModel } from '../../models/task.interface';

@Component({
  selector: 'app-task-modal',
  imports: [FormField],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
})
export class TaskModal {
  open = input.required<boolean>();
  mode = input<'create' | 'edit'>('create');

  saveTask = output<TaskFormModel>();
  cancel = output<void>();

  taskModel = signal<TaskFormModel>({ title: '', description: '', priority: 'LOW' });

  taskForm = form(this.taskModel, (path) => {
    required(path.title, { message: 'Campo obrigatório!' });
    required(path.description, { message: 'Campo obrigatório!' });
  });

  save(): void {
    submit(this.taskForm, async (form) => {
      this.saveTask.emit(form().value());
      return null;
    });
  }
}
