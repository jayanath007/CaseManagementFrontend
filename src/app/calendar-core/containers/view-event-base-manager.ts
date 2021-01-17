
import { switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of, Observable, from as fromPromise } from 'rxjs';
import { getFreeBusyStatusList, getReminderList, getCalendarEventById } from '../reducers';
import { UpdateCalendarEvent, DownloadAttachment } from '../actions/event';
import { OpenEmailAttachemnt } from '../../document-view';
import { EventBaseCommonActionsManager } from './event-base-common-actions-manager';
import { BodyHandlerService } from '../../organizer-desktop-shared';

export class ViewEventBaseManager extends EventBaseCommonActionsManager {
    public event$: Observable<any>;
    public freeBusyStatusList$: any;
    public reminderList$: any;

    constructor(protected store: Store<any>, protected bodyHandlerService: BodyHandlerService) {
        super(store);
        this.freeBusyStatusList$ = store.select(getFreeBusyStatusList);
        this.reminderList$ = store.select(getReminderList);

    }
    getCalendarEventById(calendarId, eventId) {
        this.event$ = this.store.select(getCalendarEventById(calendarId, eventId));
        this.event$ = this.event$.pipe(switchMap((item) => {
            if (item && item.data.body.contentType === 'html') {
                return fromPromise(
                    this.bodyHandlerService
                        .substituteInlineAttachementPath('me', item.data.body.content, item.data.attachments, item.data.id, 'events')).pipe(
                            map((newBody) => {
                                return { ...item, data: { ...item.data, ...{ body: { ...item.data.body, content: newBody } } } };
                            }));
            } else {
                return of(item);
            }
        }));
    }

    public onReminderChange(event) {
        this.store.dispatch(new UpdateCalendarEvent(
            {
                calendarId: event.calendarId, eventId: event.eventId,
                event: { reminderMinutesBeforeStart: event.reminderMinutesBeforeStart },
                isSeries: event.isSeries
            })
        );
    }
    public onSeriesUpdate(event) {
        this.store.dispatch(new UpdateCalendarEvent(
            {
                calendarId: event.calendarId, eventId: event.eventId,
                event: event.event,
                isSeries: event.isSeries
            })
        );
    }

    public onSensitivityChange(event) {
        this.store.dispatch(new UpdateCalendarEvent(
            { calendarId: event.calendarId, eventId: event.eventId, event: { sensitivity: event.sensitivity }, isSeries: event.isSeries })
        );
    }

    public openAttachement({ event, attachment }) {
        this.store.dispatch(new OpenEmailAttachemnt({ owner: 'me', itemId: event.data.id, attachement: attachment }));
    }
    public onDownloardFileAttachment({ eventId, attachment, type }) {
        this.store.dispatch(new DownloadAttachment({ itemId: eventId, attachment: attachment, type }));
    }
}
