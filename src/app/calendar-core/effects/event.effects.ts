
import { tap, catchError, map, retry, switchMap, mergeMap, filter, take } from 'rxjs/operators';
import { CalendarItem } from '../models/interfaces';
import { Calendar } from '../../core/lib/microsoft-graph';
import { EMPTY as empty, combineLatest, of, merge, from } from 'rxjs';

import * as Event from '../actions/event';
import * as EditEvent from '../actions/edit-event';
import { MSGraphCalendarClientService } from '../services/msgraph-client.service';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import {
    getCurrentDateRange, getCurrentViewType, getCalendarLoadedHashsById, getCalendarItemById, getCalendarEventById
} from '../reducers';
import { getSelectesRangeMonthHash } from '../utils/calendar';
import { getUser } from '../../auth';
import { FileUrlResolverService, OpenByUrl } from '../../document-view';
import { Router } from '@angular/router';
import { getCalendarItemByIdSet, getAllCalendars } from '../reducers';
import { UpdateTimeZoneSuccess, UPDATE_USER_TIME_ZONE_SUCCESS } from '../../organizer-settings-core';
import { RefreshReminders } from '../../outlook-notifications';
import { RefreshCalendarWidgetData } from '../../calendar-widget';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { centerToWindow } from '../../utils/bounds';

