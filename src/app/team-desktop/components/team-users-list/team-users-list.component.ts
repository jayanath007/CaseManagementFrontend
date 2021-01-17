import { Department, TeamMember } from '../../../team-core/models/interface';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'dps-team-users-list',
  templateUrl: './team-users-list.component.html',
  styleUrls: ['./team-users-list.component.scss']
})
export class TeamUsersListComponent implements OnInit {

  @Input() searchKey: string;
  @Input() inputCtrl: any;
  @Input() departmentList: Department[];
  @Input() teamUsersLoading: boolean;
  @Input() teamUsersList: TeamMember[];
  @Input() selectedTeamUser: TeamMember;

  @Output() searchTextcahange = new EventEmitter<any>();
  @Output() changeDepartment = new EventEmitter<any>();
  @Output() teamUserChange = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
    // this.inputCtrl.valueChanges.pipe(
    //   debounceTime(2000))
    //   .subscribe((value: string) => this.onSearchTextChanged(value));
  }

  onSearchTextChanged(value) {
    this.searchTextcahange.emit(value);
  }

  onChangeDepartment(event) {
    this.changeDepartment.emit(event.value);
  }

  onTeamUserChange(user) {
    this.teamUserChange.emit(user);
  }

}
