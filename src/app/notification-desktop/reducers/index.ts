import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as newMail from './new-mail';
import * as reminders from './reminders';

export interface State {
  newMail: newMail.State;
  reminders: reminders.State;
}

export const reducers = {
  newMail: newMail.reducer,
  reminders: reminders.reducer
};

export const getNotificationState = createFeatureSelector<State>('dpsNotification');
export const getNewMailState = createSelector(getNotificationState, (state) => state.newMail);
export const getReminders = createSelector(getNotificationState, (state) => state.reminders);

export const showNewEmailList = createSelector(getNewMailState, newMail.showList);
export const showLastEmailEvent = createSelector(getNewMailState, newMail.showLastEvent);
export const getNewEmailList = createSelector(getNewMailState, newMail.getList);
export const getNewMailLatestEvent = createSelector(getNewMailState, newMail.getLatestEvent);

export const getAllReminders = createSelector(getReminders, reminders.getAllReminders);
export const getShowLastReminder = createSelector(getReminders, reminders.getShowLastReminder);
export const getNewReminders = createSelector(getReminders, reminders.getNewReminders);
export const getCurentTime = createSelector(getReminders, reminders.getCurentTime);

export const getAutoRepy = createSelector(getReminders, reminders.getAutoRepy);
export const showAutoRepyMsg = createSelector(getReminders, reminders.showAutoRepyMsg);




