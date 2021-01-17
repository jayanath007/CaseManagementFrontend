import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LayoutBaseClass } from '../../class/layout-base-class';

@Component({
  selector: 'dps-contact-create-popup-layout',
  templateUrl: './contact-create-popup-layout.component.html',
  styleUrls: ['./contact-create-popup-layout.component.scss']
})
export class ContactCreatePopupLayoutComponent extends LayoutBaseClass implements OnInit {

  @Output() close = new EventEmitter();

  contactMode;

  ngOnInit() {
  }

  onClose(event) {
    this.close.emit();
  }

}
