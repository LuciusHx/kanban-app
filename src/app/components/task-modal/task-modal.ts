import { Component, effect, input, output, signal } from '@angular/core';
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

  task = input<TaskFormModel | null>(null);

  saveTask = output<TaskFormModel>();
  cancel = output<void>();

  taskModel = signal<TaskFormModel>({ title: '', description: '', priority: 'Baixa' });

  taskForm = form(this.taskModel, (path) => {
    required(path.title, { message: 'Campo obrigatório!' });
    required(path.description, { message: 'Campo obrigatório!' });
  });

  constructor() {
    effect(() => {
      if (!this.open()) return;

      if (this.mode() === 'create') {
        this.resetForm();
      }
      if (this.mode() === 'edit' && this.task()) {
        this.taskModel.set(this.task()!);
      }
    });
  }

  private resetForm() {
    this.taskModel.set({
      title: '',
      description: '',
      priority: 'Baixa',
    });
  }

  onCancel() {
    this.resetForm();
    this.cancel.emit();
  }

  save(): void {
    submit(this.taskForm, async (form) => {
      this.saveTask.emit(form().value());
      this.taskModel.set({ title: '', description: '', priority: 'Baixa' });
      return null;
    });
  }
}
