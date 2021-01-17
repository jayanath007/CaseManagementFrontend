import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as taskAddEdit from './task-add-edit';

export interface State {
    taskAddEdit: taskAddEdit.State;
}
export const reducers = {
    taskAddEdit: taskAddEdit.reducer,
};

export const getAddEditTaskRootState = createFeatureSelector<State>('dpsAddEditTaskCore');
export const getTaskAddEditState = createSelector(getAddEditTaskRootState, (state) => state.taskAddEdit);

export const getFeeEarners = createSelector(getTaskAddEditState, taskAddEdit.getFeeEarners);
export const getAddEditTaskLoadingByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getTaskLoadingByToken(token));
export const getTaskAddEditFeeEarnerListNoByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getFeeEarnerListByToken(token));
export const getTaskAddEditFolderListByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getFolderListByToken(token));
export const getTaskAddEditActionTypeListByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getActionTypeListByToken(token));
export const getTaskAddEditSelectedFeeEarnerByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getSelectedFeeEarnerByToken(token));
export const getTaskAddEditDefaultFolderByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getDefaultFolderByToken(token));
export const getTaskAddEditMatterInfoByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getMatterInfoByToken(token));
export const getTaskAddEditgetLoginUserByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getLoginUserByToken(token));
export const getTaskAddEditHeaderTextByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getHeaderTextByToken(token));
export const getTaskAddEditDocumentFlowStatusByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getDocumentFlowStatusByToken(token));
export const getTaskAddEditIsDirtyByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getIsDirtyByToken(token));
export const getTaskAddEditDateByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getDateByToken(token));
export const getTaskAddEditNoteByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getNoteByToken(token));
export const getTaskAddEditFileDataInfoByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getFileDataInfoByToken(token));
export const getTaskAddEditFilePassWordDataByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getFilePassWordDataByToken(token));
export const getTaskAddEditSaveByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getTaskAddEditSaveDataByToken(token));
export const getTaskAddEditInfoMsgByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getInfoMsgByToken(token));
export const getTaskAddEditHasPasswordByToken = (token) =>
    createSelector(getTaskAddEditState, taskAddEdit.getHasPasswordByToken(token));



