import { FeeEarner, Folder, ActionType, GridData, MatterResponce, MSGInfo } from '../models/interface';

import { createSelector } from '@ngrx/store';
import * as TaskActions from '../actions/core';
import { DatePipe } from '@angular/common';
import { dpsNewDate } from '../../utils/javascriptDate';
import { Dictionary } from '../../core';

export interface State {
    readonly views: Dictionary<TaskAddEditState>;
    readonly feeEarnerList: FeeEarner[];
}

export interface TaskAddEditState {
    readonly initLoading: boolean;
    readonly addEditTaskLoading: boolean;
    readonly addEditTaskHeader: string;
    readonly disableFileUpload: boolean;
    readonly feeEarnerListLoading: boolean;
    readonly folderListLoading: boolean;
    readonly actionTypeLoading: boolean;
    readonly feeEarnerList: FeeEarner[];
    readonly folderList: Folder[];
    readonly defaultFolderId: number;
    readonly editSelectedFolderId: number;
    readonly actionTypeList: ActionType[];
    readonly selectedActionText: string;
    readonly selectMatter: string;
    readonly isDirty: boolean;
    readonly noteForDiary: string;
    readonly matterInfo: GridData;
    readonly headerText: string;
    readonly loginUser: string;
    readonly documentFlowStatus: string;
    readonly fileData: any;
    readonly filePassword: string;
    readonly taskDate: string;
    readonly infoMsg: MSGInfo;
    readonly requerPassword: boolean;
    readonly putOnBy: string;
    readonly template: string;
}

const initialState: State = {
    views: {},
    feeEarnerList: null
};

