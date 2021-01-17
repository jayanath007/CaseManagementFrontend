import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Department, SelectedInfo } from '../../../work-done-core/models/interfce';
import { gridFilterKind } from '../../../work-done-core/models/enumeration';


@Component({
  selector: 'dps-work-done-grid-filter',
  templateUrl: './work-done-grid-filter.component.html',
  styleUrls: ['./work-done-grid-filter.component.scss']
})
export class WorkDoneGridFilterComponent implements OnInit {

  constructor() { }

  @Input() departmentList: Department[];
  @Input() typeList: any[];
  @Input() selectedInfo: SelectedInfo;
  @Output() updateSelectedInfo = new EventEmitter<any>();

  get selectedDepartment() {
    if (this.departmentList && this.selectedInfo) {
      return this.departmentList.find((department) => department.groupId === this.selectedInfo.departmentId);
    }
    return null;
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
