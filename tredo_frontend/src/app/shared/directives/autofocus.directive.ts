import { Directive, ElementRef, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * AutofocusDirective - focuses the element on init (browser only).
 */
@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  // PUBLIC_INTERFACE
  /** Enable/disable autofocus behavior */
  @Input('appAutofocus') enabled: boolean = true;

  ngAfterViewInit(): void {
    if (this.enabled && isPlatformBrowser(this.platformId)) {
      // Avoid errors when element is not focusable
      try {
        this.el.nativeElement.focus({ preventScroll: false } as any);
      } catch {
        // no-op
      }
    }
  }
}
