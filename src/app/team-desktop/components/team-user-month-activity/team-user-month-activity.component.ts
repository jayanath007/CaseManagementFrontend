import { forEach } from '@angular/router/src/utils/collection';
import { MonthActivityResponce, SelectedYearAndMonth, DayActivity } from './../../../team-core/models/interface';
import {
  Component, OnInit, ElementRef, Renderer2, Input, SimpleChanges, OnChanges,
  ChangeDetectorRef, ViewChild, Output, EventEmitter,
} from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker/typings/calendar-body';
import { MatCalendar } from '@angular/material';
import { Moment } from 'moment';

@Component({
  selector: 'dps-team-user-month-activity',
  templateUrl: './team-user-month-activity.component.html',
  styleUrls: ['./team-user-month-activity.component.scss'],
})
export class TeamUserMonthActivityComponent implements OnInit, OnChanges {

  @Input() monthActivityList: MonthActivityResponce[];
  @Input() selectYearAndMonth: Moment;
  @Input() activityListByDay: DayActivity[];

  @Output() selectedDay = new EventEmitter<any>();
  dateclass: any;
  selectedDate: Moment;
  customHeader = CalendarCustomHeaderComponent;
  @ViewChild('matCalendar') matCalendar: MatCalendar<any>;
  constructor(private cd: ChangeDetectorRef) { }
  startSidenaveOpened: boolean;


  // dateClass = (d: Date) => {
  //   const date = d.getDate();

  //   return (date === 1 || date === 20) ? 'dps-activity-date-class' : undefined;
  // }


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectYearAndMonth && changes.selectYearAndMonth.currentValue) {
      this.matCalendar._goToDateInView(changes.selectYearAndMonth.currentValue, 'month');
      this.matCalendar['_intlChanges'].next();
    }
    if (changes.monthActivityList) {
      this.dateclass = this.getSelectedDates();
      setTimeout(() => {

        if (this.matCalendar.monthView) {
          this.matCalendar.monthView._init();
        }
      }, 100);
    }

  }



  onSelectDay(event) {
    if (this.monthActivityList) {

      const day = event.date();
     // const a = this.monthActivityList.find(s => s.)
      const keys = this.monthActivityList.filter(f => f.day === day);
      this.selectedDay.emit(keys);

    }


  }




  getSelectedDates() {

    let aa = [];
    if (this.monthActivityList) {
      aa = this.monthActivityList.map(a => a.day);
    }
    return (date): MatCalendarCellCssClasses => {
      console.log(123, date);
      const day = date._d.getDate();
      const highlightDate = aa.some(x => x === day);

      if (highlightDate) {
        return 'special-date';
      }


    };

  }


}






// dateClass() {
//   return (date: Date): MatCalendarCellCssClasses => {
//     const highlightDate = this.datesToMark // array of dates
//       .map(strDate => new Date(strDate)) // wrap with new Date if not in date object
//       .some(d => d.getDate() === date.getDate() && d.getMonth() ===
//         date.getMonth() && d.getFullYear() === date.getFullYear());
//     console.log(highlightDate);

//     const highlightCurrentDate = this.upcomingCalendarEvents
//       .map(strDate => new Date(+strDate.date))
//       .some(d => d.getDate() === date.getDate() && currentDate.getDate() ===
//         d.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() ===
//         date.getFullYear());
//     console.log(highlightDate);
//     if (highlightCurrentDate) {
//       return 'highlight-current-date-class'
//     } else if (highlightDate) {
//       return 'highlight-date-class'
//     } else {
//       return ''
//     }


//   };
// }


// displayMonth() {
//   const HeaderElsClass = this.elRef.nativeElement.getElementsByClassName('mat-calendar-body-cell');
//   const orderDate = this.convertDate.dateFormat(this.tempOrdersDate, 'MMMM D, YYYY');
//   // tempOrderDate is epoch array, i convert from epoch to date

//   for(let index in HeaderElsClass) {
//     if(typeof HeaderElsClass[index] === 'object') {
//       let headerClass = HeaderElsClass[index].getAttribute('aria-label');

//       orderDate.find(each => {
//         if(each === headerClass) {
//           this.renderer.addClass(HeaderElsClass[index], 'mat-calendar-body-active');
//           this.renderer.setStyle(HeaderElsClass[index], 'font-weight', '900');
//         }
//         return false;
//       })
//     }
//   }
// }


// }

@Component({
  selector: 'dps-calendar-custom-header',
  styles: [],
  template: ``
})
export class CalendarCustomHeaderComponent {

  constructor() { }
}
