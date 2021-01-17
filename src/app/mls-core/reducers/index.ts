import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as CaseMLS from './mls';

export interface State {
    CaseMLS: CaseMLS.State;
}

export const reducers = {
    CaseMLS: CaseMLS.reducer,
};

export const getCaseMLSRootState = createFeatureSelector<State>('dpsCaseMlsCore');
export const getCaseMLSState = createSelector(getCaseMLSRootState, (state => state.CaseMLS));
export const getCaseMLSStateByToken = (token) => createSelector(getCaseMLSState, CaseMLS.getStateByToken(token));
export const getIsChatListLoading = (token) => createSelector(getCaseMLSState, CaseMLS.getIsChatListLoading(token));
export const getMatterDetails = (token) => createSelector(getCaseMLSState, CaseMLS.getMatterDetails(token));
export const getCaseUsersByToken = (token) => createSelector(getCaseMLSState, CaseMLS.getCaseUsers(token));
export const getIsChatMessageLoadingByToken = (token) => createSelector(getCaseMLSState, CaseMLS.getIsChatMessageLoading(token));
export const getMessageListByToken = (token) => createSelector(getCaseMLSState, CaseMLS.getMessageList(token));
export const getSelectedUserByToken = (token) => createSelector(getCaseMLSState, CaseMLS.getSelectedUser(token));
export const getIsSendingByToken = (token) => createSelector(getCaseMLSState, CaseMLS.getIsSending(token));
export const hasNotLoadedItemByToken = (token) => createSelector(getCaseMLSState, CaseMLS.hasNotLoadedItem(token));







