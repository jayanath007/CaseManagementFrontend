import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { CalendarBaseManager } from '../../calendar-core/containers/calendar-base-manager';
import { getIsEndSidenaveOpened, getIsStartSidenaveOpened, getIsEndSidenaveEnabled } from '../reducers';
import { StartSidenaveToggle, EndSidenaveToggle, EndSidenaveEnable, EndSidenaveDisable } from '../actions/side-nav';
import { getVisibleOutlet } from '../../layout-desktop';
@Component({
    selector: 'dps-calendar-manager',
    template: `<dps-calendar-layout *ngIf="calendarGroups$|async"
                    [isLoading]="isLoading$ | async"
                    [startSidenaveOpened]="startSidenaveOpened$ | async"
                    [endSidenaveOpened]="endSidenaveOpened$ | async"
                    [endSidenaveEnabled]="endSidenaveEnabled$ | async"
                    [calendarGroups]="calendarGroups$|async"
                    [calendarList]="allCalendars$|async"
                    [activeOutlet]="activeOutlet$?(activeOutlet$ | async):'main'"
                    (editEvent)="onEditEvent($event)"
                    (startSidenaveToggle)="onStartSidenaveToggle()"
                    (endSidenaveToggle)="onEndSidenaveToggle()"
                    (endSidenaveEnable)="onEndSidenaveEnable()"
                    (endSidenaveDisable)="onEndSidenaveDisable()"
                    (toggledgroup)="onCalendarGroupToggle($event)"
                    (toggleCalendar)="onToggleCalendar($event)"
                    (calendarGroupEditOperations)="onCalendarGroupEditOperations($event)"
                    (calendarEditOperations)="onCalendarEditOperations($event)">
                </dps-calendar-layout>`
})

export class CalendarManagerComponent extends CalendarBaseManager implements OnInit {
    public startSidenaveOpened$: any;
    public endSidenaveOpened$: any;
    public endSidenaveEnabled$: any;
    public activeOutlet$: any;
    constructor(store: Store<any>) {
        super(store);
        this.startSidenaveOpened$ = this.store.select(getIsStartSidenaveOpened);
        this.endSidenaveOpened$ = this.store.select(getIsEndSidenaveOpened);
        this.endSidenaveEnabled$ = this.store.select(getIsEndSidenaveEnabled);
        if (!(window.opener && window.opener !== window)) {
            this.activeOutlet$ = this.store.select(getVisibleOutlet);
        }
    }

    ngOnInit() {
    }
    public onStartSidenaveToggle() {
        this.store.dispatch(new StartSidenaveToggle());
    }
    public onEndSidenaveToggle() {
        this.store.dispatch(new EndSidenaveToggle());
    }
    public onEndSidenaveEnable() {
        this.store.dispatch(new EndSidenaveEnable());
    }
    public onEndSidenaveDisable() {
        this.store.dispatch(new EndSidenaveDisable());
    }
}
