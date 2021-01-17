


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridRowAction, GridRowType, FilterViewModel } from '../../../global-document-search-core/models/interface';

@Component({
  selector: 'dps-global-document-views',
  templateUrl: './global-document-views.component.html',
  styleUrls: ['./global-document-views.component.scss']
})
export class GlobalDocumentViewsComponent implements OnInit {


  @Input() filterViewModel: FilterViewModel;
  @Output() searchDoc = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;

  constructor() { }

  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';

  }
  onSearchDoc(event) {

    this.searchDoc.emit(event);

  }
  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= this.fontSize !== 1 ? 1 : 2;
    }
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += this.fontSize !== -1 ? 1 : 2;
    }
  }

  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
  }


  onRefresh() {
    this.refresh.emit();

  }
}
