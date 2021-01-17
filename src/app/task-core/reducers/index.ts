import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as Task from './task-core';

export interface State {
    Task: Task.State;
}
export const reducers = {
    Task: Task.reducer,
};

export const getTaskRootState = createFeatureSelector<State>('dpsTask');
export const getTaskState = createSelector(getTaskRootState, (state) => state.Task);
export const getTaskByToken = (token) => createSelector(getTaskState, Task.getViewByToken(token));
export const getTaskListByToken = (token) => createSelector(getTaskState, Task.getTaskListByToken(token));
export const getTaskHashByToken = (token) => createSelector(getTaskState, Task.getCurrentHashByToken(token));
export const getTaskGridDataByToken = (token) =>
    createSelector(getTaskState, Task.getTaskGridDataByToken(token));
export const getTaskSearchTextByToken = (token) => createSelector(getTaskState, Task.getSearchTextByToken(token));
export const getTaskPageEventByToken = (token) =>
    createSelector(getTaskState, Task.getTaskPageEventByToken(token));
export const  getIsDataLoadedByToken = (token) => createSelector(getTaskState, Task.getIsDataLoadedByToken(token));
