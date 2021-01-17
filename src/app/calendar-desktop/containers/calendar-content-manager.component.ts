import { Store } from '@ngrx/store';
import { OnInit, Component } from '@angular/core';
import { getCurrentView, getCurrentTitle, getShowBusinessHours } from '../reducers';
import { ChangeCalendarView, ChangeCalendarTitle, ChangeShowBusinessHours } from '../actions/calendar';
import { CalendarContentBaseManager } from '../../calendar-core/containers/calendar-content-base-manager';
import { getUser, User } from '../../auth';
import { Observable } from 'rxjs';
@Component({
    selector: 'dps-calendar-content-manager',
    template: '<ng-content></ng-content>',
    styles: []
})
export class CalendarContentManagerComponent extends CalendarContentBaseManager implements OnInit {
    public currentView$: any;
    // public currentDate$: any;
    public currentTitle$: any;
    public showBusinessHours$: any;

    public calendareViewList$: any;
    public calendarEventList$: any;
    public selectedDate$: any;
    public selectedDateEvents$: any;
    public defaultCalendar$: any;
    public user$: Observable<User>;

    constructor(store: Store<any>) {
        super(store);
        this.currentView$ = this.store.select(getCurrentView);
        // this.currentDate$ = this.store.select(getCurrentDate);
        this.currentTitle$ = this.store.select(getCurrentTitle);
        this.showBusinessHours$ = this.store.select(getShowBusinessHours);
        this.user$ = this.store.select(getUser);
    }

    ngOnInit() {
        this.calendareViewList$ = this.getCalendarViewList();
        this.calendarEventList$ = this.getcalendarEventList();
        this.selectedDate$ = this.getSelectedDate();
        this.selectedDateEvents$ = this.getAllCalendarEventsOfSelectedDate();
        this.defaultCalendar$ = this.getDefaultCalendar();
    }
    public onChangeCalendarView(view: string) {
        this.store.dispatch(new ChangeCalendarView({ view: view }));
    }
    public onChangeCalendarTitle(title: string) {
        this.store.dispatch(new ChangeCalendarTitle({ title: title }));
    }
    public onChangeShowBusinessHours(showBusinessHours: boolean) {
        this.store.dispatch(new ChangeShowBusinessHours({ showBusinessHours: showBusinessHours }));
    }
}
