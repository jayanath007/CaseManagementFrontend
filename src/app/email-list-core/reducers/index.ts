import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as emaiList from './email-list';

export interface State {
    emaiList: emaiList.State;
}
export const reducers = {
    emaiList: emaiList.reducer,
};
export const getRootState = createFeatureSelector<State>('dpsEmaiList');
export const getEmaiListState = createSelector(getRootState, (state => state.emaiList));
export const getEmailList = createSelector(getEmaiListState, emaiList.getEmailList);
export const getLoading = createSelector(getEmaiListState, emaiList.getLoading);
export const getClosePopup = createSelector(getEmaiListState, emaiList.getClosePopup);
export const getShare = createSelector(getEmaiListState, emaiList.getShare);
export const getReviewDate = createSelector(getEmaiListState, emaiList.getReviewDate);
export const getReviewNote = createSelector(getEmaiListState, emaiList.getReviewNote);
export const getMessage = createSelector(getEmaiListState, emaiList.getMessage);
export const getIsSilent = createSelector(getEmaiListState, emaiList.getIsSilent);






