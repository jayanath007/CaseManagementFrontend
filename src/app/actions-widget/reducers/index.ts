import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as actionsWidget from './actions-widegt';

export interface State {
    actionsWidget: actionsWidget.ActionWidgetState;
}
export const reducers = {
    actionsWidget: actionsWidget.reducer,
};

export const getActionWidgetRootState = createFeatureSelector<State>('dpsActionsCore');
export const getAddNoteState = createSelector(getActionWidgetRootState, (state => state.actionsWidget));
export const getIsBMDataLoadingByToken = () => createSelector(getAddNoteState, actionsWidget.getIsBMDataLoading());

