import { MovementType } from './../../../team-core/models/enum';
import { AddMovementDetailsViewModel, DayUserMovements, NextAvailableMovementType } from '../../../user-movement-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


import { DatePipe } from '@angular/common';
import { dpsNewDate } from '../../../utils/javascriptDate';
import { MatDialog } from '@angular/material';
import { ConfirmDialogData, InforDialogComponent } from '../../../shared';
import { FormControl, Validators } from '@angular/forms';
import { HalfDayType } from '../../../user-movement-core/models/enum';

@Component({
  selector: 'dps-add-movement-popup-container',
  templateUrl: './add-movement-popup-container.component.html',
  styleUrls: ['./add-movement-popup-container.component.scss']
})
export class AddMovementPopupContainerComponent implements OnInit {
  movement = new FormControl('', [Validators.required]);
  @Input() nextAvailableTypes: NextAvailableMovementType[];
  @Input() data: any;
  @Input() timeList: string[];
  @Input() Movementlocation: any;
  @Input() locationList: any[];
  @Input() timeOffset: number;
  @Input() dayMovements: DayUserMovements[];


  @Output() submitUserMovemetDetails = new EventEmitter<AddMovementDetailsViewModel>();
  @Output() close = new EventEmitter<any>();

  get dayMovementperiod() {
    return this.nextAvailableTypes && this.nextAvailableTypes.length > 0 && this.userMovementPeriodId
      ? this.nextAvailableTypes.filter(val => val.parentId === this.userMovementPeriodId) : [];
  }

  get nextMovementTypes() {
    return this.nextAvailableTypes && this.nextAvailableTypes.length > 0
      ? this.nextAvailableTypes.filter(val => val.parentId === 0) : [];
  }

  time = '';
  period = '';
  clockdisabkle = false;

  constructor(private datePipe: DatePipe, public dialog: MatDialog) { }
  userMovementPeriodId: number;
  // addMovementDetails: AddMovementDetailsViewModel;
  userMovementTypeId: number;
  from: string;
  to: string;
  notes: string;
  userId: string;
  userDes: string;
  isAlldayTypeMovement: boolean;
  location: string;

  hideFromDate: boolean;

  date = new Date();

