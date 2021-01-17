
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as initialSettings from './initial-settings';

export interface State {
    initialSettings: initialSettings.State;
}
export const reducers = {
    initialSettings: initialSettings.reducer,
};
export const getInitialSettingsRootState = createFeatureSelector<State>('dpsInitialSettingsCore');
export const getInitialSettingsState = createSelector(getInitialSettingsRootState, (state => state.initialSettings));
export const getInitialSettingStateByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getViewByToken(token));

export const getInitialSettingsTimeZonesByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getTimeZonesByToken(token));
export const getInitialSettingsUserTimeZoneByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getUserTimeZoneByToken(token));

    export const getInitialSettingsLanguagesByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getLanuagesByToken(token));
export const getInitialSettingsUserLanguageByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getUserLanguageByToken(token));

export const getInitialSettingsFullUserTimeZoneByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getFullUserTimeZoneByToken(token));

export const getInitialSettingsIsLoadingByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getIsLoadingByToken(token));

    export const getInitialSettingsIsIsUpdatingByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getIsUpdatingByToken(token));

    export const getInitialSettingsIsUpdateSuccessByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getIsUpdateSuccessByToken(token));

    export const getInitialSettingsIsUpdateFailByToken = (token) =>
    createSelector(getInitialSettingsState, initialSettings.getIsUpdateFailByToken(token));


