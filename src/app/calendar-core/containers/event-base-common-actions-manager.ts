import { Store } from '@ngrx/store';
import { UpdateCalendarEvent, ResponseCalendarEvent, RemoveCalendarEvent, CreateReplyForward } from '../actions/event';

export class EventBaseCommonActionsManager {

    constructor(protected store: Store<any>) {

    }

    public onShowAsStateChange(event) {
        this.store.dispatch(new UpdateCalendarEvent(
            { calendarId: event.calendarId, eventId: event.eventId, event: { showAs: event.showAs }, isSeries: event.isSeries })
        );
    }
    public onResponse(event) {
        this.store.dispatch(new ResponseCalendarEvent(event));
    }
    public onRemoveFromCalendar(event) {
        this.store.dispatch(new RemoveCalendarEvent(event));
    }
    public onReplyForward(event) {
        this.store.dispatch(new CreateReplyForward(event));
    }
    public onEventDateTimeChange(event) {
        this.store.dispatch(new UpdateCalendarEvent(
            { calendarId: event.calendarId, eventId: event.eventId, event: event.event, isSeries: event.isSeries }));
    }
}
