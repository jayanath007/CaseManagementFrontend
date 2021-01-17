import { MatMenuTrigger } from '@angular/material';
import { Component, OnInit, Input, OnChanges, ViewChildren, QueryList } from '@angular/core';
import { DayUserMovements, CurrentDayUserMovement } from './../../../user-movement-core/models/interfaces';
import { ScheduleItem } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-user-movement-time-line',
  templateUrl: './user-movement-time-line.component.html',
  styleUrls: ['./user-movement-time-line.component.scss']
})
export class UserMovementTimeLineComponent implements OnInit, OnChanges {

  @Input() userMovements: CurrentDayUserMovement;
  @Input() pastMovements: DayUserMovements[];
  @Input() currentMovements: DayUserMovements[];
  @Input() futureMovements: DayUserMovements[];
  @Input() morningHalfday: DayUserMovements[];
  @Input() eviningHalfday: DayUserMovements[];
  @Input() pastEvents: ScheduleItem[];
  @Input() futureEvents: ScheduleItem[];
  @Input() currentEvents: ScheduleItem[];

  // @Input() calendarEvents: ScheduleItem[];

  @ViewChildren(MatMenuTrigger) contextMenus: QueryList<MatMenuTrigger>;

  wholeMin = 480;
  oneMinuteWidth = 0;
  allItemsWidth = 0;
  barWidth = 0;

  constructor() { }

  ngOnInit() {


    //  setInterval(() => {

    //   this.pastMovement = getPastMovements();
    //   this.currentMovement = this.getCurrentMovements();
    //   this.futureMovement = this.getfutureMovement();


    // }, 1000);
  }



  ngOnChanges(changes: any) {
    if (changes.userMovements) {
      // this.pastMovement = this.getPastMovements();
      // this.currentMovement = this.getCurrentMovement();
      // this.futureMovement = this.getfutureMovement();
      //   this.barWidth = document.getElementById('dpsMpvementLineContainer').clientWidth;
      //   this.oneMinuteWidth = 1.5;         //  this.barWidth / this.wholeMin;
      //   if (this.userMovements) {
      //     this.view = [];
      //     this.userMovements.forEach((r, i) => this.getMovementWith(r, i));
    }

  }

  // if (changes.calendarEvents) {
  //   if (this.calendarEvents) {
  //     this.eventview = [];
  //     this.calendarEvents.forEach((r, i) => this.getEventWith(r, i));
  //   }


  // }


  // }
  // getEventWith(event: DisplayCalandarEvents, index: number) {

  //   // const minWidth = 1.5;
  //   // const timediff = this.moment.utc(this.moment(new Date(event.end.dateTime), 'DD/MM/YYYY HH:mm:ss')
  //   //   .diff(this.moment(new Date(event.start.dateTime), 'DD/MM/YYYY HH:mm:ss'))).unix() / 60;
  //   const eventWidth = 100;
  //   // }

  //   this.eventview = this.eventview.concat({
  //     ...event,
  //     width: `${eventWidth}px`,

  //   });
  // }

  // getMovementWith(movment: DayUserMovements, index: number) {

  //     const currentDate = new Date(state.currentDate);
  //       currentDate.setMinutes(currentDate.getMinutes() + timeOffset);
  //       const start = new Date(datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));
  //       currentDate.setDate(currentDate.getDate() + 1);
  //       const end = new Date(datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));




  //   // const startTime = movment.dateTime.getMinutes();
  //   let timeDeference = 150; // Minute
  //   const listLength = this.userMovements ? this.userMovements.length : 0;
  //   const start = movment.dateTime;
  //   let end = null;
  //   if (listLength !== index + 1) {
  //     end = this.userMovements[index + 1].dateTime;
  //     timeDeference = this.moment.utc(this.moment(new Date(end), 'DD/MM/YYYY HH:mm:ss')
  //       .diff(this.moment(new Date(start), 'DD/MM/YYYY HH:mm:ss'))).unix() / 60;
  //   } else {
  //     timeDeference = 150;     // this.barWidth - this.allItemsWidth;
  //   }
  //   // minimum diff
  //   if (timeDeference <= 30) {
  //     timeDeference = 150;
  //   }
  //   let itemWidth = timeDeference * this.oneMinuteWidth;
  //   this.allItemsWidth = this.allItemsWidth + itemWidth;

  //   if (movment.isAllDayMovementType && (this.view && this.view.length > 1)) {
  //     itemWidth = this.barWidth - this.allItemsWidth;
  //   }

  //   this.view = this.view.concat({
  //     ...movment,
  //     width: `${itemWidth}px`,
  //     endTime: end,
  //     duration: timeDeference
  //   });
  // }










  // setCurrentMovement() {
  //   const currentMovement: DayUserMovements[] = [];
  //   const nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  //   const currentDateTime = new Date(nowDate);
  //   currentDateTime.setMinutes(currentDateTime.getMinutes() + this.timeOffset);

  //   if (this.userMovements && this.userMovements.userMovements && this.userMovements.userMovements.length > 0) {
  //     const movement = this.userMovements.userMovements;

  //     movement.map((a, i) => {
  //       const nextItem = movement[i + 1];

  //       if (!nextItem || new Date(nextItem ? nextItem.dateTime : currentDateTime) > currentDateTime
  //         && currentDateTime > new Date(a.dateTime)) {
  //         currentMovement.push({
  //           dateTime: a.dateTime,
  //           notes: a.notes,
  //           userDes: a.userDes,
  //           userId: a.userId,
  //           userMovementTypeId: a.userMovementTypeId,
  //           location: a.location,
  //           isAllDayMovementType: a.isAllDayMovementType,
  //           width: '150px',   // getEventWidth(start, new Date(daymovement.userMovements[0].dateTime))
  //           endTime: new Date(nextItem ? nextItem.dateTime : a.dateTime).toDpsString(),
  //           duration: 0,
  //         });

  //       }
  //     });
  //     return currentMovement;

  //   }


  // }

  // movementStyle(movment) {
  //   if (movment.isAllDayMovementType && (this.userMovements && this.userMovements.length === 1)) {
  //     return { 'display': 'block' };

  //   } else {
  //     return { 'width': movment.width, 'max-width': movment.width };
  //   }

  // }

  onEventClick(span: HTMLSpanElement, mEvent: MouseEvent, event: ScheduleItem, index: number) {
    if (event.status) {
      span.style.width = '0px';
      span.style.height = '0px';
      span.style.position = 'absolute';
      span.style.left = mEvent.offsetX + 'px';
      span.style.top = '30px';
      setTimeout(() => {
        this.contextMenus.toArray()[index].openMenu();
      }, 10);
    }
  }


  // get nonAllocatedTimeWidth(): string {
  //   return `${this.barWidth - this.allItemsWidth}px`;
  // }
  // this.moment.utc(this.moment(new Date(end), 'DD/MM/YYYY HH:mm:ss')
  //   .diff(this.moment(new Date(), 'DD/MM/YYYY HH:mm:ss'))).unix() / 60

  //   dateTime: "2019-09-27T09:32:20.31"
  // notes: "sign in"
  // userDes: "SignIn for work"
  // userId: "SUP"
  // userMovementTypeId: 1

}
