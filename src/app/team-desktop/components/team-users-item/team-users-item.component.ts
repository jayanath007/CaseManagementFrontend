import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import {TeamMember } from '../../../team-core/models/interface';
@Component({
  selector: 'dps-team-users-item',
  templateUrl: './team-users-item.component.html',
  styleUrls: ['./team-users-item.component.scss']
})
export class TeamUsersItemComponent implements OnInit , OnChanges {
  @Input() user: TeamMember;
  @Input() selectedTeamUser: TeamMember;
  showProfileImg: boolean;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.showProfileImg = false;
    }
  }

}
