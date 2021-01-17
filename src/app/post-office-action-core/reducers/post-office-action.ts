import { Group, PostOfficeInboxViewModel, PostOfficeInboxSaveRequestViewModel } from './../../post-office-core/models/interfce';
import { FeeEarner } from './../../add-note-core/models/interfaces';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { PostOfficeActionModel, PostOfficeActionInputData, EnabaleControlers } from '../models/interfaces';
import { DocumentFlowStatus, WorkflowActions } from '../models/enum';
import { DiaryRecType } from './../../add-note-core/models/enumeration';
import { TeamMember } from '../../core/lib/team-members';



export interface State {
    readonly [token: string]: PostOfficeActionState;
}

export interface PostOfficeActionState {

    readonly inputData: PostOfficeActionInputData;

    readonly isLoading: boolean;
    readonly loadingFeeEarnerList: boolean;
    readonly loadingGroupList: boolean;
    readonly loadingItemTypeList: boolean;
    readonly loadingDiaryFoldesList: boolean;
    readonly feeEarnerList: TeamMember[];
    readonly groupList: Group[];
    readonly actionList: { value: number, text: string }[];
    readonly itemTypeList: any[];
    readonly diaryFoldesList: any[];
    readonly model: PostOfficeActionModel;
    readonly enabaleControlers: EnabaleControlers;
    readonly isClose: boolean;

}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {


        case Actions.INIT_POST_OFFICE:
            temp[action.token] = setInitialData(state[action.token], action.payload);
            return { ...state, ...temp };


        case Actions.POST_OFFICE_MODEL_CHANGE:
            let updateModel = action.payload.newModel;
            let enabaleControlers = state[action.token].enabaleControlers;

            if (updateModel.group !== state[action.token].model.group) {
                updateModel = { ...action.payload.newModel, sendTo: '' };
            }

            if (updateModel.action === WorkflowActions.AttachToDiary) {
                enabaleControlers = {
                    ...enabaleControlers,
                    diaryFoldersEnable: true,
                    itemTypeEnable: true,
                    noteEnable: true,
                    matterSelectEnable: true,
                };
                updateModel = { ...updateModel, itemType: DiaryRecType.LETTER_IN };
            } else {

                enabaleControlers = {
                    ...enabaleControlers,
                    diaryFoldersEnable: false,
                    itemTypeEnable: false,
                    noteEnable: false,
                    matterSelectEnable: false,
                };
                updateModel = { ...updateModel };
            }

            temp[action.token] = {
                ...state[action.token],
                model: updateModel,
                enabaleControlers: enabaleControlers,
            };
            return { ...state, ...temp };

        case Actions.LOAD_FEEEARNER_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingFeeEarnerList: true
            };
            return { ...state, ...temp };

        case Actions.LOAD_FEEEARNER_LIST_SUCCESS:
            const sendTo = (action.payload.feeEarnerList[0] && action.payload.groupId > 0) ?
                action.payload.feeEarnerList[0].userId : null;
            temp[action.token] = {
                ...state[action.token],
                feeEarnerList: action.payload.feeEarnerList,
                loadingFeeEarnerList: false,
                model: { ...state[action.token].model, sendTo: sendTo },
            };
            return { ...state, ...temp };

        case Actions.LOAD_FEEEARNER_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingFeeEarnerList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_GROUP_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingGroupList: true
            };
            return { ...state, ...temp };

        case Actions.LOAD_GROUP_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                groupList: action.payload.groups,
                loadingGroupList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_GROUP_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingGroupList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_DIARY_FOLDERS_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingDiaryFoldesList: true
            };
            return { ...state, ...temp };

        case Actions.LOAD_DIARY_FOLDERS_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                diaryFoldesList: action.payload.folders,
                loadingDiaryFoldesList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_DIARY_FOLDERS_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingDiaryFoldesList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_ITEM_TYPE_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingItemTypeList: true
            };
            return { ...state, ...temp };

        case Actions.LOAD_ITEM_TYPE_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                itemTypeList: action.payload.actions,
                loadingItemTypeList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_ITEM_TYPE_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingItemTypeList: false
            };
            return { ...state, ...temp };
        case Actions.SAVE:
            temp[action.token] = {
                ...state[action.token],
                isLoading: true
            };
            return { ...state, ...temp };
        case Actions.SAVE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false,
                isClose: true,
            };
            return { ...state, ...temp };
        case Actions.SAVE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false
            };
            return { ...state, ...temp };

        default:
            {
                return state;
            }
    }
}