@Injectable()
export class EventEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MSGraphCalendarClientService,
        protected urlResolver: FileUrlResolverService, private router: Router, public snackBar: MatSnackBar) { }

    @Effect()
    calendarEventOnLoad$ = this.actions$.pipe(ofType<Event.LoadCalendarEvents>(Event.LOAD_CALENDAR_EVENTS),
        switchMap((action) =>
            combineLatest(
                this.store.select(getCurrentDateRange),
                this.store.select(getCurrentViewType),
                this.store.select(getCalendarLoadedHashsById(action.payload.calendar.data.id)),
                this.store.select(getUser).pipe(filter(user => !!(user && user.userTimeZone && user.userTimeZone.info))),
                ((range, type, hashs, user) => ({
                    start: range.dateStart, end: range.dateEnd, viewType: type,
                    hashs: hashs,
                    timeZone: user.userTimeZone,
                    action: action
                })
                )).pipe(take(1))
        ),
        mergeMap<any, any>(({ start, end, viewType, hashs, timeZone, action }) => {
            const newRange = getSelectesRangeMonthHash(
                { startDate: start, enddate: end, type: viewType.type, startDay: viewType.startDay }, action.payload.calendar.data.id);
            if ((hashs[newRange.hash] ? hashs[newRange.hash].isLoaded : false)) {
                return of(new Event.CalendarEventsAlreadyLoaded({ calendarId: action.payload.calendar.data.id }));
            } else {
                return this.service.loadCalendarEvent(action.payload.calendar.data.id,
                    newRange.range.start, newRange.range.end, timeZone.info.alias).pipe(
                        retry(3),
                        map((result) => new Event.LoadCalendarEventSuccess({
                            calendar: action.payload.calendar,
                            dateRange: { startDate: start, endDate: end },
                            viewType: viewType,
                            events: result
                        })),
                        catchError(error => of(new Event.LoadCalendarEventFail({
                            calendar: action.payload.calendar,
                            dateRange: { startDate: start, endDate: end },
                            viewType: viewType
                        }))));
            }
        }
        ));


    @Effect()
    calendarEventOnDelete$ = this.actions$.pipe(ofType<EditEvent.DeleteCalanderEventSuccess>(EditEvent.DELETE_CALANDER_EVENT_SUCCESS),
        map((action) => {
            return new Event.RemoveCalendarEventSuccess(
                { calendarId: action.payload.event.calendar.id, eventId: action.payload.event.id, isSeries: false });
        }));

    @Effect()
    removeCalendarEvent$ = this.actions$.pipe(ofType<Event.RemoveCalendarEvent>(Event.REMOVE_CALENDAR_EVENT),
        switchMap(action => {
            return this.service.deleteEvent(action.payload.eventId).pipe(
                mergeMap((data) => from([
                    new Event.RemoveCalendarEventSuccess(action.payload),
                    new RefreshReminders(1)
                ])),
                catchError(error => of(new Event.RemoveCalendarEventFail({
                    error: error,
                    calendarId: action.payload.calendarId, eventId: action.payload.eventId
                }))));
        }));
    @Effect()
    loadCalendarEventsOnViewChange$
        = this.actions$.pipe(ofType<Event.LoadCalendarEventsOnViewChange>(Event.LOAD_CALENDAR_EVENTS_ON_VIEW_CHANGE),
            switchMap(action => this.store.select(getCalendarItemByIdSet(action.payload.groupId, action.payload.calendarId)).pipe(
                filter(val => !!val.color),
                take(1), switchMap(calendar => of(new Event.LoadCalendarEvents({ calendar: calendar }))))));


    @Effect()
    loadSingleCalendarEvent$ = this.actions$.pipe(ofType<Event.LoadSingleCalendarEvent>(Event.LOAD_SINGLE_CALENDAR_EVENT),
        switchMap((action) =>
            combineLatest(
                this.store.select(getCalendarItemById(action.payload.calendarId)),
                this.store.select(getUser).pipe(filter(user => !!(user && user.userTimeZone && user.userTimeZone.info))),
                ((calendar, user) => ({
                    calendar: calendar,
                    timeZone: user.userTimeZone,
                    action: action
                })
                )).pipe(take(1))
        ),
        switchMap(({ calendar, timeZone, action }) =>
            this.service.loadSingleCalendarEvent(action.payload.eventId, timeZone.info.alias).pipe(
                map(result =>
                    new Event.LoadSingleCalendarEventsSuccess
                        ({ calendarId: action.payload.calendarId, event: result, calendar: calendar })),
                catchError(error => of(new Event.LoadSingleCalendarEventsFail(action.payload))))
        ));

    @Effect()
    updateCalendarEvent$ = this.actions$.pipe(ofType<Event.UpdateCalendarEvent>(Event.UPDATE_CALENDAR_EVENT),
        switchMap(_action => this.store.select(getAllCalendars).pipe(take(1), map(calendars => {
            return { calendar: calendars.find(val => val.data.id === _action.payload.calendarId), action: _action };
        }), switchMap(({ calendar, action }) =>
            this.service.updateEvet(action.payload.eventId, action.payload.event).pipe(
                mergeMap<any, any>(result => {
                    if (action.payload.isSeries) {

                        return from([
                            new Event.ReloadCalendar({
                                calendarId: action.payload.calendarId,
                                groupId: calendar.calendarGroupId
                            }),
                            new RefreshReminders(1)
                        ]);
                    }
                    return from([
                        new Event.LoadSingleCalendarEvent(
                            { calendarId: action.payload.calendarId, eventId: action.payload.eventId }),
                        new RefreshReminders(1)
                    ]);
                }),
                catchError(error => {
                    return this.store.select(getCalendarEventById(action.payload.calendarId, action.payload.eventId)).pipe(
                        take(1), mergeMap(event => {
                            return from([
                                new Event.UpdateCalendarEventFail({ event: action.payload.event, eventId: action.payload.eventId }),
                                new Event.LoadSingleCalendarEventsSuccess({
                                    calendarId: action.payload.calendarId, event: event.data, calendar: calendar
                                })
                            ]);
                        }));
                    // return of(new Event.UpdateCalendarEventFail({ event: action.payload.event, eventId: action.payload.eventId }))
                }))
        ))));

    @Effect()
    responseCalendarEvent$ = this.actions$.pipe(ofType<Event.ResponseCalendarEvent>(Event.RESPONSE_CALENDAR_EVENT),
        switchMap((action) => {
            const eventId = action.payload.isSeries === true ?
                action.payload.event.data.seriesMasterId || action.payload.event.data.id : action.payload.event.data.id;
            return this.service.responseEvent(
                eventId,
                action.payload.comment, action.payload.sendResponse, action.payload.type).pipe(
                    switchMap<any, any>(result => {
                        if (action.payload.type === 'decline' || action.payload.type === 'cancel') {
                            return of(new Event.RemoveCalendarEventSuccess(
                                { calendarId: action.payload.event.calendarId, eventId: eventId, isSeries: action.payload.isSeries }));
                        }
                        if (action.payload.isSeries) {
                            return this.store.select(getAllCalendars).pipe(take(1), map(calendar => {
                                return new Event.ReloadCalendar({
                                    calendarId: action.payload.event.calendarId,
                                    groupId: calendar.find(val => val.data.id === action.payload.event.calendarId).calendarGroupId
                                });
                            }));
                        }
                        return of(new Event.LoadSingleCalendarEvent(
                            { calendarId: action.payload.event.calendarId, eventId: eventId }));
                    }),
                    catchError(error => of(new Event.ResponseCalendarEventFail({
                        error: error,
                        calendarId: action.payload.event.calendarId, eventId: eventId,
                    }))));
        }));
    @Effect({ dispatch: false })
    downloadAttachment$ = this.actions$.pipe(ofType<Event.DownloadAttachment>(Event.DOWNLOAD_ATTACHMENT),
        filter(action => action.payload.type === 'computer'),
        mergeMap((action) => {
            return this.urlResolver.getAttachementDownloadUrl('me', null, null, action.payload.attachment, false)
                .pipe(map((url) =>
                    ({ url: url, name: action.payload.attachment.name })));
        }),
        tap(({ url, name }) => {
            window.open(url, '_blank');
        }));

    @Effect()
    downloadAttachmentToCloud$ = this.actions$.pipe(ofType<Event.DownloadAttachment>(Event.DOWNLOAD_ATTACHMENT),
        filter(action => action.payload.type === 'cloud'),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            const snackBar = this.snackBar.open('Downloading to personal folder', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            return this.service.downloadMailAttachmentToOneDrive(action.payload.attachment.id, user.profile.upn.split('@')[0]).pipe(
                tap((result) => {
                    snackBar.dismiss();
                    this.snackBar.open('Download complete', result && result.data && result.data.fileUrl ? 'Open' : null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right',
                        panelClass: 'dps-download-complete-snackbar'
                    }).onAction()
                        .subscribe(() => {
                            this.store.dispatch(
                                new OpenByUrl({
                                    url: result.data.fileUrl,
                                    id: result.data.fileId,
                                    spec: { ...centerToWindow(800, 600) },
                                    attachmentName: ''
                                }));
                        });
                }),
                map((result) => new Event.DownloadAttachmentSuccess(null)),
                catchError(error => {
                    snackBar.dismiss();
                    return of(new Event.DownloadAttachmentFail({ error, ids: null }));
                }));
        }));
    @Effect()
    createReplyForward$ = this.actions$.pipe(ofType<Event.CreateReplyForward>(Event.CREATE_REPLY_FORWARD),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                map((user) => {
                    return { user, payload: action.payload };
                }),
                take(1))),
        mergeMap((action) => {
            const messageFormat = getDefaultMessageFormat(action.user.messageFormat);
            return this.service
                .createReplyForward(
                    action.payload.isSeries === true ?
                        action.payload.event.data.seriesMasterId || action.payload.event.data.id : action.payload.event.data.id,
                    action.payload.isSeries === true ? null : action.payload.event.data.changeKey,
                    action.payload.type, action.payload.message,
                    action.user.isSignaturAutoAdd ? action.payload.comment ? action.payload.comment : '' +
                        `${messageFormat} <div class="signature">` + action.user.signature + '</div>' +
                        '<div id ="divRplyFwdMsg"></div>' :
                        action.payload.comment ? action.payload.comment : '' + `${messageFormat} <div id ="divRplyFwdMsg"></div>`).pipe(
                            map((result) => {
                                if (result.status === 'Success') {
                                    const encodeId = encodeURIComponent(result.data);
                                    this.router.navigate([`/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId]);
                                    return new Event.CreateReplyForwardSuccess
                                        ({ newItem: { id: result.data }, refItem: action.payload.event });
                                }
                                return new Event.CreateReplyForwardFail({ error: result.messageBody, event: action.payload.event });
                            }),
                            catchError(error => of(new Event.CreateReplyForwardFail({ error: error, event: action.payload.event }))));
        }));

    @Effect()
    reloadCalendar$ = this.actions$.pipe(ofType<Event.ReloadCalendar>(Event.RELOAD_CALENDAR),
        mergeMap((action) =>
            this.store.select(getCalendarItemByIdSet(action.payload.groupId, action.payload.calendarId)).pipe(
                filter(val => !!val.color && val.selected),
                take(1),
                mergeMap(calendar =>
                    from([
                        new Event.CloseCalendar({ calendarId: action.payload.calendarId, groupId: action.payload.groupId }),
                        new Event.LoadCalendarEvents({ calendar: calendar }),
                        new RefreshCalendarWidgetData()
                    ])
                ))
        ));

    @Effect()
    loadSeriesCalendarEvent$ = this.actions$.pipe(ofType<Event.LoadSeariesData>(Event.LOAD_SEARIES_DATA),
        switchMap((action) =>
            combineLatest(
                this.store.select(getUser).pipe(filter(user => !!(user && user.userTimeZone && user.userTimeZone.info))),
                (user => ({
                    timeZone: user.userTimeZone,
                    action: action
                })
                )).pipe(take(1))),
        switchMap(({ timeZone, action }) =>
            this.service.loadSingleCalendarEvent(action.payload.event.seriesMasterId, timeZone.info.alias).pipe(
                map(result =>
                    new Event.LoadSeariesDataSuccess({ seriesEventData: result, calendar: action.payload.event.calendar })),
                catchError(error => of(new Event.LoadSeariesDataFail())))
        ));

    @Effect()
    openSeriesEvent$ = this.actions$.pipe(ofType<Event.LoadSeariesDataSuccess>(Event.LOAD_SEARIES_DATA_SUCCESS),
        map(action => {
            return new EditEvent.AddEvent({ event: { ...action.payload.seriesEventData, calendar: action.payload.calendar } });
        }));

    @Effect()
    updateTimeZoneSuccess$ = this.actions$.pipe(ofType<UpdateTimeZoneSuccess>(UPDATE_USER_TIME_ZONE_SUCCESS),
        mergeMap((action) => this.store.select(getUser).pipe(
            filter(user => !!(user && user.selectedCalendars)),
            take(1),
            mergeMap(user => {
                const mergArray = [];
                user.selectedCalendars.forEach(calendarId => {
                    mergArray.push(this.store.select(getCalendarItemById(calendarId)).pipe(take(1)));
                });
                return merge(mergArray).pipe(mergeMap(data => data));
            }),
            filter(calendar => !!calendar),
            map((calendar: Readonly<CalendarItem<Readonly<Calendar>>>) => {
                return new Event.ReloadCalendar({ groupId: calendar.calendarGroupId, calendarId: calendar.data.id });
            }))
        ));
}

