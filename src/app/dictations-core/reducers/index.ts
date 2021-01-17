import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as dictations from './dictations';
import * as audioPlayear from './audio-player';

export interface State {
    dictations: dictations.State;
    audioPlayear: audioPlayear.State;
}
export const reducers = {
    dictations: dictations.reducer,
    audioPlayear: audioPlayear.reducer,
};

export const getDictationsRootState = createFeatureSelector<State>('dpsDictations');


export const getDictationsState = createSelector(getDictationsRootState, (state => state.dictations));

export const getDictationsStateByToken = (token) => createSelector(getDictationsState,
    dictations.getStateByToken(token));
export const getLoadingByToken = (token) =>
    createSelector(getDictationsState, dictations.getLoadingByToken(token));
export const getDictationsColumnDefByToken = (token) =>
    createSelector(getDictationsState, dictations.getColumnDefByToken(token));
export const getUserTypeByToken = (token) =>
    createSelector(getDictationsState, dictations.getUserTypeByToken(token));
export const getDictationGridFilterByToken = (token) =>
    createSelector(getDictationsState, dictations.getDictationGridFilterByToken(token));
export const getMatterRefByToken = (token) =>
    createSelector(getDictationsState, dictations.getMatterRefByToken(token));
export const getDictationGridDataByToken = (token) =>
    createSelector(getDictationsState, dictations.getDictationGridDataByToken(token));
export const getGroupListByToken = (token) =>
    createSelector(getDictationsState, dictations.getGroupListByToken(token));
export const getDictationStateCountsByToken = (token) =>
    createSelector(getDictationsState, dictations.getDictationStateCountsByToken(token));
export const getAuthorListByToken = (token) =>
    createSelector(getDictationsState, dictations.getAuthorListByToken(token));

export const getGetCheckoutFileDetailByToken = (token) =>
    createSelector(getDictationsState, dictations.getGetCheckoutFileDetailByToken(token));
export const getStatusValueByToken = (token) =>
    createSelector(getDictationsState, dictations.getStatusValueByToken(token));
export const getCompleteRowItemByToken = (token) =>
    createSelector(getDictationsState, dictations.getCompleteRowItemByToken(token));
export const getSelectAuthorByToken = (token) =>
    createSelector(getDictationsState, dictations.getSelectAuthorByToken(token));
export const getuserValidationMessageByToken = (token) =>
    createSelector(getDictationsState, dictations.getuserValidationMessageByToken(token));
export const getGridPaginationDef = (token) => createSelector(getDictationsState, dictations.getGridPaginationDef(token));
export const getProfileSecrarary = (token) => createSelector(getDictationsState, dictations.getProfileSecrarary(token));
export const getprofileGroup = (token) => createSelector(getDictationsState, dictations.getprofileGroup(token));
export const getProfileLoading = (token) => createSelector(getDictationsState, dictations.getProfileLoading(token));
export const getProfileClose = (token) => createSelector(getDictationsState, dictations.getProfileClose(token));
export const getJobDescription = (token) => createSelector(getDictationsState, dictations.getJobDescription(token));


export const getAudioPlayerState = createSelector(getDictationsRootState, (state => state.audioPlayear));

export const getUrl = createSelector(getAudioPlayerState, audioPlayear.getUrl);
export const getTime = createSelector(getAudioPlayerState, audioPlayear.getTime);
export const getLoading = createSelector(getAudioPlayerState, audioPlayear.getLoading);

