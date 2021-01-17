import { GridFilterKind } from './../../../post-office-core/models/enumeration';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  Group, SelectedInfo, GridFilterUpdate, Department
} from '../../../post-office-core/models/interfce';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { TeamMember } from './../../../core/lib/team-members';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-post-office-header',
  templateUrl: './post-office-header.component.html',
  styleUrls: ['./post-office-header.component.scss']
})
export class PostOfficeHeaderComponent implements OnInit, OnChanges {

  @Input() userList: any[];
  @Input() loookForList: any[];
  @Input() groupList: Group[];
  @Input() selectedInfo: SelectedInfo;
  @Input() departments: Department[];
  @Input() selectedTeamMember: TeamMember;
  @Input() timeOffset: number;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();

  fromDate;
  toDate;
  inputCtrl = new FormControl();

  constructor() { }

  ngOnInit() {
    this.fromDate = dpsNewDate(this.timeOffset);
    this.toDate = dpsNewDate(this.timeOffset);
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.onSearchTextChanged(value);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTeamMember && !changes.selectedTeamMember.isFirstChange()) {
      if (this.selectedTeamMember && this.selectedTeamMember.user) {
        const user = this.selectedTeamMember.user;
        const newValue = { kind: GridFilterKind.user, value: user };
        this.updateSelectedInfo.emit(newValue);
      }
    }
  }



  get selectedDepartment() {
    if (this.departments && this.selectedInfo) {
      return this.departments.find((d) => d.groupId === this.selectedInfo.departmentId);
    }
    return null;
  }




  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo.emit(value);
  }

  onChangeDepartment(event: { value: Department }) {
    this.updateSelectedInfo.emit({ kind: GridFilterKind.department, value: event.value.groupId });
  }






  get selectedUser() {
    if (this.userList && this.userList.length > 0 && this.selectedInfo) {
      return this.userList.find((user) => user.groupId === this.selectedInfo.userId);
    }
    return this.userList;
  }

  onSearchTextChanged(value) {
    const newValue = { kind: GridFilterKind.searchText, value: value ? value : null };
    this.updateSelectedInfo.emit(newValue);
  }

  emitUserChange(value) {
    const newValue = { kind: GridFilterKind.user, value: value, fromDate: this.fromDate, toDate: this.toDate };
    this.updateSelectedInfo.emit(newValue);
  }


  onChangeUser(event) {
    if (event.value) {
      this.fromDate = dpsNewDate(this.timeOffset);
      this.toDate = dpsNewDate(this.timeOffset);
      this.emitUserChange(event.value.groupId);
    }
  }

  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.onSearchTextChanged(event.currentTarget.value);
    }
  }


  // get selectedGroup() {
  //   if (this.groupList && this.selectedInfo) {
  //     return this.groupList.find((group) => group.groupId === this.selectedInfo.groupId);
  //   }
  //   return null;
  // }

  // get selectedloookFor() {
  //   if (this.loookForList && this.selectedInfo) {
  //     return this.loookForList.find((loookFor) => loookFor.groupId === this.selectedInfo.loookForId);
  //   }
  //   return null;
  // }

  // onChangeGroup(event) {
  //   let newValue = { kind: GridFilterKind.group, value: null };
  //   if (event.value) {
  //     newValue = { kind: GridFilterKind.group, value: event.value.groupId };
  //   }
  //   this.updateSelectedInfo.emit(newValue);
  // }

  // onChangeLoookFor(event) {
  //   let newValue = { kind: GridFilterKind.loookFor, value: null };
  //   if (event.value) {
  //     newValue = { kind: GridFilterKind.loookFor, value: event.value.groupId };
  //   }
  //   this.updateSelectedInfo.emit(newValue);
  // }



}