function setInitialData(pState: PostOfficeActionState, payload: { inputData: PostOfficeActionInputData }):
    Partial<PostOfficeActionState> {

    const model = newFormModel(payload.inputData);
    let actionList: { value: number, text: string }[] = [];
    const enabaleControlers: EnabaleControlers = {
        massageEnable: true,
        actionEnable: true,
        groupEnable: true,
        sendToEnable: true,
        diaryFoldersEnable: true,
        itemTypeEnable: true,

        noteEnable: false,
        matterSelectEnable: false,
    };
    // test
    // actionList = ['Review'];
    switch (payload.inputData.status) {

        case DocumentFlowStatus.Completed:
            enabaleControlers.actionEnable = false;
            enabaleControlers.massageEnable = false;
            enabaleControlers.groupEnable = false;
            break;
        case DocumentFlowStatus.Unopened:
            actionList = [{ value: WorkflowActions.Review, text: 'Review' }];
            model.action = payload.inputData.action;
            break;
        case DocumentFlowStatus.SentForReview:
            actionList = [{ value: WorkflowActions.Review, text: 'Review' },
            { value: WorkflowActions.Approve, text: 'Approve' }];
            model.action = payload.inputData.action;
            break;

        case DocumentFlowStatus.Approved:
            actionList = [{ value: WorkflowActions.Review, text: 'Review' }];
            model.action = WorkflowActions.Review;
            break;

        default:
            break;
    }

    if (model.action === WorkflowActions.AttachToDiary) {

        enabaleControlers.diaryFoldersEnable = true;
        enabaleControlers.itemTypeEnable = true;
        enabaleControlers.noteEnable = true;
        enabaleControlers.matterSelectEnable = true;
        model.itemType = DiaryRecType.LETTER_IN;

    } else {
        enabaleControlers.diaryFoldersEnable = false;
        enabaleControlers.itemTypeEnable = false;
        enabaleControlers.noteEnable = false;
        enabaleControlers.matterSelectEnable = false;

        // enabaleControlers.diaryFoldersEnable = true;
        // enabaleControlers.itemTypeEnable = true;
        // enabaleControlers.noteEnable = true;
        // enabaleControlers.matterSelectEnable = true;
    }


    return {
        ...pState,
        loadingFeeEarnerList: false,
        loadingGroupList: false,
        isLoading: false,
        isClose: false,
        model: model,
        groupList: [],
        feeEarnerList: [],
        actionList: actionList,
        inputData: payload.inputData,
        enabaleControlers: enabaleControlers,
    };
}


function newFormModel(data: PostOfficeActionInputData): PostOfficeActionModel {
    return {
        group: 0,
        sendTo: data.sendTo,
        itemType: data.itemType,
        action: data.action,
        attachAs: data.attachAs,

        // createdBy: data.createdBy,
        // dateOn: data.dateOn,
        massage: data.massage,
        note: data.note,
        appId: -1,
        // note: data.note,
        // document: data.document,
        // statusName: data.statusName,
        // status: data.status,
    };
}


export const getView = (pState: State) => pState;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token),
    (pState) => {
        if (pState && (pState.loadingGroupList || pState.loadingItemTypeList
            || pState.loadingDiaryFoldesList || pState.loadingFeeEarnerList || pState.isLoading)) {
            return true;
        } else {
            return false;
        }
    });
export const getFeeEarnerList = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.feeEarnerList : []);



export const getIsClose = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.isClose : []);


export const getGroupsList = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.groupList : []);

export const getDiaryFoldesList = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.diaryFoldesList : []);

export const getItemTypeList = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.itemTypeList : []);

export const getActionList = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.actionList : []);


export const getModelByToken = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.model : null);

export const getInputDataByToken = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.inputData : null);


export const getSaveModelByToken = (token) => createSelector(getViewByToken(token),
    (pState) => {



        // status: row.inboxStatus,
        // group: row.inboxGroupName,
        // groupId: row.inboxGroupId,
        // sendTo: row.inboxInUseBy,
        // itemType: row.inboxDocType,
        // createdBy: row.inboxCurUser,
        // dateOn: row.inboxDateCreated,
        // massage: '',
        // note: row.inboxNote,
        // document: row.inboxDocPath,
        // action: 20, // row.inboxAction,
        // statusName: row.inboxStatusName,
        // attachAs: row.inboxStatus,


        // attachAs: number;
        // diaryFoldes?: number;
        // massage: string;


        // action: number;
        // group: number;
        // sendTo: string;
        // itemType: number;


        if (pState && pState.model) {

            const postOfficeInboxViewModels: PostOfficeInboxViewModel[] = [];
            pState.inputData.rows.forEach(row => {
                const model: PostOfficeInboxViewModel = {

                    inboxId: row.inboxId,
                    inboxCurUser: row.inboxCurUser,
                    inboxDateCreated: row.inboxDateCreated,
                    inboxDocPath: row.inboxDocPath,
                    inboxStatus: row.inboxStatus,
                    inboxFirstMoveDate: row.inboxFirstMoveDate,
                    inboxLastMovedBy: row.inboxLastMovedBy,
                    inboxLastMoveDate: row.inboxLastMoveDate,
                    inboxDiarynetId: row.inboxDiarynetId,
                    inboxBarCode: row.inboxBarCode,
                    inboxDepartment: row.inboxDepartment,
                    inboxStatusName: row.inboxStatusName,
                    inboxGroupName: row.inboxGroupName,
                    inboxLettericon: row.inboxLettericon,
                    inboxFirstMovedBy: row.inboxFirstMovedBy,
                    inboxMessage: pState.model.massage,
                    inboxLastMovedTo: pState.model.sendTo,
                    inboxNote: pState.model.note,
                    inboxDocType: pState.model.itemType,
                    inboxInUseBy: pState.model.sendTo,
                    inboxGroupId: pState.model.group,
                    inboxAction: pState.model.action,

                };
                postOfficeInboxViewModels.push(model);
            });

            const saveModel: PostOfficeInboxSaveRequestViewModel = {
                postOfficeInboxViewModels: postOfficeInboxViewModels,
            };

            return saveModel;
        } else {
            return null;
        }
    });
export const getEnabaleControlers = (token) => createSelector(getViewByToken(token),
    (pState) => pState ? pState.enabaleControlers : []);






