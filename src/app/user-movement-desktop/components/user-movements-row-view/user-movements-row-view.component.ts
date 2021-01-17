import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { TeamMember } from '../../../team-core/models/interface';
import { CurrentDayUserMovement, DayUserMovements } from '../../../user-movement-core/models/interfaces';
import { interval, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-user-movements-row-view',
  templateUrl: './user-movements-row-view.component.html',
  styleUrls: ['./user-movements-row-view.component.scss']
})
export class UserMovementsRowViewComponent implements OnInit {
  @Input() loading: boolean;
  @Input() userList: TeamMember[];
  @Input() selectedUserInMovement: TeamMember;
  @Input() timeOffset: number;
  @Input() userDayMovement: CurrentDayUserMovement;

  @Output() selectUserInMovements = new EventEmitter<any>();

  @HostListener('scroll', ['$event'])

  clock$: Observable<Date> = of(new Date());

  constructor() { }

  ngOnInit() {
    this.clock$ = interval(1000).pipe(map(i => {
      return dpsNewDate(this.timeOffset);
    }));
  }

  scrollHandler(event: Event) {
    const userDiv = document.getElementById('dps-user-row-view');
    const movementsDiv = document.getElementById('dps-movements-row-view');
    userDiv.scrollTop = movementsDiv.scrollTop;
  }

  onSelectUserInMovements(user) {
    this.selectUserInMovements.emit(user);
  }

  trackByFn(index, user) {
    return user ? user.user : '';
  }
  getLastLocation(user) {
    if (user && user.dayMovements && user.dayMovements.length > 0) {
      const currentTime = dpsNewDate(this.timeOffset);
      const movement = user.dayMovements.find(m =>
        new Date(m.dateTime) <= currentTime && new Date(m.endTime) >= currentTime
      );



      // const movement =
      //   user.dayMovements[
      //   user.dayMovements.length - 1
      //   ];
      return movement && movement.location ? movement.location : '';
    }







  }


  // setfutureMovement() {
  //   const futureMovement: DayUserMovements[] = [];
  //   const nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  //   const currentDateTime = new Date(nowDate);
  //   currentDateTime.setMinutes(currentDateTime.getMinutes() + this.timeOffset);

  //   // const currentDateTime = new Date();
  //   // currentDateTime.setMinutes(currentDateTime.getMinutes() + this.timeOffset);
  //   // currentDate.setDate(currentDate.getDate() + 1);
  //   // const end = new Date(this.datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));

  //   if (this.userDayMovement && this.userDayMovement.userMovements && this.userDayMovement.userMovements.length > 0) {
  //     const movement = this.userDayMovement.userMovements;


  //     movement.map((a, i) => {
  //       const nextItem = movement[i + 1];

  //       if (new Date(a.dateTime) > currentDateTime) {
  //         futureMovement.push({
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
  //       //  return futureMovement;
  //       //  else if (new Date(nextItem.dateTime) < currentDateTime) {
  //       //   pastMovement.push({
  //       //     dateTime: a.dateTime,
  //       //     notes: a.notes,
  //       //     userDes: a.userDes,
  //       //     userId: a.userId,
  //       //     userMovementTypeId: a.userMovementTypeId,
  //       //     location: a.location,
  //       //     isAllDayMovementType: a.isAllDayMovementType,
  //       //     width: '150px',   // getEventWidth(start, new Date(daymovement.userMovements[0].dateTime))
  //       //     endTime: new Date(nextItem ? nextItem.dateTime : a.dateTime).toDpsString(),
  //       //     duration: 0,
  //       //   });

  //       // } else if (new Date(nextItem.dateTime) > currentDateTime && currentDateTime > new Date(a.dateTime)) {

  //       //   currentMovement.push({
  //       //     dateTime: a.dateTime,
  //       //     notes: a.notes,
  //       //     userDes: a.userDes,
  //       //     userId: a.userId,
  //       //     userMovementTypeId: a.userMovementTypeId,
  //       //     location: a.location,
  //       //     isAllDayMovementType: a.isAllDayMovementType,
  //       //     width: '150px',   // getEventWidth(start, new Date(daymovement.userMovements[0].dateTime))
  //       //     endTime: new Date(nextItem ? nextItem.dateTime : a.dateTime).toDpsString(),
  //       //     duration: 0,
  //       //   });


  //       // }

  //     });
  //     return futureMovement;
  //   }
  // }

  // setPastMovement() {
  //   const pastMovement: DayUserMovements[] = [];
  //   const nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  //   const currentDateTime = new Date(nowDate);
  //   currentDateTime.setMinutes(currentDateTime.getMinutes() + this.timeOffset);
  //   // currentDate.setDate(currentDate.getDate() + 1);
  //   // const end = new Date(this.datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));

  //   if (this.userMovements && this.userMovements.userMovements && this.userMovements.userMovements.length > 0) {
  //     const movement = this.userMovements.userMovements;

  //     movement.map((a, i) => {
  //       const nextItem = movement[i + 1];

  //       if (nextItem && new Date(nextItem.dateTime) < currentDateTime) {
  //         pastMovement.push({
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
  //     return pastMovement;
  //   }

  // }







}