  ngOnInit() {
    this.time = this.datePipe.transform(dpsNewDate(this.timeOffset), 'h:mm');
    this.period = this.datePipe.transform(dpsNewDate(this.timeOffset), 'a');
    this.from = this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd');
    this.isAlldayTypeMovement = false;

    if (this.dayMovements) {
      const hours = new Date(this.dayMovements[this.dayMovements.length - 1].dateTime).getHours();
      this.period = hours >= 12 ? 'PM' : 'AM';
      this.clockdisabkle = this.period === 'PM' ? true : false;
    }
    const currentDateTime = dpsNewDate(this.timeOffset);
    // currentDateTime.setMinutes(currentDateTime.getMinutes() + this.timeOffset);
    if (this.dayMovements &&
      new Date(currentDateTime) < new Date(this.dayMovements[this.dayMovements.length - 1].dateTime)) {
      this.time = this.datePipe.transform(this.dayMovements[this.dayMovements.length - 1].dateTime, 'h:mm');
    }

  }
  onChangeMovementType(event) {
    this.isAlldayTypeMovement = event.isAllDayMovementType;
    this.userMovementTypeId = event.movementTypeId;
    this.userMovementPeriodId = event.movementTypeId;

  }
  onChangeMovementPeriod(event) {
    if (event !== '-2') {

      this.userMovementTypeId = event.movementTypeId;
      this.hideFromDate = true;
    } else {

      this.hideFromDate = false;
    }


  }
  onChangeDate(event) {
    const date = this.datePipe.transform(event.value, 'yyyy-MM-ddTHH:mm:ss');

    this.from = date;
    this.to = null;
  }
  onChangeToDate(event) {
    const date = this.datePipe.transform(event.value, 'yyyy-MM-ddTHH:mm:ss');

    if (this.from <= date) {
      this.to = date;

    } else {
      const headingText = 'Info';
      const dialogData: ConfirmDialogData = {
        content: {
          title: headingText,
          message: 'To Date should be greater than From Date.',
          acceptLabel: 'OK',
        },
        data: { messageType: 'alert' }
      };
      this.dialog.open(InforDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });

    }

  }
  onChaneNotes(value) {
    if (value.length > 250) {

      const headingText = 'Info';
      const dialogData: ConfirmDialogData = {
        content: {
          title: headingText,
          message: 'Note length must not exceed 260 characters.',
          acceptLabel: 'OK',
        },
        data: { messageType: 'alert' }
      };
      this.dialog.open(InforDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });

    } else {
      this.notes = value;
    }


  }

  onChangeMovementLocation(value) {
    this.location = value;
  }

  onSubmitData() {
    const addMovementDetails: AddMovementDetailsViewModel = {
      fromDate: this.isAlldayTypeMovement !== true ? this.getDateTime() : this.from,
      toDate: this.to ? this.to : null,
      notes: this.notes,
      userId: this.data.user,
      userMovementTypeId: this.userMovementTypeId,
      location: this.location
    };

    this.submitUserMovemetDetails.emit(addMovementDetails);
  }

  onClose() {

    this.close.emit();
  }



  onChangeTime(newTime: string) {
    newTime = newTime.startsWith(':') ? '00' + newTime : newTime.endsWith(':') ? newTime + '00' : newTime;
    const re = new RegExp('^(2[0-1]|[01]?[0-9]):([0-5]|[0-5]{1}[0-9])$');
    if (re.test(newTime)) {
      this.time = newTime;
    }
  }

  onTimePeriodChange(newPeriod) {
    this.period = newPeriod;
  }

  getDateTime() {
    const date = this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd');
    let hours = parseInt(this.time.split(':')[0], 0);
    const minute = parseInt(this.time.split(':')[1], 0);
    if (this.period === 'PM' && hours !== 12) {
      hours = hours + 12;
    } else if (this.period === 'AM' && hours === 12) {
      hours = 0;
    }
    return date + 'T' + (hours > 9 ? '' : '0') + hours + ':' + (minute > 9 ? '' : '0') + minute;

    //  this.updateEventData.emit({ kind: UpdateDetailsKind.Start, info: startDetails });
    // if (this.event.recurrence) {
    //   this.updateEventData.emit({ kind: UpdateDetailsKind.From, info: startDetails });
    // }
  }

  getTimeList() {

    return this.timeList.filter(val => {
      if (this.dayMovements && this.dayMovements.length > 0) {
        if (this.dayMovements.find(a => a.isHalfDayMovementType === true && a.userMovementType === HalfDayType.evining)) {
          this.clockdisabkle = false;
          return true;
        } else {



          const hours = new Date(this.dayMovements[this.dayMovements.length - 1].dateTime).getHours();
          if (hours < 12 && this.period === 'PM') {
            return true;
          } else {
            const lastEventTime = Number(this.datePipe
              .transform(this.dayMovements[this.dayMovements.length - 1].dateTime, 'h:mm').replace(':', '.'));
            const value = Number(val.replace(':', '.'));
            if (lastEventTime >= 12 && value >= 12) {
              return lastEventTime <= value;
            } else if (lastEventTime >= 12) {
              return true;
            } else if (value >= 12) {
              return false;
            }
            return lastEventTime <= value;
          }

        }

      }
      return true;
    });
    // if (this.timeList && this.timeList.length > 0 && this.data) {
    //   if (this.data.dayMovements && this.data.dayMovements.length > 0) {
    //     const startTime = this.datePipe.transform(this.data.dayMovements[this.data.dayMovements.length - 1].dateTime, 'h:mm', 'UTC');

    //  const period = this.datePipe.transform(dpsNewDate(this.timeOffset), 'a');


    // if (this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')
    // < new Date(this.data.dayMovements[this.data.dayMovements.length - 1].dateTime) ) {

    //   this.time = startTime;

    // }
    // let list;
    // if (ampm === 'PM') {
    //   list = this.filterDates(startTime, '11:59');
    // } else {
    //   list = this.timeList;
    // }
    //     return this.timeList;   // this.timeList.filter(a => a > startTime && a < '11:59');
    //   } else {

    //     return this.timeList;


    //   }
    // }
  }

  // parseDate(dStr) {
  //   const now = new Date();
  //   now.setHours(dStr.split(':')[0]);
  //   now.setMinutes(dStr.split(':')[1]);
  //   now.setSeconds(0);
  //   return now;
  // }

  // filterDates(start, end) {
  //   const startDate = this.parseDate(start);
  //   const endDate = this.parseDate(end);
  //   const parsedDates = this.timeList.map(this.parseDate);
  //   return parsedDates.filter(function (dt) {
  //     return (dt > startDate && dt < endDate);
  //   }).map(function (dt) {
  //     return dt.getHours() + ':' + dt.getMinutes();
  //   });
  // }

  getLocation() {
    if (this.locationList && this.locationList.length > 0) {

      return this.locationList.map(a => a.branchName);
    }

  }

  // getAllDayEventCategory() {
  //   if (this.nextAvailableTypes && this.nextAvailableTypes.length > 0 && this.userMovementTypeId) {

  //     return this.nextAvailableTypes.filter(val => val.parentId === this.userMovementTypeId);

  //   }


  // }
}
