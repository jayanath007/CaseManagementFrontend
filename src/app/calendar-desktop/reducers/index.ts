import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as sidenave from './side-nav';
import * as calendar from './calendar';

export interface State {
    sidenave: sidenave.State;
    calendar: calendar.State;
}

export const reducers = {
    sidenave: sidenave.reducer,
    calendar: calendar.reducer
};

export const getRootState = createFeatureSelector<State>('dpsCalendarDesktop');

export const getSidenaveState = createSelector(getRootState, (state) => state.sidenave);
export const getIsStartSidenaveOpened = createSelector(getSidenaveState, sidenave.getIsStartSidenaveOpened);
export const getIsEndSidenaveOpened = createSelector(getSidenaveState, sidenave.getIsEndSidenaveOpened);
export const getIsEndSidenaveEnabled = createSelector(getSidenaveState, sidenave.getIsEndSidenaveEnabled);

export const getCalendarState = createSelector(getRootState, (state) => state.calendar);
export const getCurrentView = createSelector(getCalendarState, calendar.getCurrentView);
// export const getCurrentDate = createSelector(getCalendarState, calendar.getCurrentDate);
export const getCurrentTitle = createSelector(getCalendarState, calendar.getCurrentTitle);
export const getShowBusinessHours = createSelector(getCalendarState, calendar.getShowBusinessHours);
