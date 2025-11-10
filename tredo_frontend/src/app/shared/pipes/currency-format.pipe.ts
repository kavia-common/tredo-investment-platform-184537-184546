import { Pipe, PipeTransform } from '@angular/core';

/**
 * CurrencyFormatPipe - formats numbers as currency with Intl API.
 */
@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  // PUBLIC_INTERFACE
  /** Formats a number with Intl.NumberFormat using currency style. */
  transform(value: number | string | null | undefined, currency = 'INR', locale = 'en-IN', minimumFractionDigits = 2): string {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return '';
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits }).format(num);
    } catch {
      return `${currency} ${num}`;
    }
  }
}
