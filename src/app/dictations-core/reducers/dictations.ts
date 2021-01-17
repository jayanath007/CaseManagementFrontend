import { TeamTalkTemplateUrlViewModel, GridDataWithSummary, TeamTalkUserSuccessInfo, DropdownListData } from './../models/interface';

import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    GridDataFilter, GridRowData, LoginUser,
    GroupInfo, StatusSummaryModel, TeamTalkAuthors, TeamTalkCheckOutDocResponce, TeamTalkAttachMatter
} from '../models/interface';
import { JobFolderType, UserType } from '../models/enum';


export interface State {
    readonly [token: string]: DictationsState;
}

export interface DictationsState {

    readonly columnDef: ColumnDef[];
    readonly columnDefAuthor: ColumnDef[];
    readonly columnDefSec: ColumnDef[];
    readonly loading: boolean;
    readonly groupList: GroupInfo[];
    readonly jobFor: string;
    readonly jobStage: string;
    readonly matterRef: string;
    readonly userTypeData: LoginUser;
    readonly gridFilters: GridDataFilter;
    readonly dictationGridData: GridRowData[];
    readonly expandedItem: GridRowData;
    readonly statusCount: StatusSummaryModel;
    readonly teamTalkAuthorList: TeamTalkAuthors[];
    readonly userValidationMessage: TeamTalkUserSuccessInfo;
    readonly statusValue: number;
    readonly completeRowItem: GridRowData;
    readonly checkoutFileData: TeamTalkCheckOutDocResponce;
    readonly selectAuthor: TeamTalkAuthors;
    readonly paginatorDef: PaginatorDef;
    readonly profileSecrarary: DropdownListData[];
    readonly profileGroup: any;
    readonly profileLoading: boolean;
    readonly profileClose: boolean;
    readonly jobDescription: DropdownListData[];


}


