import { AllDayEventByYear } from './../../../team-core/models/interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-team-user-grid-row',
  templateUrl: './team-user-grid-row.component.html',
  styleUrls: ['./team-user-grid-row.component.scss']
})
export class TeamUserGridRowComponent implements OnInit {

@Input() eventYearSummery: AllDayEventByYear;


  constructor() { }

  ngOnInit() {
   // this.aa = this.aa + this.maxCount;
 // this.aa =  this.item.maxCount - this.item.sumOfMovementCount;
  }

  // eventCountWithMonth: EventCountWithMonth[];
  // maxCount: number;
  // sumOfMovementCount: number;
  // userMovementTypeID: number;

  // countSummury(taken,allowed){



  // }

}
