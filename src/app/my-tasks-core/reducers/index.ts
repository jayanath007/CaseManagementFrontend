import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as myTask from './my-tasks';

export interface State {
    myTask: myTask.State;
}

export const reducers = {
    myTask: myTask.reducer,
};

export const getMyTasksRootState = createFeatureSelector<State>('dpsMyTaskCore');
export const getMyTasksState = createSelector(getMyTasksRootState, (state => state.myTask));
export const getMyTasksStateByToken = (token) => createSelector(getMyTasksState, myTask.getStateByToken(token));
export const getMyTasksIsLoadingByToken = (token) => createSelector(getMyTasksState, myTask.getIsloadingByToken(token));
export const getMyTasksColumnDefByToken = (token) => createSelector(getMyTasksState, myTask.getColumnDefByToken(token));
export const getMyTasksUserPermisionByToken = (token) => createSelector(getMyTasksState, myTask.getUserPermisionByToken(token));
export const getMyTasksPeginatorDefByToken = (token) => createSelector(getMyTasksState, myTask.getPeginatorDefByToken(token));
export const getMyTasksDepartmentsByToken = (token) => createSelector(getMyTasksState, myTask.getDepartmentByToken(token));
export const getMyTasksSelectedInfoByToken = (token) => createSelector(getMyTasksState, myTask.getSelectedInfoByToken(token));
export const getMyTasksGridDataByToken = (token) => createSelector(getMyTasksState, myTask.getGridDataByToken(token));
export const getMyTasksTotalItemByToken = (token) => createSelector(getMyTasksState, myTask.getTotalItemByToken(token));
export const getMyTaskSummeryByToken = (token) => createSelector(getMyTasksState, myTask.getSummeryByToken(token));
export const getMyTaskMsgByToken = (token) => createSelector(getMyTasksState, myTask.getMsgByToken(token));
export const getGroupDataByToken = (token) => createSelector(getMyTasksState, myTask.getGroupDataByToken(token));
export const getSelectGroupModeByToken = (token) => createSelector(getMyTasksState, myTask.getSelectGroupModeByToken(token));
export const getMytaskGroupDataByRow = (token, row) => createSelector(getMyTasksState, myTask.getMytaskGroupDataByRow(token, row));


