const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_DICTATIONS:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_USER:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_USER_SUCCESS:
            tmp[action.token] = getUserSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_USER_FAIL:
            tmp[action.token] = getUserFail(state[action.token], action.payload.teamTalkUserSuccessInfo);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_GROUPS:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_GROUPS_SUCCESS:
            tmp[action.token] = getGroupSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_GROUPS_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_GRID_DATA:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_GRID_DATA_SUCCESS:
            tmp[action.token] = setGridData(state[action.token], action.payload.data);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_GRID_DATA_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.CHANGE_AUTHOR:
            tmp[action.token] = setAuthor(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.CHANGE_JOB_FOR:
            tmp[action.token] = setJobFor(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.CHANGE_JOB_STAGE:
            tmp[action.token] = setJobStage(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.ATTACHED_MATTER_FOR_JOB:
            tmp[action.token] = attachedMatterForJob(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.ROW_EXPAND:
            tmp[action.token] = gridRowExpand(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.DICTATION_FINISH_JOB_FUNCTIONS:
            tmp[action.token] = finishJob(state[action.token], action.payload.itemRow);
            return { ...state, ...tmp };
        case Actions.DICTATION_FINISH_JOB_FUNCTIONS_SUCCESS:
            tmp[action.token] = finishJobSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.DICTATION_FINISH_JOB_FUNCTIONS_FAIL:
            tmp[action.token] = finishJobFail(state[action.token]);
            return { ...state, ...tmp };

        // case Actions.DICTATION_JOB_STATUS_COUNTS:
        //     tmp[action.token] = statusCount(state[action.token]);
        //     return { ...state, ...tmp };
        // case Actions.DICTATION_JOB_STATUS_COUNTS_SUCCESS:
        //     tmp[action.token] = setstatusCount(state[action.token], action.payload.data);
        //     return { ...state, ...tmp };
        // case Actions.DICTATION_JOB_STATUS_COUNTS_FAIL:
        //     tmp[action.token] = setstatusCountFail(state[action.token]);
        //     return { ...state, ...tmp };

        case Actions.GET_TEAM_TALKS_AUTHORS_SUCCESS:
            tmp[action.token] = setTeamTalkAuthor(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_TALKS_AUTHORS_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };

        case Actions.CHECK_OUT_TEAM_TALK_TEMPLATE:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.CHECK_OUT_TEAM_TALK_TEMPLATE_SUCCESS:
            tmp[action.token] = setCheckoutFileData(state[action.token], action.payload.data, action.payload.request);
            return { ...state, ...tmp };
        case Actions.CHECK_OUT_TEAM_TALK_TEMPLATE_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };


        case Actions.VALIDATE_TEAM_TALK_DOC_PATH:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.VALIDATE_TEAM_TALK_DOC_PATH_SUCCESS:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.VALIDATE_TEAM_TALK_DOC_PATH_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };

        case Actions.DICTATION_COMPLETE:
            tmp[action.token] = {
                ...state[action.token], loading: true,
                statusValue: action.payload.statusValue, completeRowItem: action.payload.itemRow
            };
            return { ...state, ...tmp };
        case Actions.DICTATION_COMPLETE_SUCCESS:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.DICTATION_COMPLETE_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };

        case Actions.ADD_TEAM_TALK_DIARY_RECORD:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.ADD_TEAM_TALK_DIARY_RECORD_SUCCESS:
            tmp[action.token] = { ...state[action.token], loading: false, statusValue: 0, completeRowItem: null };
            return { ...state, ...tmp };
        case Actions.ADD_TEAM_TALK_DIARY_RECORD_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, statusValue: 0, completeRowItem: null };
            return { ...state, ...tmp };

        case Actions.CHECK_IN_TEAM_TALK_TEMPLATE:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.CHECK_IN_TEAM_TALK_TEMPLATE_SUCCESS:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.CHECK_IN_TEAM_TALK_TEMPLATE_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };

        case Actions.GET_DICTATION_URL:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.GET_DICTATION_URL_SUCCESS:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.GET_DICTATION_URL_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.UPLOAD_DICTATION_FILE:
            tmp[action.token] = { ...state[action.token], loading: true, };
            return { ...state, ...tmp };
        case Actions.GET_JOB_ID_FOR_UPLOAD_FILE_SUCCESS:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.GET_JOB_ID_FOR_UPLOAD_FILE_FAIL:
            tmp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...tmp };
        case Actions.GET_SECRETARY:
            tmp[action.token] = { ...state[action.token], profileLoading: true, };
            return { ...state, ...tmp };
        case Actions.GET_SECRETARY_SUCCESS:
            tmp[action.token] = { ...state[action.token], profileLoading: false, profileSecrarary: action.responce.data };
            return { ...state, ...tmp };
        case Actions.GET_SECRETARY_FAIL:
            tmp[action.token] = { ...state[action.token], profileLoading: false, };
            return { ...state, ...tmp };
        case Actions.GET_GROUPS:
            tmp[action.token] = { ...state[action.token], profileLoading: true, };
            return { ...state, ...tmp };
        case Actions.GET_GROUPS_SUCCESS:
            tmp[action.token] = { ...state[action.token], profileLoading: false, profileGroup: action.responce.data };
            return { ...state, ...tmp };
        case Actions.GET_GROUPS_FAIL:
            tmp[action.token] = { ...state[action.token], profileLoading: false, };
            return { ...state, ...tmp };

        case Actions.GET_JOB_DESCRIPTION:
            tmp[action.token] = { ...state[action.token], profileLoading: true, };
            return { ...state, ...tmp };
        case Actions.GET_JOB_DESCRIPTION_SUCCESS:
            tmp[action.token] = { ...state[action.token], profileLoading: false, jobDescription: action.responce.data };
            return { ...state, ...tmp };
        case Actions.GET_JOB_DESCRIPTION_FAIL:
            tmp[action.token] = { ...state[action.token], profileLoading: false, };
            return { ...state, ...tmp };


        // case Actions.GET_GLOBAL_DOC_APP_CODE_LIST:
        //     tmp[action.token] = appCodeLoading(state[action.token]);
        //     return { ...state, ...tmp };
        case Actions.GET_MATTER_REF_SUCCESS:
            tmp[action.token] = setMatterRef(state[action.token], action.payload.data, action.payload.gridRowData);
            return { ...state, ...tmp };

        case Actions.INIT_DICTATION_PROFILING:
            tmp[action.token] = { ...state[action.token], profileClose: false, };
            return { ...state, ...tmp };
        case Actions.SUBMIT_PROFILING:
            tmp[action.token] = { ...state[action.token], profileLoading: true, };
            return { ...state, ...tmp };
        case Actions.SUBMIT_PROFILING_SUCCESS:
            tmp[action.token] = { ...state[action.token], profileLoading: false, profileClose: true };
            return { ...state, ...tmp };
        case Actions.SUBMIT_PROFILING_FAIL:
            tmp[action.token] = { ...state[action.token], profileLoading: false, };
            return { ...state, ...tmp };

        // case Actions.GLOBAL_SEARCH_CHANGE_SEARCH_TEXT:
        //     tmp[action.token] = setSearchText(state[action.token], action.payload);
        //     return { ...state, ...tmp };
        // case Actions.CLOSE_DOCUMENT_VIEWER:
        //     tmp[action.token] = closedocview(state[action.token]);
        //     return { ...state, ...tmp };
        // case Actions.REMOVE_FILTER_ROW:
        //     tmp[action.token] = removefilterRow(state[action.token], action.payload);
        //     return { ...state, ...tmp };
        // case Actions.GRID_VIEW_CHANGE:
        //     tmp[action.token] = viewChange(state[action.token], action);
        //     return { ...state, ...tmp };
        // case Actions.GLOBAL_SEARCH_DOCUMENT_CLEAR:
        //     tmp[action.token] = searchDocumentClear(state[action.token]);
        //     return { ...state, ...tmp };
        // case Actions.GET_GLOBAL_DOCUMENT_POPUP_URL_SUCCESS:
        //     tmp[action.token] = setPopUpURL(state[action.token], action);
        //     return { ...state, ...tmp };


        // case Actions.FILTER_ITEM_CHANGE:
        //     tmp[action.token] = setChangeFilterItem(state[action.token],
        //         action.payload);
        //     return { ...state, ...tmp };
        case Actions.CHANGE_PAGE:
            tmp[action.token] = { ...state[action.token], paginatorDef: action.pageDef };
            return { ...state, ...tmp };

        default:
            { return state; }
    }
}