export function reducer(state = initialState, action: TaskActions.Any): State {
    const temp = {};
    switch (action.type) {
        case (TaskActions.INIT_ADD_EDIT_TASK):
            temp[action.token] = getAddEditTaskInit(state.views[action.token], action.payload.inputData, action.payload.timeOffset);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_FE_LIST_ADD_EDIT_TASK):
            temp[action.token] = getFeeEarnerList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_FE_LIST_ADD_EDIT_TASK_SUCCESS):
            temp[action.token] = getFeeEarnerListSuccess(state.views[action.token], action.payload.feeEarnerList);
            return { ...state, feeEarnerList: action.payload.feeEarnerList, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_FE_LIST_ADD_EDIT_TASK_FAIL):
            temp[action.token] = getFeeEarnerListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_FOLDER_LIST_ADD_EDIT_TASK):
            temp[action.token] = getFolderList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_FOLDER_LIST_ADD_EDIT_TASK_SUCCESS):
            temp[action.token] = getFolderListSuccess(state.views[action.token], action.payload.folderList);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_FOLDER_LIST_ADD_EDIT_TASK_FAIL):
            temp[action.token] = getFolderListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_ACTION_LIST_ADD_EDIT_TASK):
            temp[action.token] = getActionTypeList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_ACTION_LIST_ADD_EDIT_TASK_SUCCESS):
            temp[action.token] = getActionTypeListSuccess(state.views[action.token], action.payload.actionTypeList);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_ACTION_LIST_ADD_EDIT_TASK_FAIL):
            temp[action.token] = getActionTypeListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK):
            temp[action.token] = getFolderId(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_SUCCESS):
            temp[action.token] = getFolderIdSuccess(state.views[action.token], action.payload.folderId);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_FAIL):
            temp[action.token] = getFolderIdFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.CHANGE_FE_LIST_ADD_EDIT_TASK:
            temp[action.token] = changeFeeEarner(state.views[action.token], action.payload.selectedFeeEarner);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.CHANG_FOLDER_ADD_EDIT_TASK:
            temp[action.token] = changeFolder(state.views[action.token], action.payload.selectedFolder);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.CHANGE_ACTION_ADD_EDIT_TASK:
            temp[action.token] = changeActionType(state.views[action.token], action.payload.selectedActionType);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.TASK_ADD_EDIT_SELECTED_MATTER_DATA:
            temp[action.token] = setSelectedMatter(state.views[action.token], action.payload.selectedMatterData, action.payload.timeOffset);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.TASK_ADD_EDIT_CHANGE_DATE:
            temp[action.token] = changeTaskAddEditDate(state.views[action.token], action.payload.taskDate);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.TASK_ADD_EDIT_CHANGE_NOTE:
            temp[action.token] = changeTaskAddEditNote(state.views[action.token], action.payload.taskNote);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.TASK_ADD_EDIT_UPDATE_FILE_DATA:
            temp[action.token] = updateFileData(state.views[action.token], action.payload.fileData);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.TASK_ADD_EDIT_UPDATE_FILE_PASSWORD:
            temp[action.token] = updateFilePassword(state.views[action.token], action.payload.filePassword);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.SUBMIT_ADD_EDIT_TASK):
            temp[action.token] = saveAddEditTask(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.SUBMIT_ADD_EDIT_TASK_SUCCESS):
            temp[action.token] = saveAddEditTaskSuccess(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.SUBMIT_ADD_EDIT_TASK_FAIL):
            temp[action.token] = saveAddEditTaskFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case TaskActions.TASK_ADD_EDIT_CLOSE_POPUP:
            temp[action.token] = null;
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.SHOW_ERROR):
            temp[action.token] = {
                ...state.views[action.token]
                , infoMsg:
                {
                    showMsg: true, msg: action.payload.msg,
                    exitPopUp: false,
                }
                , addEditTaskLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.ENTER_UNLOCK_PW):
            temp[action.token] = {
                ...state.views[action.token]
                , addEditTaskLoading: true
                , showMsg: {}
            };
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.PASSWORD_VALIDATION_SUCCESS):
            temp[action.token] = {
                ...state.views[action.token]
                , addEditTaskLoading: false
                , requerPassword: !action.playload.isValid
                , infoMsg: {
                    showMsg: !action.playload.isValid,
                    msg: 'This document is protected. You must provide a correct password to change it.', exitPopUp: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case (TaskActions.PASSWORD_VALIDATION_FAIL):
            temp[action.token] = {
                ...state.views[action.token]
                , addEditTaskLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        default:
            {
                return state;
            }
    }
}

function getAddEditTaskInit(state: TaskAddEditState, inputData: any, timeOffset): Partial<TaskAddEditState> {
    if (inputData && inputData.matterInfo && inputData.headerText === 'Add Task') {
        // if (!state) {
        return Object.freeze({
            ...state
            , initLoading: true
            , noteForDiary: ''
            , feeEarnerList: []
            , folderList: []
            , actionTypeList: []
            , matterInfo: inputData.matterInfo
            , headerText: inputData.headerText
            , loginUser: inputData.loginUser
            , documentFlowStatus: inputData.documentFlowStatus
            , taskDate: dpsNewDate(timeOffset).toString()
            , selectedActionText: inputData.matterInfo.workflowActions
            , filePassword: ''
            , fileData: inputData.file
            , infoMsg: null
            , requerPassword: false
            , putOnBy: inputData.putOnBy
            , editSelectedFolderId: null
            , template: inputData.matterInfo.template
        });
    } else if (inputData && inputData.matterInfo && inputData.headerText === 'Edit Task') {
        let fileText = null;


        if (inputData.matterInfo && inputData.matterInfo.letter) {
            fileText = { name: inputData.matterInfo.letter };
        } else {
            fileText = null;
        }

        // if (!state) {
        return Object.freeze({
            ...state
            , initLoading: true
            , noteForDiary: inputData.matterInfo.note
            , feeEarnerList: []
            , folderList: []
            , actionTypeList: []
            , matterInfo: inputData.matterInfo
            , headerText: inputData.headerText
            , loginUser: inputData.loginUser
            , documentFlowStatus: inputData.documentFlowStatus
            , taskDate: inputData.matterInfo.dateBy
            , selectedActionText: inputData.matterInfo.workflowActions
            , fileData: fileText
            , filePassword: ''
            , requerPassword: inputData.matterInfo.hasPassword
            , putOnBy: inputData.putOnBy
            , editSelectedFolderId: inputData.matterInfo.columnFolderId
            , template: inputData.matterInfo.template
        });
    } else if (inputData && inputData.matterInfo && inputData.headerText === 'New Task') {
        // if (!state) {
        return Object.freeze({
            ...state
            , initLoading: true
            , noteForDiary: ''
            , feeEarnerList: []
            , folderList: []
            , actionTypeList: []
            , matterInfo: inputData.matterInfo
            , headerText: inputData.headerText
            , loginUser: inputData.loginUser
            , documentFlowStatus: null
            , taskDate: dpsNewDate(timeOffset).toString()
            , putOnBy: inputData.putOnBy
            , editSelectedFolderId: null
            , selectedActionText: 'Review'
            , template: inputData.matterInfo.template
        });
    } else {

        // if (!state) {
        return Object.freeze({
            ...state
            , initLoading: true
            , noteForDiary: ''
            , feeEarnerList: []
            , folderList: []
            , actionTypeList: []
            , matterInfo: inputData.matterInfo
            , headerText: inputData.headerText
            , loginUser: null
            , documentFlowStatus: null
            , taskDate: dpsNewDate(timeOffset).toString()
            , putOnBy: inputData.putOnBy
            , editSelectedFolderId: null
            , selectedActionText: 'Review'
            , template: inputData.matterInfo.template
        });
    }
}

function saveAddEditTask(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        addEditTaskLoading: true,
        infoMsg: { showMsg: false, msg: '', exitPopUp: false }
    });
}
function saveAddEditTaskSuccess(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state
        , addEditTaskLoading: false
        , infoMsg: { showMsg: true, msg: 'Successfully saved.', exitPopUp: true }
    });
}
function saveAddEditTaskFail(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        addEditTaskLoading: false,
        infoMsg: { showMsg: false, msg: 'Saved Fail.', exitPopUp: false }
    });
}

