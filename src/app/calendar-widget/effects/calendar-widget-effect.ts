
import { take, map, switchMap, catchError, filter } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { of, combineLatest } from 'rxjs';
import { getUser } from '../../auth';
import { CalendarWidgetService } from '../services/calendar-widget.service';
import { DatePipe } from '@angular/common';
@Injectable()
export class MatterWidgetEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: CalendarWidgetService,
        private date: DatePipe
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitCalendarWidget>(Core.INIT_CALENDAR_WIDGET),
        map(action =>
            new Core.LoadData()
        ));


    @Effect()
    loadData$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap((action) =>
            combineLatest(
                this.store.select(getUser).pipe(filter(user => !!(user && user.userTimeZone && user.userTimeZone.info))),
                (user => ({
                    start: this.date.transform(new Date(), 'yyyy-MM-dd', 'UTC') /* + 'T00:00:00' */,
                    end: this.date.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd', 'UTC') /* + 'T00:00:00' */,
                    timeZone: user.userTimeZone.info.alias,
                    action: action
                })
                )).pipe(take(1))
        ),
        switchMap(action =>
            this.service.loadCalendarEvent(action.start, action.end, action.timeZone).pipe(
                map(result => {
                    const events = result.filter(val => {
                        const startTime = new Date(action.start + 'T00:00:00.0000000').getTime();
                        const endTime = new Date(action.end + 'T00:00:00.0000000').getTime();
                        const eventStart = new Date(val.start.dateTime).getTime();
                        const eventEnd = new Date(val.end.dateTime).getTime();
                        return (eventStart < endTime) && (eventEnd > startTime);
                    }).sort((a, b) => {
                        const _a = new Date(a.start.dateTime).valueOf();
                        const _b = new Date(b.start.dateTime).valueOf();
                        return !a.isAllDay && b.isAllDay ? 1 : (a.isAllDay && !b.isAllDay ? -1 : (_a < _b ? -1 : (_b < _a ? 1 : 0)));
                    })
                    return new Core.LoadDataSuccess({ data: events });
                }),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.RefreshCalendarWidgetData>(Core.REFRESH_DATA),
        map(action =>
            new Core.LoadData()
        ));
}
