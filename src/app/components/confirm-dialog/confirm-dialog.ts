import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  open = input.required<boolean>();
  message = input<string>('Tem certeza que deseja excluir este item?');

  confirm = output<void>();
  cancel = output<void>();
}