function changeTaskAddEditDate(state: TaskAddEditState, taskDate): Partial<TaskAddEditState> {
    return { ...state, taskDate: taskDate, isDirty: true };
}
function changeTaskAddEditNote(state: TaskAddEditState, taskNote): Partial<TaskAddEditState> {
    return { ...state, noteForDiary: taskNote, isDirty: true };
}
function setSelectedMatter(state: TaskAddEditState, selectedMatterData: MatterResponce, timeOffset): Partial<TaskAddEditState> {
    const matterData = {
        action: false,
        appCode: selectedMatterData.AppCode,
        appID: selectedMatterData.AppID,
        branchID: selectedMatterData.BranchID,
        client: selectedMatterData.ClientName,
        columnFolderId: 0,
        datedn: dpsNewDate(timeOffset),
        date: dpsNewDate(timeOffset),
        dateBy: dpsNewDate(timeOffset),
        dateDone: dpsNewDate(timeOffset),
        documentFlowStatus: '',
        fileID: selectedMatterData.FileID,
        folderName: '',
        hasPassword: false,
        letter: '',
        matterDetails: '',
        matterReferenceNo: selectedMatterData.MatterReferenceNo,
        note: '',
        putOnBy: '',
        taskFor: selectedMatterData.FeeEarner,
        taskID: 0,
        workflowActions: '',
        selected: false,
        expanded: false,
        checkTREnable: false,
        isTimeRecordingEnabled: false,
        billRequestId: 0,
        postingPeriodId: null,
    };
    const feeEarnerResponse: FeeEarner[] = state.feeEarnerList.map((feeEarner) => {
        if (selectedMatterData.FeeEarner && feeEarner.user_ID === selectedMatterData.FeeEarner) {
            return Object.freeze({ ...feeEarner, selected: true });
        } else if (feeEarner.selected) {
            return Object.freeze({ ...feeEarner, selected: false });
        }
        return feeEarner;
    });
    return Object.freeze({
        ...state,
        matterInfo: matterData,
        feeEarnerList: feeEarnerResponse
    });
}

function updateFileData(state: TaskAddEditState, fileData: any): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        fileData: fileData,
        filePassword: '',
    });
}

function updateFilePassword(state: TaskAddEditState, filePassword: string): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        filePassword: filePassword,
    });
}

function getFeeEarnerList(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state
        , feeEarnerListLoading: true
        , addEditTaskLoading: true
    });
}

