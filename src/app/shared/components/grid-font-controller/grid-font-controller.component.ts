import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-grid-font-controller',
  templateUrl: './grid-font-controller.component.html',
  styleUrls: ['./grid-font-controller.component.scss']
})
export class GridFontControllerComponent {

  @Input() activeClass: string;
  @Input() showRefreshButton: boolean;
  @Input() hideFontControll: boolean;

  @Output() fontSizeMin = new EventEmitter();
  @Output() fontSizeReset = new EventEmitter();
  @Output() fontSizePlus = new EventEmitter();
  @Output() refresh = new EventEmitter();

  constructor() { }

  onFontSizeMinusClick() {
    this.fontSizeMin.emit();
  }
  onFontSizeResetClick() {
    this.fontSizeReset.emit();
  }
  onFontSizePlusClick() {
    this.fontSizePlus.emit();
  }
  onRefresh() {
    this.refresh.emit();
  }
}
