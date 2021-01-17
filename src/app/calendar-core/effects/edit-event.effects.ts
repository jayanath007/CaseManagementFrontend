
import { tap, retry, mergeMap, catchError, map, switchMap, filter, take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { of, combineLatest, from } from 'rxjs';
import * as EditEvent from '../actions/edit-event';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { getIsSending, getAllCalendars, getIsDeleting, getEditEvent, getIsEventIdCreating } from '../reducers';
import {
    Event, PatternedRecurrence
} from '../../core/lib/microsoft-graph';
import { MSGraphCalendarClientService } from '../services/msgraph-client.service';
import { LoadSingleCalendarEvent, ReloadCalendar, RemoveCalendarEventSuccess, ResponseCalendarEventFail } from '../actions/event';
import * as MsGraphBeta from '../../core/lib/microsoft-graph';
import { getUser } from '../../auth';
import { RefreshReminders } from '../../outlook-notifications';
import { CreateFileAttachmentReqest } from '../models/interfaces';
import { MatSnackBar } from '@angular/material';
import { centerToWindow } from '../../utils/bounds';
import { OpenByUrl } from '../../document-view';

@Injectable()
export class EventEditeEffects {
    constructor(private actions$: Actions, private datePipe: DatePipe, protected urlResolver: FileUrlResolverService,
        private store: Store<any>, private service: MSGraphCalendarClientService, public snackBar: MatSnackBar,
    ) { }

    @Effect()
    addEvent$ = this.actions$.pipe(ofType<EditEvent.AddEvent>(EditEvent.ADD_EVENT),
        map(action => new EditEvent.GetRooms()));

    @Effect()
    sendEvents$ = this.actions$.pipe(ofType<EditEvent.SendCalanderEvent>(EditEvent.SEND_CALANDER_EVENT),
        switchMap(action =>
            combineLatest(
                this.store.select(getIsDeleting),
                this.store.select(getUser),
                ((isDeleting, user) => ({ isDeleting: isDeleting, user: user, action: action }))
            ).pipe(take(1))),
        filter(info => info.isDeleting === false),
        switchMap(info => {
            const data: Event = info.action.payload.event;
            let startDate = info.action.payload.event.start.dateTime.replace('Z', '');
            let endDate = info.action.payload.event.end.dateTime.replace('Z', '');
            let recurrence: PatternedRecurrence;
            if (startDate > endDate) {
                endDate = startDate;
            }
            if (data.isAllDay) {
                startDate = this.datePipe.transform(startDate, 'yyyy-MM-ddT00:00:00.0000000');
                if (new Date(endDate).valueOf() - new Date(startDate).valueOf() < 86400000 ||
                    this.datePipe.transform(endDate, 'HH:mm:ss') !== '00:00:00') {
                    endDate = this.datePipe.transform(new Date(endDate).addDays(1), 'yyyy-MM-ddT00:00:00.0000000');
                }
            }
            if (data.recurrence && data.recurrence.pattern) {
                recurrence = {
                    ...data.recurrence, range: {
                        ...data.recurrence.range,
                        startDate: data.recurrence.range.startDate.replace('Z', ''),
                        endDate: data.recurrence.range.endDate ? data.recurrence.range.endDate.replace('Z', '') : null,
                        recurrenceTimeZone: info.user.userTimeZone.info.alias
                    }
                };
            } else {
                recurrence = undefined;
            }
            const editedEvent: MsGraphBeta.Event = {
                hasAttachments: data.hasAttachments,
                subject: data.subject,
                body: data.body,
                bodyPreview: data.bodyPreview,
                start: {
                    dateTime: startDate,
                    timeZone: info.user.userTimeZone.info.alias
                },
                end: {
                    dateTime: endDate,
                    timeZone: info.user.userTimeZone.info.alias
                },
                isAllDay: data.isAllDay,
                recurrence: recurrence,
                attendees: data.attendees,
                calendar: data.calendar,
                id: data.id || null,
                responseRequested: (data.calendar.isDefaultCalendar || (
                    data.calendar.name === 'Calendar' &&
                    data.calendar.canEdit === true &&
                    data.calendar.canShare === true &&
                    data.calendar.canViewPrivateItems === true)) ? data.responseRequested : false,
                locations: data.locations,
                reminderMinutesBeforeStart: data.reminderMinutesBeforeStart,
                sensitivity: data.sensitivity,
                showAs: data.showAs,
                isOnlineMeeting: data.isOnlineMeeting,
                onlineMeetingProvider: 'teamsForBusiness'
            };
            if (!editedEvent.id) {
                return this.service.createEvent(editedEvent.calendar.id, editedEvent).pipe(
                    map((result) => new EditEvent.SendCalanderEventSuccess({ event: editedEvent, newEvent: result })),
                    catchError(error => of(new EditEvent.SendCalanderEventFail({ event: editedEvent }))));
            } else {
                return this.service.updateEvet(editedEvent.id, editedEvent).pipe(
                    map((result) => new EditEvent.SendCalanderEventSuccess({ event: editedEvent, newEvent: result })),
                    catchError(error => of(new EditEvent.SendCalanderEventFail({ event: editedEvent }))));
            }
        }));

    @Effect()
    sendCalanderEventSuccess$ = this.actions$.pipe(ofType<EditEvent.SendCalanderEventSuccess>(EditEvent.SEND_CALANDER_EVENT_SUCCESS),
        mergeMap<any, any>(action => {
            if (action.payload.newEvent.type === 'seriesMaster') {
                return this.store.select(getAllCalendars).pipe(take(1), mergeMap(calendars => {
                    return from([
                        new ReloadCalendar({
                            calendarId: action.payload.event.calendar.id,
                            groupId: calendars.find(val => val.data.id === action.payload.event.calendar.id).calendarGroupId
                        }),
                        new RefreshReminders(1)
                    ]);
                }));
            } else {
                return from([
                    new LoadSingleCalendarEvent({ calendarId: action.payload.event.calendar.id, eventId: action.payload.newEvent.id }),
                    new RefreshReminders(1)
                ]);
            }
        }));
    @Effect()
    eventEditPopupClose$ = this.actions$.pipe(ofType<EditEvent.EventEditPopupClose>(EditEvent.CLOSE_POPUP),
        mergeMap(action => {
            if (action.payload.event.type === 'seriesMaster' && action.payload.attachmentChange &&
                (action.payload.type !== 'SaveAndSend' && action.payload.type !== 'Delete')) {
                return this.store.select(getAllCalendars).pipe(take(1), mergeMap(calendars => {
                    return from([
                        new ReloadCalendar({
                            calendarId: action.payload.event.calendar.id,
                            groupId: calendars.find(val => val.data.id === action.payload.event.calendar.id).calendarGroupId
                        }),
                        new RefreshReminders(1)
                    ]);
                }));
            } else if (action.payload.attachmentChange && (action.payload.type !== 'SaveAndSend' && action.payload.type !== 'Delete')) {
                return from([
                    new LoadSingleCalendarEvent({ calendarId: action.payload.event.calendar.id, eventId: action.payload.event.id }),
                    new RefreshReminders(1)
                ]);
            } else {
                return from([]);
            }
        }));

    @Effect()
    deleteEvents$ = this.actions$.pipe(ofType<EditEvent.DeleteCalanderEvent>(EditEvent.DELETE_CALANDER_EVENT),
        switchMap(action =>
            combineLatest(
                this.store.select(getIsSending),
                (isSending => ({
                    isSending: isSending, action: action
                }))
            ).pipe(take(1))),
        filter(info => info.isSending === false),
        switchMap(data => {
            return this.service.deleteEvent(data.action.payload.event.id).pipe(
                mergeMap((result) => from([
                    new EditEvent.DeleteCalanderEventSuccess({ event: data.action.payload.event }),
                    new RemoveCalendarEventSuccess(
                        {
                            calendarId: data.action.payload.event.calendar.id,
                            eventId: data.action.payload.event.id, isSeries: data.action.payload.event.type === 'seriesMaster'
                        }),
                    new RefreshReminders(1)
                ])),
                catchError(error => of(new EditEvent.DeleteCalanderEventFail({ event: data.action.payload.event }))));
        }));

    @Effect()
    addAttachment$ = this.actions$.pipe(ofType<EditEvent.AddAttachment>(EditEvent.ADD_ATTACHMENT),
        mergeMap(action =>
            combineLatest(
                this.store.select(getIsSending),
                this.store.select(getIsDeleting),
                this.store.select(getIsEventIdCreating),
                ((isSending, isDeleting, isCreatingId, event) => ({
                    isSending: isSending, isDeleting: isDeleting, isCreatingId, event, action: action
                }))
            ).pipe(take(1))),
        filter(info => info.isSending === false && info.isDeleting === false),
        tap(({ isSending, isDeleting, isCreatingId, action }) => {
            if (!isCreatingId && !action.payload.event.id) {
                this.store.dispatch(new EditEvent.ItemCreating());
            }
        }),

        mergeMap(data => {
            if (!data.isCreatingId && !data.action.payload.event.id) {
                return this.service.createEvent(data.action.payload.event.calendar.id, {}).pipe(
                    map((result) => new EditEvent.UploadAttachment({
                        event: result, attachment: data.action.payload.attachment, uid: data.action.payload.uid,
                        type: data.action.payload.type
                    })),
                    catchError(error => of(new EditEvent.UploadAttachmentFail({
                        event: data.action.payload.event,
                        attachment: data.action.payload.attachment, uid: data.action.payload.uid
                    }))));
            } else {
                return this.store.select(getEditEvent).pipe(
                    filter(val => !!val && !!val.id),
                    take(1),
                    switchMap(event =>
                        of(new EditEvent.UploadAttachment({
                            event: event, attachment: data.action.payload.attachment, uid: data.action.payload.uid,
                            type: data.action.payload.type
                        }))));
            }
        }));

    @Effect()
    uploadAttachment$ = this.actions$.pipe(ofType<EditEvent.UploadAttachment>(EditEvent.UPLOAD_ATTACHMENT),
        mergeMap(action => {
            if (action.payload.type === 'oneDriveAttachment') {
                return this.service.addDriveAttachment(action.payload.event.id, action.payload.attachment).pipe(
                    retry(3),
                    map((result) => {
                        const data = action.payload.attachment;
                        data.id = result.data[0].attachmentId.id;
                        return new EditEvent.UploadAttachmentSuccess({ attachment: data, uid: action.payload.uid });
                    }),
                    catchError(error => of(new EditEvent.UploadAttachmentFail({
                        event: action.payload.event, attachment: action.payload.attachment, uid: action.payload.uid
                    }))));
            } else if (action.payload.attachment.size < 4000000) {
                return this.service.uploadAttachment(action.payload.event.id, action.payload.attachment).pipe(
                    map((result) => new EditEvent.UploadAttachmentSuccess({
                        attachment: result, uid: action.payload.uid
                    })),
                    catchError(error => of(new EditEvent.UploadAttachmentFail({
                        event: action.payload.event, attachment: action.payload.attachment, uid: action.payload.uid
                    }))));
            } else {
                const fileAttachmentReqest: CreateFileAttachmentReqest = {
                    AttachmentType: 'FileAttachment',
                    FileAttachmentTypeViewModel: {
                        Name: action.payload.attachment.name,
                        Size: action.payload.attachment.size,
                        IsInline: action.payload.attachment.isInline,
                        IsContactPhoto: false,
                        ContentType: action.payload.attachment.contentType,
                        Base64String: '' + action.payload.attachment.contentBytes
                    }
                };
                return this.service.addFileAttachment(action.payload.event.id, [fileAttachmentReqest]).pipe(
                    retry(3),
                    map(result => {
                        action.payload.attachment.id = result.data[0].attachmentId.id;
                        return new EditEvent.UploadAttachmentSuccess({ attachment: action.payload.attachment, uid: action.payload.uid });
                    }),
                    catchError(error => of(new EditEvent.UploadAttachmentFail({
                        event: action.payload.event, attachment: action.payload.attachment, uid: action.payload.uid
                    }))));
            }
        }));

    @Effect()
    deleteAttachment$ = this.actions$.pipe(ofType<EditEvent.DeleteAttachment>(EditEvent.DELETE_ATTACHMENT),
        switchMap(action => {
            return this.service.deleteAttachment(action.payload.event.id, action.payload.attachmentId).pipe(
                map((result) => new EditEvent.DeleteAttachmentSuccess({ attachmentID: action.payload.attachmentId })),
                catchError(error => of(new EditEvent.DeleteAttachmentFail({ attachmentID: action.payload.attachmentId }))));
        }));

    @Effect({ dispatch: false })
    downloadAttachment$ = this.actions$.pipe(ofType<EditEvent.DownloadAttachment>(EditEvent.DOWNLOAD_ATTACHMENT),
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
    downloadAttachmentToCloud$ = this.actions$.pipe(ofType<EditEvent.DownloadAttachment>(EditEvent.DOWNLOAD_ATTACHMENT),
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
                map((result) => new EditEvent.DownloadAttachmentSuccess(null)),
                catchError(error => {
                    snackBar.dismiss();
                    return of(new EditEvent.DownloadAttachmentFail({ error, ids: null }));
                }));
        }));
    @Effect()
    responseCalendarEvent$ = this.actions$.pipe(ofType<EditEvent.ResponseCalendarEvent>(EditEvent.RESPONSE_CALENDAR_EVENT),
        switchMap(action => {
            const eventId = action.payload.isSeries === true ?
                action.payload.event.seriesMasterId || action.payload.event.id : action.payload.event.id;
            return this.service.responseEvent(eventId, action.payload.comment, action.payload.sendResponse, action.payload.type).pipe(
                map(result =>
                    new RemoveCalendarEventSuccess(
                        { calendarId: action.payload.event.calendar.id, eventId: eventId, isSeries: action.payload.isSeries })
                ),
                catchError(error => of(new EditEvent.ResponseCalendarEventFail({
                    error: error,
                    calendarId: action.payload.event.calendar.id, eventId: eventId,
                }))));
        }));

    @Effect()
    getRooms$ = this.actions$.pipe(ofType<EditEvent.GetRooms>(EditEvent.GET_ROOMS),
        switchMap(action => this.service.getRooms().pipe(
            map(result => new EditEvent.GetRoomsSuccess({ rooms: result })),
            catchError(error => of(new EditEvent.GetRoomsFail({ error: error })))
        ))
    );

}
