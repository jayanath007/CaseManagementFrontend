import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TeamMemberRequest, TeamMember } from '../../core/lib/team-members';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ParaType } from '../../team-member-core/models/enums';
import { Subject } from 'rxjs';



@Component({
  selector: 'dps-team-member-min-list',
  templateUrl: './team-member-min-list.component.html',
  styleUrls: ['./team-member-min-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMemberMinListComponent implements OnInit {
  results: Object;

  @Input() teamMemberList;
  @Input() teamMemberListLoading;
  @Output() changeSelectedTeamMember = new EventEmitter<TeamMember>();

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  onTeamMemberChange(member: TeamMember) {
    this.changeSelectedTeamMember.emit(member);
  }

}
