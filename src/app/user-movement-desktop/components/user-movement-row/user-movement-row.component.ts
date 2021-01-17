import { Component, OnInit, Input } from '@angular/core';
import { TeamMember, CurrentDayUserMovement } from '../../../team-core/models/interface';
import { DayUserMovements } from '../../../user-movement-core/models/interfaces';
import { ScheduleItem } from '../../../core/lib/microsoft-graph';
import { HalfDayType } from '../../../user-movement-core/models/enum';


@Component({
  selector: 'dps-user-movement-row',
  templateUrl: './user-movement-row.component.html',
  styleUrls: ['./user-movement-row.component.scss']
})
export class UserMovementRowComponent implements OnInit {

  @Input() user: TeamMember;
  @Input() nowDateTime: Date;
  @Input() selectedUserInMovement: TeamMember;
  @Input() usermovements: DayUserMovements[];
  @Input() schedulItems: ScheduleItem[];



  showProfileImg: boolean;

  get pastEvents() {
    return this.schedulItems && this.nowDateTime ? this.schedulItems.filter(m => new Date(m.end.dateTime) < this.nowDateTime) : [];
  }
  get currentEvents() {
    return this.schedulItems && this.nowDateTime ? this.schedulItems.filter(m =>
      new Date(m.start.dateTime) <= this.nowDateTime && new Date(m.end.dateTime) >= this.nowDateTime) : [];
  }
  get futureEvents() {
    return this.schedulItems && this.nowDateTime ? this.schedulItems.filter(m => new Date(m.start.dateTime) > this.nowDateTime) : [];
  }
  get pastMovements() {
    return this.usermovements && this.nowDateTime ? this.usermovements.filter(m => {

      return new Date(m.endTime) < this.nowDateTime && !m.isHalfDayMovementType;
    }) : [];
  }
  get currentMovements() {
    return this.usermovements && this.nowDateTime ? this.usermovements.filter(m =>
      new Date(m.dateTime) <= this.nowDateTime && new Date(m.endTime) >= this.nowDateTime && !m.isHalfDayMovementType) : [];
  }
  get futureMovements() {
    return this.usermovements && this.nowDateTime ? this.usermovements.filter(m => new Date(m.dateTime) > this.nowDateTime
      && !m.isHalfDayMovementType) : [];
  }
  get halfdayMorning() {
    return this.usermovements && this.nowDateTime ? this.usermovements.filter(m => m.isHalfDayMovementType
      && m.userMovementType === HalfDayType.morning) : [];
  }

  get halfdayEvining() {
    return this.usermovements && this.nowDateTime ? this.usermovements.filter(m => m.isHalfDayMovementType
      && m.userMovementType === HalfDayType.evining) : [];
  }



  constructor() { }

  ngOnInit() {
  }
}
