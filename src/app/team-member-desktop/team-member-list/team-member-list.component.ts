
import {debounceTime} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TeamMemberRequest, TeamMember } from '../../core/lib/team-members';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ParaType } from '../../team-member-core/models/enums';
import { Subject } from 'rxjs';



@Component({
  selector: 'dps-team-member-list',
  templateUrl: './team-member-list.component.html',
  styleUrls: ['./team-member-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMemberListComponent implements OnInit {
  results: Object;

  @Input() teamMemberList;
  @Input() teamMemberListLoading;
  @Input() searchKey;
  @Input() selected: TeamMember;
  @Output() changeSearchKey = new EventEmitter<string>();
  @Output() changeSelectedTeamMember = new EventEmitter<TeamMember>();
  inputCtrl = new FormControl();

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(2000))
      .subscribe((value: string) => this.onSearchTextChanged(value));
  }

  onSearchTextChanged(searchText: string) {
    this.changeSearchKey.emit(searchText);
  }

  onTeamMemberChange(member: TeamMember) {
    this.changeSelectedTeamMember.emit(member);
  }

  onKeyDown(event, member: TeamMember) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.changeSelectedTeamMember.emit(member);
    }
  }

}
