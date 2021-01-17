import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  Type, Department, SelectedInfo, UserPermission,
  GridFilterUpdate, Summery
} from '../../../time-recorded-core/models/interfce';

@Component({
  selector: 'dps-time-recorded-header',
  templateUrl: './time-recorded-header.component.html',
  styleUrls: ['./time-recorded-header.component.scss']
})
export class TimeRecordedHeaderComponent {
  @Input() homeCurrancy;

  @Input() departmentList: Department[];
  @Input() typeList: Type[];
  @Input() selectedInfo: SelectedInfo;
  @Input() userPermision: UserPermission;
  @Input() summery: Summery;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() viewChange = new EventEmitter();


  constructor() { }

  // get hoursMinutes(): string {
  //   if (this.summery && this.summery.units) {
  //     const totalMinutes = this.summery.units * 6;
  //     const hoursMinutes = (totalMinutes / 60).toFixed(2);
  //     return hoursMinutes.replace('.', ':');
  //   }
  //   return '00:00';
  // }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo.emit(value);
  }


}
