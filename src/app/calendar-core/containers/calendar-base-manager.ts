import * as calendarFolder from '../actions/calendar-folder';
import { Store } from '@ngrx/store';
import { getCalendarGroups, getAllCalendars, getIsLoading } from '../reducers';
import { CalendarItem, CalendarGroupItemWrapper } from '..';
import { Calendar } from '../../core/lib/microsoft-graph';
import { CalendarGroupEditMode, FolderEditKind, CalendarEditMode } from '../../core/organizer/enums';
import { CalendarItemWrapper } from '../models/interfaces';
import { AddEvent } from '../actions/edit-event';

export interface CalendarGroupMenuAction {
    type: CalendarGroupEditMode;
    payload: { kind: FolderEditKind, value?: string, item?: CalendarGroupItemWrapper };
}

export interface CalendarMenuAction {
    type: CalendarEditMode;
    payload: { kind: FolderEditKind, value?: string, item?: CalendarItemWrapper };
}

export class CalendarBaseManager {
    calendarGroups$: any;
    allCalendars$: any;
    isLoading$: any;
    constructor(protected store: Store<any>) {
        this.store.dispatch(new calendarFolder.InitCalendarFolderCore());
        this.calendarGroups$ = this.store.select(getCalendarGroups);
        this.allCalendars$ = this.store.select(getAllCalendars);
        this.isLoading$ = this.store.select(getIsLoading);
    }
    public onCalendarGroupToggle(groupId: string) {
        this.store.dispatch(new calendarFolder.ToggleCalendarGroupExpand({ groupId: groupId }));
    }
    public onToggleCalendar(data: CalendarItem<Calendar>) {
        this.store.dispatch(new calendarFolder.ToggleCalendarSelect({ calendar: data }));
    }
    public onEditEvent(event) {
        this.store.dispatch(new AddEvent({ event: event }));
    }

    public onCalendarGroupEditOperations({ type, payload }: CalendarGroupMenuAction) {

        if (payload.kind === FolderEditKind.Init) {
            this.store.dispatch(new calendarFolder.ActivateCalendarGroupEditMode({
                item: payload.item,
                editMode: type
            }));
        }

        if (payload.kind === FolderEditKind.Confirm || payload.kind === FolderEditKind.Reject) {
            if (type === CalendarGroupEditMode.Delete) {
                if (payload.kind === FolderEditKind.Confirm) {
                    this.store.dispatch(new calendarFolder.DeleteCalendarGroup({ item: payload.item }));
                }
            } else {
                const confirm: boolean = payload.kind === FolderEditKind.Confirm;
                this.store.dispatch(new calendarFolder.FinalizeCalendarGroupEditMode({
                    item: payload.item,
                    editMode: type,
                    confirm: confirm,
                    value: payload.value,
                    groupId: payload.item.data.id
                }));
            }
        }
    }

    public onCalendarEditOperations({ type, payload }: CalendarMenuAction) {
        if (payload.kind === FolderEditKind.Init) {
            this.store.dispatch(new calendarFolder.ActivateCalendarItemEditMode({
                calendar: payload.item,
                editMode: type
            }));
        }

        if (payload.kind === FolderEditKind.Confirm || payload.kind === FolderEditKind.Reject) {
            if (type === CalendarEditMode.Delete) {
                if (payload.kind === FolderEditKind.Confirm) {
                    this.store.dispatch(new calendarFolder.DeleteCalendarItem({ item: payload.item }));
                }
            } else {

                const confirm: boolean = payload.kind === FolderEditKind.Confirm;
                this.store.dispatch(new calendarFolder.FinalizeCalendarEditMode({
                    calendar: payload.item,
                    editMode: type,
                    confirm: confirm,
                    value: payload.value
                }));
            }
        }
    }
}
