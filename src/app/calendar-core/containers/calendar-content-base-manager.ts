import { LoadSingleCalendarEvent, LoadSeariesData } from '../actions/event';
import { Store } from '@ngrx/store';
import * as MsGraphBeta from '../../core/lib/microsoft-graph';
import { AddEvent } from '../actions/edit-event';
import { ToggleCalendarGroupExpand, UnselectCalendar } from '../actions/calendar-folder';
import { getCalendarViewList, getAllEvents, getSelectedDate, getAllCalendarEventsOfSelectedDate, getDefaultCalendar } from '../reducers';
import { CloseCalendar, SetCalendarView, LoadCalendarEventsOnViewChange, ChangeSelectedDate } from '../actions/event';
import { of } from 'rxjs';
import { EventBaseCommonActionsManager } from './event-base-common-actions-manager';

export class CalendarContentBaseManager extends EventBaseCommonActionsManager {
    constructor(protected store: Store<any>) {
        super(store);
    }

    public onEditEvent(event: MsGraphBeta.Event) {
        this.store.dispatch(new AddEvent({ event: event }));
    }

    public getCalendarViewList() {
        return this.store.select(getCalendarViewList);
    }

    public getcalendarEventList() {
        return this.store.select(getAllEvents);
    }
    public getSelectedDate() {
        return this.store.select(getSelectedDate);
    }
    public getDefaultCalendar() {
        return this.store.select(getDefaultCalendar);
    }
    public getAllCalendarEventsOfSelectedDate() {
        return this.store.select(getAllCalendarEventsOfSelectedDate);
    }

    public onRemoveCalendar(event: { calendarId: string, groupId: string }) {
        this.store.dispatch(new UnselectCalendar(event));
    }

    public onViewChanged(event: { start: string, end: string, viewType: { type: string, startDay: number } }) {
        this.store.dispatch(new SetCalendarView({ startDate: event.start, endDate: event.end, viewType: event.viewType }));
    }

    public onLoadCalendarEvents(event: { calendarId: string, groupId: string }) {
        this.store.dispatch(new LoadCalendarEventsOnViewChange({ calendarId: event.calendarId, groupId: event.groupId }));
    }

    public onChangeSelectedDate(event) {
        this.store.dispatch(new ChangeSelectedDate({ date: event }));
    }

    public onLoadSingleCalendarEvent(event: { calendarId: string, eventId: string }) {
        this.store.dispatch(new LoadSingleCalendarEvent({ calendarId: event.calendarId, eventId: event.eventId }));
    }

    public onEditSeriesEvent(event) {
        this.store.dispatch(new LoadSeariesData({ event: event }));
    }
}
