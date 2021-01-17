import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectedInfo } from '../../../post-office-core/models/interfce';
import { FormControl } from '@angular/forms';
import { GroupMode } from '../../../post-office-core/models/enumeration';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-post-office-views',
  templateUrl: './post-office-views.component.html',
  styleUrls: ['./post-office-views.component.scss']
})
export class PostOfficeViewsComponent implements OnInit {

  constructor() { }

  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode;
  @Input() timeOffset: number;

  @Output() gridRefresh = new EventEmitter();
  @Output() gridFontSize = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<any>();
  @Output() groupChange = new EventEmitter<GroupMode>();

  inputCtrl = new FormControl();
  fromDate;
  toDate;

  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  postOfficeGroupMode = GroupMode;

  ngOnInit() {
    this.fromDate = dpsNewDate(this.timeOffset);
    this.toDate = dpsNewDate(this.timeOffset);
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';

  }


  onRefresh() {
    this.gridRefresh.emit();
  }

  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      // this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      this.fontSize -= 1;
      this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      // this.fontSize += this.fontSize !== -1 ? 1 : 2;
      this.fontSize += 1;
      this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  groupBy(value: GroupMode) {
    this.groupChange.emit(value);
  }
  onMenuChange(event) {
    this.menuChange.emit(event);
  }

}
