import { TeamMember } from './../../../core/lib/team-members';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'dps-team-user-profile',
  templateUrl: './team-user-profile.component.html',
  styleUrls: ['./team-user-profile.component.scss']
})
export class TeamUserProfileComponent implements OnInit {
@Input() loginUser: TeamMember;
showProfileImg: boolean;

  constructor() { }

  ngOnInit() {
  }

}
