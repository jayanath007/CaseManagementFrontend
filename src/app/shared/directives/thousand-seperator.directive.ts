import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[dpsThousandSeperator]'
})
export class ThousandSeperatorDirective {

  @Input() dpsThousandSeperator: number;
  private regex: RegExp = new RegExp(/^[0-9]+(\[0-9]*){0,1}$/g);

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', ','];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    this.el.nativeElement.value = current.replace(/\,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (next) {
      const next1 = next.replace(',', '');
      if (next1 && (!String(next1).match(this.regex) || String(next1).length > this.dpsThousandSeperator)) {
        event.preventDefault();
      }
    }

  }

}
