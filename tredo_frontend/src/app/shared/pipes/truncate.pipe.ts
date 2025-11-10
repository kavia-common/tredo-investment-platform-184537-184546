import { Pipe, PipeTransform } from '@angular/core';

/**
 * TruncatePipe - truncates text by character or word count.
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  // PUBLIC_INTERFACE
  /** Truncates a string by characters or words and appends suffix. */
  transform(value: string | null | undefined, limit = 100, byWords = false, suffix = '…'): string {
    if (!value) return '';
    const str = String(value);
    if (byWords) {
      const parts = str.split(/\s+/);
      return parts.length > limit ? parts.slice(0, limit).join(' ') + suffix : str;
    }
    return str.length > limit ? str.slice(0, limit) + suffix : str;
  }
}
