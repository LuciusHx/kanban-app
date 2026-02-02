import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-card',
  imports: [CdkDrag, FormsModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  private elementRef = inject(ElementRef);

  task = input.required<Task | null>();

  taskDetails = output();
  editTask = output();
  deleteTask = output();

  delete = output<string>();

  menuOpen = signal(false);

  //escuta qualquer clique na página
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    //verifica se o clique foi dentro do component
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    //se foi fora, fecha o menu
    if (!clickedInside) {
      this.menuOpen.set(false);
    }
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  onEdit() {
    this.editTask.emit();
    this.menuOpen.set(false);
  }

  onDelete() {
    this.delete.emit(this.task()!.id);
    this.menuOpen.set(false);
  }
}
