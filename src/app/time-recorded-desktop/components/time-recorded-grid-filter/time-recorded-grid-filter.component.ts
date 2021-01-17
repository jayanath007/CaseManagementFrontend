import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Department, Type, SelectedInfo, GridFilterUpdate } from '../../../time-recorded-core/models/interfce';
import { gridFilterKind } from '../../../time-recorded-core/models/enumeration';


@Component({
  selector: 'dps-time-recorded-grid-filter',
  templateUrl: './time-recorded-grid-filter.component.html',
  styleUrls: ['./time-recorded-grid-filter.component.scss']
})
export class TimeRecordedGridFilterComponent implements OnInit {

  constructor() { }

  @Input() departmentList: Department[];
  @Input() typeList: Type[];
  @Input() selectedInfo: SelectedInfo;
  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();

  get selectedType() {
    if (this.typeList && this.selectedInfo) {
      return this.typeList.find((type) => type.groupId === this.selectedInfo.typeId);
    }
    return this.typeList;
  }

  get selectedDepartment() {
    if (this.departmentList && this.selectedInfo) {
      return this.departmentList.find((department) => department.groupId === this.selectedInfo.departmentId);
    }
    return this.departmentList;
  }

  onChangeType(event) {
    let newValue = null;
    if (event.value) {
      newValue = { kind: gridFilterKind.type, value: event.value.groupId };
    }
    this.updateSelectedInfo.emit(newValue);
  }

  onChangeDepartment(event) {
    let newValue = { kind: gridFilterKind.department, value: null };
    if (event.value) {
      newValue = { kind: gridFilterKind.department, value: event.value.groupId };
    }
    this.updateSelectedInfo.emit(newValue);
  }

  removeSelectedUser() {
    const newValue = { kind: gridFilterKind.department, value: this.selectedInfo.departmentId };
    this.updateSelectedInfo.emit(newValue);
  }

  ngOnInit() {
  }

}
