import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as compose from './compose';

export interface State {
    compose: compose.State;
}
export const reducers = {
    compose: compose.reducer,
};
export const getComposeRootState = createFeatureSelector<State>('dpsComposeMail');
export const getComposeState = createSelector(getComposeRootState, (state => state.compose));
export const getComposeStateByToken = (token) => createSelector(getComposeState, compose.getComposeItemViewByToken(token));
export const getComposeItemByToken = (token) => createSelector(getComposeState, compose.getComposeItemByToken(token));
export const getRefItemByToken = (token) => createSelector(getComposeState, compose.getRefItemByToken(token));
export const getFollowUpTextByToken = (token) => createSelector(getComposeState, compose.getFollowUpTextByToken(token));
export const getIsMailSendingByToken = (token) => createSelector(getComposeState, compose.getIsMailSendingByToken(token));
export const getIsSendFailByToken = (token) => createSelector(getComposeState, compose.getIsSendFailByToken(token));
export const getIsMailSavingByToken = (token) => createSelector(getComposeState, compose.getIsMailSavingByToken(token));
export const getIsMailDeleteingByToken = (token) => createSelector(getComposeState, compose.getIsMailDeleteingByToken(token));
export const getIsAttachmentsUplodingByToken = (token) => createSelector(getComposeState, compose.getIsAttachmentsUplodingByToken(token));
export const getIsAttachmentsDeletingByToken = (token) => createSelector(getComposeState, compose.getIsAttachmentsDeletingByToken(token));
export const getIsComposeCloseItemByToken = (token) => createSelector(getComposeState, compose.getIsComposeCloseItemByToken(token));
export const getInlineAttachmentsByToken = (token) => createSelector(getComposeState, compose.getInlineAttachmentsByToken(token));
export const getListAttachmentsByToken = (token) => createSelector(getComposeState, compose.getListAttachmentsByToken(token));
export const getLastInlineAttachmentByToken = (token) => createSelector(getComposeState, compose.getLastInlineAttachmentByToken(token));
export const getIsDirtyByToken = (token) => createSelector(getComposeState, compose.getIsDirtyByToken(token));
