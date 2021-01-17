import { MatRadioGroup } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  Department, SelectedInfo, GridFilterUpdate, Summery
} from '../../../work-done-core/models/interfce';

@Component({
  selector: 'dps-work-done-header',
  templateUrl: './work-done-header.component.html',
  styleUrls: ['./work-done-header.component.scss']
})
export class WorkDoneHeaderComponent implements OnInit {
  @Input() homeCurrancy;

  @Input() departmentList: Department[];
  @Input() typeList: any[];
  @Input() selectedInfo: SelectedInfo;
  @Input() userPermision: any;
  @Input() summery: Summery;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  // @Output() viewChange = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo.emit(value);
  }
}
