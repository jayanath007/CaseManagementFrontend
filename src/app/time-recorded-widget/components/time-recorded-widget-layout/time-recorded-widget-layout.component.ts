import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../../case-task-core/models/interface';
import { BtnOption } from '../../models/enumeration';

@Component({
  selector: 'dps-time-recorded-widget-layout',
  templateUrl: './time-recorded-widget-layout.component.html',
  styleUrls: ['./time-recorded-widget-layout.component.scss']
})
export class TimeRecordedWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: GridData[];
  @Output() clickOptionBtn = new EventEmitter<any>();
  @Output() viewTimeRecorded = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() refreshData = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  get emptyList() {
    if (this.data && this.data.length < 4) {
      return Array(4 - this.data.length).fill('').map((x, i) => i);
    }
    return [];
  }

  onClickOptionBtn(value) {
    this.clickOptionBtn.emit(value);
  }

  goToTimeRecorded() {
    this.viewTimeRecorded.emit();
  }

  onRemove() {
    this.removeWidget.emit();
  }
  onOpenItem(event) {

  }

  onRefreshData() {
    this.refreshData.emit();
  }

}
