import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as CaseTask from './case-task';

export interface State {
    CaseTask: CaseTask.State;
}
export const reducers = {
    CaseTask: CaseTask.reducer,
};

export const getCaseTaskRootState = createFeatureSelector<State>('dpsCaseTask');
export const getCaseTaskState = createSelector(getCaseTaskRootState, (state) => state.CaseTask);
export const getCaseTaskByToken = (token) => createSelector(getCaseTaskState, CaseTask.getViewByToken(token));
export const getCaseTaskListByToken = (token) => createSelector(getCaseTaskState, CaseTask.getCaseTaskListByToken(token));
export const getCaseTaskHashByToken = (token) => createSelector(getCaseTaskState, CaseTask.getCurrentHashByToken(token));
export const getCaseTaskColumnDefByToken = (token) => createSelector(getCaseTaskState, CaseTask.getColumnDefByToken(token));
export const getCaseTaskGridDataByToken = (token) =>
    createSelector(getCaseTaskState, CaseTask.getCaseTaskGridDataByToken(token));
export const getCaseTaskSearchTextByToken = (token) => createSelector(getCaseTaskState, CaseTask.getSearchTextByToken(token));
export const getCaseTaskPageEventByToken = (token) =>
    createSelector(getCaseTaskState, CaseTask.getCaseTaskPageEventByToken(token));
export const  getIsDataLoadedByToken = (token) => createSelector(getCaseTaskState, CaseTask.getIsDataLoadedByToken(token));
