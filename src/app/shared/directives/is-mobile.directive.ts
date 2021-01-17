import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { isMobile } from '../../utils/is-mobile';

@Directive({
  selector: '[dpsIsMobile]'
})
export class IsMobileDirective implements OnInit {
  @Input() dpsIsMobile: string;
  constructor(public renderer: Renderer2, public hostElement: ElementRef) {
  }
  ngOnInit() {
    if (isMobile().any()) {
      this.renderer.addClass(this.hostElement.nativeElement, this.dpsIsMobile || 'dps-is-mobile');
    }
  }
}
