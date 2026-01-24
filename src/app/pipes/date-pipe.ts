import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: string | number | Date | null | undefined): string {
    if (!value) return '';

    try {
      return formatDate(value, 'dd/MM/yyyy', this.locale);
    } catch (e) {
      return '';
    }
  }
}
