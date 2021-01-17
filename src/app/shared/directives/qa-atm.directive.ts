import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[dpsQaAtm]'
})
export class QaAtmDirective implements OnInit {
  @Input() dpsQaAtm: string;
  constructor(private _elRef: ElementRef, private _renderer: Renderer2) { }

  ngOnInit() {
    this._renderer.setAttribute(this._elRef.nativeElement, 'dps-qa-atm', this.dpsQaAtm);
  }

}
