
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as organizerSettings from './organizer-settings';

export interface State {
    organizerSettings: organizerSettings.State;
}
export const reducers = {
    organizerSettings: organizerSettings.reducer,
};
export const getOrganizerSettingsRootState = createFeatureSelector<State>('dpsOrganizerSettingsCore');
export const getOrganizerSettingsState = createSelector(getOrganizerSettingsRootState, (state => state.organizerSettings));
export const getOrganizerSettingStateByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getViewByToken(token));
export const getOrganizerSettingsIsChaserEnableByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsChaserEnableByToken(token));
export const getOrganizerSettingsIsSignatureAutoAddByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsSignatureAutoAddByToken(token));
export const getOrganizerSettingsUserResponseByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getUserResponseByToken(token));
export const getOrganizerSettingSignatureByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getSignatureByToken(token));
export const getOrganizerSettingsTimeZonesByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getTimeZonesByToken(token));
export const getOrganizerSettingsUserTimeZoneByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getUserTimeZoneByToken(token));
export const getOrganizerSettingsAutomaticRepliesSettingByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getAutomaticRepliesSettingByToken(token));
export const getOrganizerSettingsFullUserTimeZoneByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getFullUserTimeZoneByToken(token));

export const getOrganizerSettingsIsExtensionsSaveSuccessByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsExtensionsSaveSuccessByToken(token));

export const getOrganizerSettingsIsSignatureSaveSuccessByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsSignatureSaveSuccessByToken(token));

export const getOrganizerSettingsIsTimeZoneSaveSaveSuccessByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsTimeZoneSaveSuccessByToken(token));

export const getOrganizerSettingsIsLoadingByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsLoadingByToken(token));

export const getOrganizerSettingsIsAllSettingSSaveSuccessByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsAllSettingSSaveSuccessByToken(token));

export const getOrganizerSettingsIsAllSettingSSaveFailByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsAllSettingSSaveFailByToken(token));
export const getReminderSoundEnableByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getReminderSoundEnableByToken(token));
export const getNewMailSoundEnableByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getNewMailSoundEnableByToken(token));
export const getMessageFormatByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getMessageFormatByToken(token));
export const getIsGlobalSignatureByToken = (token) =>
    createSelector(getOrganizerSettingsState, organizerSettings.getIsGlobalSignatureByToken(token));