function getFeeEarnerListSuccess(state: TaskAddEditState, feeEarnerList: FeeEarner[]): Partial<TaskAddEditState> {
    const getLoginUser: string = state ? state.loginUser : null;
    const feeEarnerWrapResponse: FeeEarner[] = feeEarnerList.map(_item => ({
        user_ID: _item.user_ID,
        selected: false,
        groupName: '',
        groupId: null
    }));
    const feeEarnerResponse: FeeEarner[] = feeEarnerWrapResponse.map((feeEarner) => {
        if (getLoginUser && feeEarner.user_ID === getLoginUser) {
            return Object.freeze({ ...feeEarner, selected: true });
        } else if (feeEarner.selected) {
            return Object.freeze({ ...feeEarner, selected: false });
        }
        return feeEarner;
    });
    return Object.freeze({
        ...state
        , feeEarnerListLoading: false
        , feeEarnerList: feeEarnerResponse
        , addEditTaskLoading: false
    });
}
function getFeeEarnerListFail(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        feeEarnerListLoading: false,
        addEditTaskLoading: false
    });
}
function getFolderList(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        folderListLoading: true,
        addEditTaskLoading: true
    });
}
function getFolderListSuccess(state: TaskAddEditState, folderList: Folder[]): Partial<TaskAddEditState> {
    const getDefaultFolderId: number = state.defaultFolderId;
    const folderWrapResponse: Folder[] = folderList.map(_item => ({
        text: _item.text,
        value: _item.value,
        selected: false
    }));
    const folderResponse: Folder[] = folderWrapResponse.map((folder, index) => {
        if (state.headerText === 'Edit Task' && state.editSelectedFolderId && +folder.value === state.editSelectedFolderId) {
            return Object.freeze({ ...folder, selected: true });
        } else if (state.headerText !== 'Edit Task' && index === 0 && (!getDefaultFolderId || getDefaultFolderId === 1)) {
            return Object.freeze({ ...folder, selected: true });
        } else if (state.headerText !== 'Edit Task' && getDefaultFolderId && folder.value === getDefaultFolderId) {
            return Object.freeze({ ...folder, selected: true });
        } else if (folder.selected) {
            return Object.freeze({ ...folder, selected: false });
        }
        return folder;
    });

    return Object.freeze({
        ...state
        , folderListLoading: false
        , folderList: folderResponse
        , addEditTaskLoading: false
    });
}
function getFolderListFail(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state
        , folderListLoading: false
        , addEditTaskLoading: false
    });
}
function getFolderId(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        addEditTaskLoading: true
    });
}
function getFolderIdSuccess(state: TaskAddEditState, folderId: number): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state
        , defaultFolderId: folderId
        , addEditTaskLoading: false
    });
}
function getFolderIdFail(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state
        , addEditTaskLoading: false
    });
}

function getActionTypeList(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state,
        actionTypeLoading: true,
        addEditTaskLoading: true
    });
}
function getActionTypeListSuccess(state: TaskAddEditState, actionTypeList: ActionType[]): Partial<TaskAddEditState> {
    let getSelectedActionText: string = state.selectedActionText;
    if (state && state.selectedActionText) {
        getSelectedActionText = state.selectedActionText;
    } else {
        getSelectedActionText = null;
    }
    return Object.freeze({
        ...state
        , actionTypeLoading: false
        , actionTypeList: changeSelectedActionTypeText(actionTypeList, getSelectedActionText)
        , addEditTaskLoading: false
    });
}
function changeSelectedActionTypeText(currentActionTypeList: ActionType[], newActionTypeText: string) {
    if (newActionTypeText) {
        return currentActionTypeList.map((actionType) => {
            if (actionType.text === newActionTypeText) {
                return Object.freeze({ ...actionType, selected: true });
            } else if (actionType.selected) {
                return Object.freeze({ ...actionType, selected: false });
            }
            return actionType;
        });
    } else {
        return currentActionTypeList.map((actionType, index) => {
            if (index === 0) {
                return Object.freeze({ ...actionType, selected: true });
            } else if (actionType.selected) {
                return Object.freeze({ ...actionType, selected: false });
            }
            return actionType;
        });
    }

}
function getActionTypeListFail(state: TaskAddEditState): Partial<TaskAddEditState> {
    return Object.freeze({
        ...state
        , actionTypeLoading: false
        , addEditTaskLoading: false
    });
}

function changeFeeEarner(state: TaskAddEditState, feeEarner: FeeEarner) {
    return Object.freeze({
        ...state,
        feeEarnerList: changeSelectedFeeEarner(state.feeEarnerList, feeEarner.user_ID)
    });
}
function changeSelectedFeeEarner(currentFeeEarnerList: FeeEarner[], newFeeEarner: string) {
    return currentFeeEarnerList.map((feeEarner) => {
        if (feeEarner.user_ID === newFeeEarner) {
            return Object.freeze({ ...feeEarner, selected: true });
        } else if (feeEarner.selected) {
            return Object.freeze({ ...feeEarner, selected: false });
        }
        return feeEarner;
    });
}
function changeFolder(state: TaskAddEditState, folder: Folder) {
    return Object.freeze({
        ...state,
        folderList: changeSelectedFolder(state.folderList, folder.value)
    });
}

