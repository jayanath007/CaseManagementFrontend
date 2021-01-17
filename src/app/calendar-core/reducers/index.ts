import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as editEvent from './edit-event';
import * as calendarFolder from './calendar-folder';
import * as event from './event';
export interface State {
    editEvent: editEvent.State;
    calendarFolder: calendarFolder.State;
    event: event.State;
}
export const reducers = {
    editEvent: editEvent.reducer,
    calendarFolder: calendarFolder.reducer,
    event: event.reducer
};

export const getRootState = createFeatureSelector<State>('dpsCalendarCore');

export const getEditEventState = createSelector(getRootState, (state) => state.editEvent);
export const getEditEvent = createSelector(getEditEventState, editEvent.getEvent);
export const getDayOfWeekList = createSelector(getEditEventState, editEvent.getDayOfWeekList);
export const getFreeBusyStatusList = createSelector(getEditEventState, editEvent.getFreeBusyStatusList);
export const getMonthList = createSelector(getEditEventState, editEvent.getMonthList);
export const getReminderList = createSelector(getEditEventState, editEvent.getReminderList);
export const getRepeatList = createSelector(getEditEventState, editEvent.getRepeatList);
export const getTimeList = createSelector(getEditEventState, editEvent.getTimeList);
export const getWeekIndexList = createSelector(getEditEventState, editEvent.getWeekIndexList);
export const getIsSending = createSelector(getEditEventState, editEvent.getIsSending);
export const getIsSent = createSelector(getEditEventState, editEvent.getIsSent);
export const getIsDeleting = createSelector(getEditEventState, editEvent.getIsDeleting);
export const getOptionalAttendees = createSelector(getEditEventState, editEvent.getOptionalAttendees);
export const getRequiredAttendees = createSelector(getEditEventState, editEvent.getRequiredAttendees);
export const getRepeatType = createSelector(getEditEventState, editEvent.getRepeatType);
export const getIsDirty = createSelector(getEditEventState, editEvent.getIsDirty);
export const getIsNewEvent = createSelector(getEditEventState, editEvent.getIsNewEvent);
export const getAttachmentList = createSelector(getEditEventState, editEvent.getAttachmentList);
export const getIsAttachmentsUploding = createSelector(getEditEventState, editEvent.getIsAttachmentsUploding);
export const getIsAttachmentChange = createSelector(getEditEventState, editEvent.getIsAttachmentChange);
export const getLastInlineAttachment = createSelector(getEditEventState, editEvent.getLastInlineAttachment);
export const getIsEventIdCreating = createSelector(getEditEventState, editEvent.getIsEventIdCreating);
export const getRooms = createSelector(getEditEventState, editEvent.getRooms);

export const getCalendarFolderState = createSelector(getRootState, (state) => state.calendarFolder);
export const getCalendarGroups = createSelector(getCalendarFolderState, calendarFolder.getCalendarGroups);
export const getIsCalendarFolderInit = createSelector(getCalendarFolderState, calendarFolder.getIsCalendarFolderInit);
export const getSelectedCalendarIds = createSelector(getCalendarFolderState, calendarFolder.getSelectedCalendarIds);
export const getCalendarItemByIdSet = (groupId, calendarId) =>
    createSelector(getCalendarFolderState, calendarFolder.getCalendarItemByIdSet(groupId, calendarId));
export const getCalendarItemById = (calendarId) =>
    createSelector(getCalendarFolderState, calendarFolder.getCalendarItemById(calendarId));
export const getAllCalendars = createSelector(getCalendarFolderState, calendarFolder.getAllCalendars);
export const getDefaultCalendar = createSelector(getCalendarFolderState, calendarFolder.getDefaultCalendar);
export const getIsLoading = createSelector(getCalendarFolderState, calendarFolder.getIsLoading);
export const getCanEditCalendars = createSelector(getCalendarFolderState, calendarFolder.getCanEditCalendars);

export const getEventState = createSelector(getRootState, (state) => state.event);
export const getCurrentDateRange = createSelector(getEventState, event.getCurrentDateRange);
export const getCurrentViewType = createSelector(getEventState, event.getCurrentViewType);
export const getSelectedDate = createSelector(getEventState, event.getSelectedDate);
export const getCalendarViewById = (id) => createSelector(getEventState, event.getCalendarViewById(id));
export const getCalendarLoadedHashsById = (calendarId) => createSelector(getEventState, event.getCalendarLoadedHashsById(calendarId));
export const getCalendarViewList = createSelector(getEventState, event.getCalendarViewList);
export const getAllEvents = createSelector(getEventState, event.getAllEvents);
export const getAllCalendarEventsOfSelectedDate = createSelector(getEventState, event.getAllCalendarEventsOfSelectedDate);
export const getCalendarEventById = (calendarId, eventId) => createSelector(getEventState, event.getCalendarEventById(calendarId, eventId));





