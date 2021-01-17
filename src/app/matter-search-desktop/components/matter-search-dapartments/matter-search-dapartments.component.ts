import { Department } from '../../../matter-search-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'dps-matter-search-dapartments',
  templateUrl: './matter-search-dapartments.component.html',
  styleUrls: ['./matter-search-dapartments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSearchDapartmentsComponent implements OnInit {
  @Input() departmentList: Department[];
  @Input() selectedDepartment;
  @Output() updateSelectedDepartment = new EventEmitter<Department>();

  constructor() { }

  ngOnInit() {
  }

  get selectDepartment() {
    if (this.departmentList) {
      return this.departmentList.find((departmen) => departmen.selected);
    }
    return this.departmentList;
  }

  OnDepartmentChanged(event) {
    if (event.value) {
      this.updateSelectedDepartment.emit(event.value.groupId);
    } else {
      this.updateSelectedDepartment.emit(null);
    }
  }

}
