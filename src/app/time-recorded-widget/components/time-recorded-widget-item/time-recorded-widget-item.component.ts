import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../models/interfce';
import { BtnOption } from '../../models/enumeration';

@Component({
  selector: 'dps-time-recorded-widget-item',
  templateUrl: './time-recorded-widget-item.component.html',
  styleUrls: ['./time-recorded-widget-item.component.scss']
})
export class TimeRecordedWidgetItemComponent implements OnInit {

  @Input() item: GridData;
  @Output() clickOptionBtn = new EventEmitter<any>();
  btnOption = BtnOption;
  constructor() { }

  ngOnInit() {
  }

}
