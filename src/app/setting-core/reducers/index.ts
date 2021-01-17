
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as settings from './settings';

export interface State {
    dpsSetting: settings.State;
}
export const reducers = {
    dpsSetting: settings.reducer,
};

export const getSettingRootState = createFeatureSelector<State>('dpsSettingCore');
export const getDpsSettingState = createSelector(getSettingRootState, (state => state.dpsSetting));

export const getHomeCurrency = () => createSelector(getDpsSettingState, settings.getHomeCurrency());
export const getTimeZones = () => createSelector(getDpsSettingState, settings.getTimeZones());
export const getDiaryModeCurrentUser = () => createSelector(getDpsSettingState, settings.getDiaryModeCurrentUser());
export const getTimeUseFeeEarnerGradesValueDisable = () =>
    createSelector(getDpsSettingState, settings.getTimeUseFeeEarnerGradesValueDisable());
export const getPostingPeriod = () => createSelector(getDpsSettingState, settings.getPostingPeriod());
// export const getGlobalSignatureForTemplete = (templete: string) =>
//     createSelector(getDpsSettingState, settings.getGlobalSignatureForTemplete(templete));
// export const getGlobalSignatureTemp = () => createSelector(getDpsSettingState, settings.getGlobalSignatureTemp());
// export const getGlobalSignature  = () => createSelector(getDpsSettingState, settings.getGlobalSignature());
