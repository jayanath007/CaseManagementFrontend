import { switchMap, map } from 'rxjs/operators';
import { OpenEmailAttachemnt } from '../../document-view/actions/window-popups';
import { Store } from '@ngrx/store';
import {
    getEditEvent, getTimeList, getDayOfWeekList, getFreeBusyStatusList,
    getReminderList, getWeekIndexList, getMonthList, getRepeatList, getOptionalAttendees,
    getRequiredAttendees, getCanEditCalendars, getRepeatType, getIsDirty, getIsNewEvent,
    getAttachmentList, getIsAttachmentsUploding, getIsAttachmentChange, getLastInlineAttachment, getRooms
} from '../reducers';
import { Attendee, FileAttachment, Attachment } from '../../core/lib/microsoft-graph';
import {
    ChangeEventAddAttendee, ChangeEventRemoveAttendee, ChangeEventTitle,
    ChangeEventLocation, ChangeEventStart, ChangeEventEnd, ChangeEventIsAllDay, ChangeEventIsPrivate, ChangeOnlineMeeting,
    ChangeEventRepeatPattern, ChangeEventSaveToCalender, ChangeEventRepeatRangeStart,
    ChangeEventRepeatRangeEnd, ChangeEventReMinder, ChangeEventShowAs, ChangeEventBody, ChangeEventRequestresponses,
    SendCalanderEvent, DeleteCalanderEvent, AddAttachment, DeleteAttachment, DownloadAttachment, EventEditPopupClose, ResponseCalendarEvent
} from '../actions/edit-event';
import { EventEditInfo } from '../models/interfaces';
import { UpdateDetailsKind } from '../models/enums';
import * as MsGraphBeta from '../../core/lib/microsoft-graph';
import { FileUrlResolverService } from '../../document-view';
import { empty, of, from as fromPromise } from 'rxjs';
import { BodyHandlerService } from '../../organizer-desktop-shared';
import { MainMenuItem } from '../../layout-desktop';
import { LocalStorageKey } from '../../core';

export class EditEventBaseManager {
    public event$: any;
    public timeList$: any;
    public dayOfWeekList$: any;
    public freeBusyStatusList$: any;
    public reminderList$: any;
    public weekIndexList$: any;
    public monthList$: any;
    public repeatList$: any;
    public optionalAttendees$: any;
    public requiredAttendees$: any;
    public canEditCalendars$: any;
    public isDirty$: any;
    public repeatTypeList$: any;
    public isNewEvent$: any;
    public attachments$: any;
    public isAttachmentLoad$: any;
    public isAttachmentChange$: any;
    public lastInlineAttachment$: any;
    public rooms$: any;

    public matterDisplyName: string;

    constructor(protected store: Store<any>, protected urlResolver: FileUrlResolverService,
        protected bodyHandlerService: BodyHandlerService) {
        this.event$ = this.resoleEventBody();
        this.timeList$ = store.select(getTimeList);
        this.dayOfWeekList$ = store.select(getDayOfWeekList);
        this.freeBusyStatusList$ = store.select(getFreeBusyStatusList);
        this.reminderList$ = store.select(getReminderList);
        this.weekIndexList$ = store.select(getWeekIndexList);
        this.monthList$ = store.select(getMonthList);
        this.repeatList$ = store.select(getRepeatList);
        this.optionalAttendees$ = store.select(getOptionalAttendees);
        this.requiredAttendees$ = store.select(getRequiredAttendees);
        this.canEditCalendars$ = store.select(getCanEditCalendars);
        this.repeatTypeList$ = store.select(getRepeatType);
        this.isDirty$ = store.select(getIsDirty);
        this.isNewEvent$ = store.select(getIsNewEvent);
        this.attachments$ = store.select(getAttachmentList);
        this.isAttachmentLoad$ = store.select(getIsAttachmentsUploding);
        this.isAttachmentChange$ = store.select(getIsAttachmentChange);
        this.rooms$ = store.select(getRooms);
        this.lastInlineAttachment$ = this.getLastInlineAttachmentByToken();

        const menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
        this.matterDisplyName = menuItem.find(i => i.id === 'matter_search').label;
    }

    addAttendee(attendee: Attendee) {
        this.store.dispatch(new ChangeEventAddAttendee({ attendee: attendee }));
    }

