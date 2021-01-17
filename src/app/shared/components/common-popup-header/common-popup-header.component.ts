import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-common-popup-header',
  templateUrl: './common-popup-header.component.html',
  styleUrls: ['./common-popup-header.component.scss']
})
export class CommonPopupHeaderComponent implements OnInit {

  @Input() icon: string;
  @Input() title: string;
  @Input() buttons: string[] | string;
  @Input() loading: boolean;

  @Input() height: string;
  @Input() iconColor: string;
  @Input() buttonColor: string;
  @Input() titleColor: string;
  @Input() toolbarColor: string;

  @Output() buttonClick = new EventEmitter<string>();

  constructor() { }

  get buttonList(): string[] {
    if (Array.isArray(this.buttons)) {
      return this.buttons.filter(val => typeof val === 'string');
    } else if (typeof this.buttons === 'string') {
      return [this.buttons];
    }
    return [];
  }

  ngOnInit() {
  }
  onClick(button) {
    this.buttonClick.emit(button);
  }
}
