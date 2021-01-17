import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[dpsNumbersOnlyWithDecimals]'
})
export class NumbersOnlyWithDecimalsDirective implements OnChanges {

  constructor(private el: ElementRef) { }

  @Input() maxlength = 11;
  @Input() noOfdecimalsPoint?: number;
  @Input() value?: string;
  @Output() changeValue = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.el.nativeElement.value = changes.value.currentValue;
      if (this.el.nativeElement.value && this.noOfdecimalsPoint && document.activeElement !== this.el.nativeElement) {
        this.setDecimalPoint();
      }
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;

    if (this.el.nativeElement.value.indexOf(event.key) !== -1 && event.key === '.') {
      event.preventDefault();
    }

    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }



    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }

    // If defind maxDecimalsPoint, limit  point
    if (this.noOfdecimalsPoint && this.el.nativeElement.value) {
      if (this.el.nativeElement.selectionStart > this.el.nativeElement.value.indexOf('.')) {
        const currentDesimalValue = this.el.nativeElement.value.split('.')[1];
        if (currentDesimalValue && currentDesimalValue.length >= this.noOfdecimalsPoint) {
          event.preventDefault();
        }
      }
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (String(next).length > this.maxlength) {
      event.preventDefault();
    }
  }

  @HostListener('focusout', ['$event.target'])
  onFocusout(target: any) {
    // Add decimal point
    if (this.noOfdecimalsPoint) {
      this.setDecimalPoint();
    }
    this.changeValue.emit(this.el.nativeElement.value);
  }

  // @HostListener('change', ['$event.target']) onchange() {
  //   if (this.noOfdecimalsPoint && document.activeElement !== this.el.nativeElement) {
  //     this.setDeCimalPoint();
  //   }
  // }

  setDecimalPoint() {
    if (this.el.nativeElement.value && !this.el.nativeElement.value.includes('.')) {
      this.el.nativeElement.value = this.el.nativeElement.value + '.0';
    }
    const currentDesimalValue = this.el.nativeElement.value ? this.el.nativeElement.value.split('.')[1] : null;
    if (currentDesimalValue && currentDesimalValue.length < this.noOfdecimalsPoint) {
      for (let i = 0; i < (this.noOfdecimalsPoint - currentDesimalValue.length); i++) {
        this.el.nativeElement.value = this.el.nativeElement.value + '0';
      }
    }
  }


}