function changeSelectedFolder(currentFolderList: Folder[], newFolderID: number) {
    return currentFolderList.map((folder) => {
        if (folder.value === newFolderID) {
            return Object.freeze({ ...folder, selected: true });
        } else if (folder.selected) {
            return Object.freeze({ ...folder, selected: false });
        }
        return folder;
    });
}
function changeActionType(state: TaskAddEditState, actionType: ActionType) {
    return Object.freeze({
        ...state,
        actionTypeList: changeSelectedActionType(state.actionTypeList, actionType.value)
        , selectedActionText: actionType.text
    });
}
function changeSelectedActionType(currentActionTypeList: ActionType[], newActionTypeID: number) {
    return currentActionTypeList.map((actionType) => {
        if (actionType.value === newActionTypeID) {
            return Object.freeze({ ...actionType, selected: true });
        } else if (actionType.selected) {
            return Object.freeze({ ...actionType, selected: false });
        }
        return actionType;
    });
}


export const getState = (state: State) => state;
export const getFeeEarners = createSelector(getState, (state) => state ? state.feeEarnerList : null);
export const getViewByToken = (token) => createSelector(getState, (state) => state.views[token]);
export const getTaskLoadingByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view && view.initLoading && view.addEditTaskLoading) {
        return true;
    } else {
        return false;
    }
});
export const getFeeEarnerListByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.feeEarnerList : null);
export const getFolderListByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.folderList : null);
export const getActionTypeListByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.actionTypeList : null);
export const getSelectedFeeEarnerByToken = (token) => createSelector(getFeeEarnerListByToken(token),
    (feeEarner) => feeEarner.find((feeEarners) => feeEarners.selected));
export const getDefaultFolderByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.defaultFolderId : null);
export const getMatterInfoByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.matterInfo : null);
export const getLoginUserByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.loginUser : null);
export const getHeaderTextByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.headerText : null);
export const getDocumentFlowStatusByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.documentFlowStatus : null);
export const getIsDirtyByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.isDirty : null);
export const getDateByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.taskDate : null);
export const getNoteByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.noteForDiary : null);
export const getFileDataInfoByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.fileData : null);
export const getFilePassWordDataByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.filePassword : '');
export const getTaskAddEditSaveDataByToken = (token) =>
    createSelector(getViewByToken(token), (view) => {
        const data = new FormData();
        if (view && view.feeEarnerList) {
            // const selectedFeeEarner = view.feeEarnerList.find((feeEarner) => feeEarner.selected).user_ID;

            const selectedFeeEarner = view.feeEarnerList.find((feeEarner) => feeEarner.selected) ?
                view.feeEarnerList.find((feeEarner) => feeEarner.selected).user_ID : null;

            let selectedFolderId = view.folderList.find((folder) => folder.selected) ?
                view.folderList.find((folder) => folder.selected).value : null;

            // if (!selectedFeeEarner && view.feeEarnerList && view.folderList.length > 0) {
            //     selectedFeeEarner = view.feeEarnerList[0].user_ID;
            // }
            if (!selectedFolderId && view.folderList && view.folderList.length > 0) {
                selectedFolderId = view.folderList[0].value;
            }
            const actionTypeId = view.actionTypeList.find((feeEarner) => feeEarner.selected).value;
            const uploadfile = view.fileData;
            if (uploadfile) {
                data.append('files', uploadfile);
            }
            const taskModel = {
                password: view.filePassword,
                newPassword: view.filePassword,
                confirmPassword: '',
                isRemovedAttachment: false,
                isRemovedPassword: false,
                isChangedPassword: false,

                dateBy: new DatePipe('en-US').transform(view.taskDate, 'yyyy-MM-dd HH:mm:ss'),
                workflowActions: view.selectedActionText,
                taskFor: selectedFeeEarner,
                columnFolderId: selectedFolderId,
                matterReferenceNo: view.matterInfo.matterReferenceNo,
                client: view.matterInfo.client,
                matterDetails: view.matterInfo.matterDetails,
                appID: view.matterInfo.appID,
                appCode: view.matterInfo.appCode,
                fileID: view.matterInfo.fileID,
                diaryId: view.headerText !== 'Add Task' ? view.matterInfo.taskID : 0,
                branchID: view.matterInfo.branchID,
                note: view.noteForDiary,
                taskID: view.headerText !== 'Add Task' ? view.matterInfo.taskID : 0,
                putOnBy: view.putOnBy,
                template: view.template
            };
            data.append('taskViewModel', JSON.stringify(taskModel));
            return data;
        } else {
            return data;
        }
    });
export const getInfoMsgByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.infoMsg : '');
export const getHasPasswordByToken = (token) =>
    createSelector(getViewByToken(token), (view) => view ? view.requerPassword : null);