    removeAttendee(attendee: Attendee) {
        this.store.dispatch(new ChangeEventRemoveAttendee({ attendee: attendee }));
    }

    updateEventData(updateInfo: EventEditInfo) {
        switch (updateInfo.kind) {
            case UpdateDetailsKind.Title: {
                this.store.dispatch(new ChangeEventTitle({ title: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.Location: {
                this.store.dispatch(new ChangeEventLocation(updateInfo.info));
                break;
            }
            case UpdateDetailsKind.Start: {
                this.store.dispatch(new ChangeEventStart({ start: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.End: {
                this.store.dispatch(new ChangeEventEnd({ end: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.IsAllDay: {
                this.store.dispatch(new ChangeEventIsAllDay({ isAllDay: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.IsPrivate: {
                this.store.dispatch(new ChangeEventIsPrivate({ isPrivate: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.Repeat: {
                this.store.dispatch(new ChangeEventRepeatPattern({ recurrencePattern: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.SaveToCalendar: {
                this.store.dispatch(new ChangeEventSaveToCalender({ calendar: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.From: {
                this.store.dispatch(new ChangeEventRepeatRangeStart({ start: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.To: {
                this.store.dispatch(new ChangeEventRepeatRangeEnd({ end: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.Reminder: {
                this.store.dispatch(new ChangeEventReMinder({ reminderMinutesBeforeStart: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.ShowAs: {
                this.store.dispatch(new ChangeEventShowAs({ showAs: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.Body: {
                this.store.dispatch(new ChangeEventBody({ body: updateInfo.info }));
                break;
            }
            case UpdateDetailsKind.RequestResponses: {
                this.store.dispatch(new ChangeEventRequestresponses({ responseRequested: updateInfo.info }));
                break;
            }
            default: {
                break;
            }
            case UpdateDetailsKind.OnlineMeeting: {
                this.store.dispatch(new ChangeOnlineMeeting({ isOnline: updateInfo.info }));
                break;
            }
        }
    }

    saveAndSend(event: MsGraphBeta.Event) {
        this.store.dispatch(new SendCalanderEvent({ event: event }));
    }

    onEventDelete(event: MsGraphBeta.Event) {
        this.store.dispatch(new DeleteCalanderEvent({ event: event }));
    }

    onUploadAttachmnet(attachmentData: { attachment: FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }) {
        this.store.dispatch(new AddAttachment(attachmentData));
    }

    onDeleteAttachmnet(attachmentData: { event: MsGraphBeta.Event, attachmentId: string }) {
        this.store.dispatch(new DeleteAttachment(attachmentData));
    }

    public onViewAttachement(attachmentData: { itemId: string, attachement: Attachment, urlCache: null }) {
        this.store.dispatch(new OpenEmailAttachemnt({ ...attachmentData, owner: 'me' }));
    }
    public downloardFileAttachment(attachmentData: { itemId: string, attachment: Attachment, type }) {
        this.store.dispatch(new DownloadAttachment(attachmentData));
    }
    public onCancelEvent(info: { event: MsGraphBeta.Event, comment: string, sendResponse: boolean, type: string, isSeries: boolean }) {
        this.store.dispatch(new ResponseCalendarEvent(info));
    }
    public editPopupClose(attachmentChange: boolean, event: MsGraphBeta.Event, type) {
        this.store.dispatch(new EventEditPopupClose({ attachmentChange, event, type }));
    }
    private getLastInlineAttachmentByToken() {
        return this.store.select(getLastInlineAttachment).pipe(
            switchMap(item => {
                if (item) {
                    return this.urlResolver.getAttachementDownloadUrl('me', null, null, item.attachment, false).pipe(
                        map((path) => ({ ...item, downloadUrl: path })));
                } else {
                    return empty();
                }
            }));
    }
    private resoleEventBody() {
        return this.store.select(getEditEvent).pipe(
            switchMap(event => {
                if (event && event.body.contentType === 'html') {
                    return fromPromise(
                        this.bodyHandlerService
                            .substituteInlineAttachementPath('me', event.body.content, event.attachments, event.id, 'events')).pipe(
                                map(newBody => {
                                    return { ...event, body: { ...event.body, content: newBody } };
                                }));
                } else {
                    return of(event);
                }
            }));
    }

}