function initView(state: DictationsState, action: Actions.InitDictations): Partial<DictationsState> {
    if (!state) {
        return {
            ...state,
            loading: false,
            userTypeData: null,
            columnDefAuthor: action.payload.columnDefAuthor,
            columnDefSec: action.payload.columnDefSecretary,
            columnDef: action.payload.columnDefAuthor,
            expandedItem: null,
            paginatorDef: action.payload.paginatorDef
        };
    } else {
        return state;
    }
}

function getGroupSuccess(state: DictationsState, payload: GroupInfo[]): Partial<DictationsState> {
    return { ...state, groupList: payload, loading: false };
}

function getUserFail(state: DictationsState, payload: TeamTalkUserSuccessInfo): Partial<DictationsState> {
    return { ...state, userValidationMessage: payload, loading: false };
}


function setAuthor(state: DictationsState, author: TeamTalkAuthors): Partial<DictationsState> {
    return {
        ...state,
        gridFilters: {
            ...state.gridFilters,
            jobFor: {
                id: author.id,
                name: author.name
            }
        },
        selectAuthor: author
    };

}
function setJobFor(state: DictationsState, payload): Partial<DictationsState> {
    return {
        ...state,
        gridFilters: {
            ...state.gridFilters,
            jobFor: payload
        }
    };

}

function setJobStage(state: DictationsState, payload): Partial<DictationsState> {
    return {
        ...state,
        gridFilters: {
            ...state.gridFilters,
            jobStage: payload
        }
    };
}

function getUserSuccess(state: DictationsState, userType: LoginUser): Partial<DictationsState> {
    return {
        ...state,
        userTypeData: userType,
        teamTalkAuthorList: userType.authorInfo ? userType.authorInfo.concat({
            code: '',
            id: userType.id,
            level: userType.level,
            name: 'My Jobs'
        }) : null,

        groupList: userType.groupInfo ? userType.groupInfo : null,
        columnDef: userType.level === UserType.typist ? state.columnDefSec : state.columnDefAuthor,

        gridFilters: {
            ...state.gridFilters,
            jobFor: userType.level === UserType.manager ? {
                id: userType.id,
                name: 'My Jobs',
            } : {
                    id: -1,
                    name: 'My Jobs'
                },
            jobStage: userType.level === UserType.typist ? {
                key: JobFolderType.ToDo,
                value: 'To do'
            } : {
                    key: JobFolderType.Sent,
                    value: 'Sent'
                }
        }
    };



}


