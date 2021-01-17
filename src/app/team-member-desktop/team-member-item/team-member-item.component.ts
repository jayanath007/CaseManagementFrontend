import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { TeamMember } from '../../core/lib/team-members';

@Component({
  selector: 'dps-team-member-item',
  templateUrl: './team-member-item.component.html',
  styleUrls: ['./team-member-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMemberItemComponent implements OnInit, OnChanges {

  @Input() member: TeamMember;
  @Input() selected: TeamMember;

  showProfileImg: boolean;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.member) {
      this.showProfileImg = false;
    }
  }

}
