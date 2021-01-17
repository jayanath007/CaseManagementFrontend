import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Department, SelectedInfo, Summery, GridFilterUpdate, UserPermission } from '../../../my-tasks-core/models/interfce';
import { gridFilterKind } from '../../../my-tasks-core/models/enumeration';

@Component({
  selector: 'dps-my-tasks-header',
  templateUrl: './my-tasks-header.component.html',
  styleUrls: ['./my-tasks-header.component.scss']
})
export class MyTasksHeaderComponent implements OnInit {

  @Input() departmentList: Department[];
  @Input() selectedInfo: SelectedInfo;
  @Input() summery: Summery;
  @Input() userPermision: UserPermission;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  constructor() { }

  ngOnInit() {

  }

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

}