function attachedMatterForJob(state: DictationsState, rowData: { attachementData: TeamTalkAttachMatter, gridRowData: GridRowData }):
    Partial<DictationsState> {
    return {
        ...state,

        dictationGridData: state.dictationGridData.map(val => {
            if (val.id === rowData.gridRowData.id) {
                return {
                    ...val,
                    clientName: rowData.attachementData.clientName,
                    matterReferenceNo: rowData.attachementData.matterReferenceNo,
                    branchId: rowData.attachementData.branchId,
                    appId: rowData.attachementData.appId,
                    appCode: rowData.attachementData.appCode,
                    fileId: rowData.attachementData.fileId,
                    feeEarner: rowData.attachementData.feeEarner,
                    dpsFileID: rowData.attachementData.fileId,
                    dpsBranchId: rowData.attachementData.branchId,
                    dpsAppPrefix: rowData.attachementData.appCode,

                };
            } else {
                return val;

            }
        })
    };
}

function setMatterRef(state: DictationsState, data, rowData) {
    return {
        ...state,

        dictationGridData: state.dictationGridData.map(val => {
            if (val.id === rowData.id) {
                return {
                    ...val,
                    matterReferenceNo: data.matterReferenceNo,
                };
            } else {
                return val;

            }
        })
    };
}

function setTeamTalkAuthor(state: DictationsState, authorList: TeamTalkAuthors[]) {
    return {
        ...state,
        loading: false,
        teamTalkAuthorList: authorList.concat({
            code: '',
            id: state.userTypeData.id,
            level: state.userTypeData.level,
            name: 'My Jobs'
        })

    };
}

function setGridData(state: DictationsState, gridDataSummary: GridDataWithSummary) {
    return {
        ...state,
        loading: false,
        dictationGridData: gridDataSummary.jobInfo,
        statusCount: gridDataSummary.jobCountStatistics,
        paginatorDef: { ...state.paginatorDef, total: gridDataSummary.rowCount }
    };
}


function setExpandedRow(Grid: GridRowData[], selectedRow: GridRowData): GridRowData[] {
    return Grid.map(row => {
        if (row === selectedRow) {
            return { ...row, expanded: !row.expanded };
        } else {
            return { ...row, expanded: false };
        }
    });
}

function gridRowExpand(state: DictationsState, rowData): Partial<DictationsState> {
    return {
        ...state,
        dictationGridData: setExpandedRow(state.dictationGridData, rowData),
        expandedItem: rowData
    };
}

function finishJob(state: DictationsState, rowItem) {
    return {
        ...state,
        loading: true,
        completeRowItem: rowItem
    };
}

function finishJobSuccess(state: DictationsState, saveData) {
    return {
        ...state,
        loading: false,
    };


}
function finishJobFail(state: DictationsState) {
    return {
        ...state,
        loading: false,
    };


}



function setCheckoutFileData(state: DictationsState, checkoutData: TeamTalkCheckOutDocResponce, request: TeamTalkTemplateUrlViewModel) {
    return {
        ...state,
        loading: false,
        checkoutFileData: checkoutData,

        dictationGridData: state.dictationGridData.map(val => {
            if (val.id === request.jobId) {
                return {
                    ...val,
                    checkoutDocDetails: checkoutData,
                };
            } else {
                return val;

            }
        })


    };
}




export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : null);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getUserTypeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.userTypeData : null);
export const getDictationGridFilterByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridFilters : null);
export const getMatterRefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.matterRef : null);
export const getGroupListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.groupList : null);
export const getDictationGridDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.dictationGridData : null);
export const getDictationStateCountsByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.statusCount : null);
export const getAuthorListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.teamTalkAuthorList : null);
export const getGetCheckoutFileDetailByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.checkoutFileData : null);
export const getStatusValueByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.statusValue : 0);
export const getCompleteRowItemByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.completeRowItem : null);
export const getSelectAuthorByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectAuthor : null);
export const getuserValidationMessageByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.userValidationMessage : null);
export const getGridPaginationDef = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.paginatorDef : null);
export const getProfileSecrarary = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.profileSecrarary : null);
export const getprofileGroup = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.profileGroup : null);
export const getProfileLoading = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.profileLoading : null);
export const getProfileClose = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.profileClose : null);
export const getJobDescription = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.jobDescription : null);


