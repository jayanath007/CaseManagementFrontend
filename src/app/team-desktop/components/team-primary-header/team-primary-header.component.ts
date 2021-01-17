
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserViewType } from '../../../team-core/models/enum';
import { SelectedYearAndMonth } from '../../../team-core/models/interface';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

const moment = _moment;
@Component({
  selector: 'dps-team-primary-header',
  templateUrl: './team-primary-header.component.html',
  styleUrls: ['./team-primary-header.component.scss']
})
export class TeamPrimaryHeaderComponent implements OnInit {
  date = new FormControl(moment());
  events: string[] = [];

  @Input() a: boolean;
  @Input() teamUsersLoading: boolean;
  @Input() selectYearAndMonth: Moment;
  @Input() selectedViewType: UserViewType;
  @Input() selectedTeamUser: any;
  @Output() addMovement = new EventEmitter<any>();
  @Output() changeViewType = new EventEmitter<any>();
  @Output() selectYearAndMonthClick = new EventEmitter<{ selectdate: any, kind: UserViewType }>();


  constructor() { }
  viewType = UserViewType;

  ngOnInit() {
  }





  onAddMovement() {
    this.addMovement.emit();

  }

  onChangeViewType(viewValue) {
    this.changeViewType.emit(viewValue);

  }

  onDateChange(event) {

    const s = event;
  }



  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  selectedDate() {

  }
}
