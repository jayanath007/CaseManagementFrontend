import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[dpsTimeOnly]'
})
export class TimeOnlyDirective {
    // @Input() dpsTimeOnly: number;
    private regex: RegExp = new RegExp(/^(2[0-3]|[01]?[0-9]):([0-5]|[0-5]{1}[0-9])$/);
    // private regex: RegExp = new RegExp(/^[0-9]+(\[0-9]*){0,1}$/g);

    private specialKeys: Array<string> = ['Backspace', 'Delete', 'Tab', 'Home', 'Shift', 'ArrowLeft', 'ArrowRight'];

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.el.nativeElement.selectionEnd !== this.el.nativeElement.selectionStart) {
            event.preventDefault();
            return;
        } else if (this.specialKeys.indexOf(event.key) !== -1) {
            if (event.key === 'Backspace' && this.el.nativeElement.value.charAt(this.el.nativeElement.selectionEnd - 1) === ':') {
                event.preventDefault();
            } else if (event.key === 'Delete' && this.el.nativeElement.value.charAt(this.el.nativeElement.selectionEnd + 1) === ':') {
                event.preventDefault();
            }
            return;
        }

        const current: string = this.el.nativeElement.value;
        // const next: string = current.concat(event.key);
        const strin1: string = current.slice(0, this.el.nativeElement.selectionEnd);
        const strin2: string = current.slice(this.el.nativeElement.selectionEnd, current.length);
        const next: string = strin1 + event.key + strin2;
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        } else {
            return;
        }
    }
}
