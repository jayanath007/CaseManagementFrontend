import { MatterAppCode } from './../../core/lib/matter';
import { ClassObj } from './../../crime-management-core/models/interfaces';

import { ChaserOutPutType } from '../models/enums';
import { ChaserInput, ChaserViewModel, ChaserRequest, ContactMapResponce, ContactEmailsViewModel } from '../models/interfaces';

import { createSelector } from '@ngrx/store';
import { Folder, FeeEarner, TimeType, MatterInfo, ChaserError } from '../models/interfaces';
import * as ChaserAction from '../actions/core';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { Recipient } from '../../core/lib/microsoft-graph';
import { eBillingType } from '../../core/lib/matter';
import { PrecedentHSModel, WorkType } from '../../core/lib/precedentHS';
import { AttType } from '../../core/lib/timeRecord';
import { CivilClassObj } from '../../civil-class-management';
import { CivilDropDownData } from '../../civil-time-recording-desktop';

export interface State {
    readonly [token: string]: ChaserState;
}

export interface ChaserState {
    readonly loading: boolean;
    readonly chaserLoading: boolean;
    readonly feeEarnerListLoading: boolean;
    readonly folderListLoading: boolean;
    readonly timeTypeListLoading: boolean;
    readonly init: boolean;
    readonly chaserActive: boolean;
    readonly loginUser: string;
    readonly fileNoLoading: boolean;
    readonly fileNo: string;
    readonly fileNote: string;
    readonly mailSubject: string;
    readonly folderList: Folder[];
    readonly feeEarnerList: FeeEarner[];
    readonly timeTypeList: TimeType[];
    readonly unit: number;
    readonly openCaseList: MatterInfo[];
    readonly loadingMatterList: boolean;
    readonly selectedMatterInfo: MatterInfo;
    readonly defaultFolderLoading: boolean;
    readonly defaultFolder: Folder;
    readonly openFileChangeLoading: boolean;
    readonly matterRef: boolean;
    readonly error: ChaserError;
    readonly chaserEmailLoading: boolean;
    readonly chaserModalRequest: ChaserViewModel;
    readonly chaserOutPutResult: ChaserOutPutType;
    readonly chaserSendSuccess: boolean;
    readonly isFeeEarnerRateValueDisable: boolean;
    readonly isTimeRecordingEnabled: boolean;
    readonly workTypeList: WorkType[];
    readonly activitiList: PrecedentHSModel[];
    readonly phaseList: PrecedentHSModel[];
    readonly phaseWiseTaskList: PrecedentHSModel[];
    readonly precedentHSUnit: number;
    readonly precedentHSRate: number | string;
    // readonly precedentHSTotal: number;

    // LAKMAL - LS
    readonly toRecipients: Recipient[];
    readonly contactMapResponce: ContactMapResponce;
    readonly classType: ClassObj[];
    readonly classTypeLoading: boolean;
    readonly loadingAttTypeList: boolean;
    readonly attTypes: AttType[];
    readonly section51: boolean;
    readonly bulkEntry: boolean;
    readonly noOfEntry: number;
    readonly eBillingType: eBillingType;
    readonly uncharge: boolean;
    readonly isLoginUser: boolean;
    readonly from: Recipient;
    readonly subjectPrefix: string;
    readonly subjectPrefixLoading: boolean;
    readonly sentItemIds: {
        id: string;
        internetMessageId: string;
    };

    // Civil
    readonly civilClassList: CivilClassObj[];
    readonly civilLevelList: CivilDropDownData[];

}
export const intialState: State = {};

export function reducer(state: State = intialState, action: ChaserAction.Any): State {
    const temp = {};
    switch (action.type) {
        case (ChaserAction.INIT_CHASER):
            temp[action.token] = getChaserInitView(state[action.token], action.payload.inputData);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_TYPE_VALIDATION):
            temp[action.token] = { ...state[action.token], sentItemIds: action.payload.emailmodelData };
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FE_LIST):
            temp[action.token] = getFeeEarnerList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FE_LIST_SUCCESS):
            temp[action.token] = getFeeEarnerListSuccess(state[action.token], action.payload.feeEarnerList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FE_LIST_FAIL):
            temp[action.token] = getFeeEarnerListFail(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FOLDER_LIST):
            temp[action.token] = getFolderList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FOLDER_LIST_SUCCESS):
            temp[action.token] = getFolderListSuccess(state[action.token], action.payload.folderList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FOLDER_LIST_FAIL):
            temp[action.token] = getFolderListFail(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_TIME_TYPE_LIST):
            temp[action.token] = getTimeTypeList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_TIME_TYPE_LIST_SUCCESS):
            temp[action.token] = getTimeTypeListSuccess(state[action.token], action.payload.timeTypeList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_TIME_TYPE_LIST_FAIL):
            temp[action.token] = getTimeTypeListFail(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_FE_LIST:
            temp[action.token] = changeFeeEarner(state[action.token], action.payload.selectedFeeEarner);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_FOLDER_LIST:
            temp[action.token] = changeFolder(state[action.token], action.payload.selectedFolder);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_TIME_TYPE_LIST:
            temp[action.token] = changeTimeType(state[action.token], action.payload.selectedTimeType);
            return { ...state, ...temp };
        case ChaserAction.LOAD_DEFAULT_FOLDER:
            temp[action.token] = getDefultFolderData(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.LOAD_DEFAULT_FOLDER_SUCCESS:
            temp[action.token] = getDefultFolderDataSuccess(state[action.token], action.payload.defaultFolder);
            return { ...state, ...temp };
        case ChaserAction.LOAD_DEFAULT_FOLDER_FAIL:
            temp[action.token] = getDefultFolderDataFail(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_OPEN_FILE:
            temp[action.token] = getOpenFileChange(state[action.token], action.payload.selectedMatterInfo);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_UNIT_VALUE:
            temp[action.token] = unitValueChange(state[action.token], action.payload.unitValue);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_FILE_NOTE_VALUE:
            temp[action.token] = fileNoteValueChange(state[action.token], action.payload.fileNoteValue);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FILE_NO):
            temp[action.token] = getFileNo(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FILE_NO_SUCCESS):
            temp[action.token] = getFileNoSuccess(state[action.token], action.payload.fileNo);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_FILE_NO_FAIL):
            temp[action.token] = getFileNoFail(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.SHOW_ERROR):
            temp[action.token] = addErrorToStore(state[action.token], action.payload.error);
            return { ...state, ...temp };
        case (ChaserAction.SEND_CHASER_EMAIL):
            temp[action.token] = sendChaserEmail(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.SEND_CHASER_EMAIL_SUCCESS):
            temp[action.token] = sendChaserEmailSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case (ChaserAction.SEND_CHASER_EMAIL_FAIL):
            temp[action.token] = sendChaserEmailFail(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.FEE_EARNER_RATE_VALUE_DISABLE):
            temp[action.token] = FeeEarnerRateValueDisable(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.FEE_EARNER_RATE_VALUE_DISABLE_SUCCESS):
            temp[action.token] = FeeEarnerRateValueDisableSuccess(state[action.token], action.payload.isTypeDisable);
            return { ...state, ...temp };
        case (ChaserAction.FEE_EARNER_RATE_VALUE_DISABLE_FAIL):
            temp[action.token] = FeeEarnerRateValueDisableFail(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.CLEAR_CHASER_DATA):
            temp[action.token] = clearDataByToken(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_MATTER_LIST_BY_EMAIL):
            temp[action.token] = { ...state[action.token], loadingMatterList: true };
            return { ...state, ...temp };
        case (ChaserAction.LOAD_MATTER_LIST_BY_EMAIL_SUCCESS):
            temp[action.token] = matterByEmailSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_MATTER_LIST_BY_EMAIL_FAIL):
            temp[action.token] = { ...state[action.token], loadingMatterList: false };
            return { ...state, ...temp };
        // LAKMAL - LS
        case (ChaserAction.CHECK_IS_EMAIL_ADDRESS_MAP):
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case (ChaserAction.CHECK_IS_EMAIL_ADDRESS_MAP_SUCCESS):
            temp[action.token] = { ...state[action.token], contactMapResponce: action.payload.contactMapResponce };
            return { ...state, ...temp };
        case (ChaserAction.CHECK_IS_EMAIL_ADDRESS_MAP_FAIL):
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        // LAKMAL - LS
        case (ChaserAction.LOAD_CONTACT_ROLE):
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CONTACT_ROLE_SUCCESS):
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CONTACT_ROLE_FAIL):
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        // Link matter
        case (ChaserAction.LINK_CONTACT_WITH_MATTER):
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case (ChaserAction.LINK_CONTACT_WITH_MATTER_SUCCESS):
            temp[action.token] = matterLinkSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case (ChaserAction.LINK_CONTACT_WITH_MATTER_FAIL):
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case (ChaserAction.CHASER_LOADING_DISABLE):
            temp[action.token] = chaserLoadingDisable(state[action.token]);
            return { ...state, ...temp };
        // eBilling Comment
        case (ChaserAction.LOAD_CHASER_WORK_TYPE_LIST):
            temp[action.token] = getWorkTypeList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_WORK_TYPE_LIST_SUCCESS):
            temp[action.token] = getWorkTypeListSuccess(state[action.token], action.payload.workTypeList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_WORK_TYPE_LIST_FAIL):
            temp[action.token] = getWorkTypeListFail(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CHASER_WORK_TYPE_LIST:
            temp[action.token] = changeWorkTypeList(state[action.token], action.payload);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_PHASE_LIST):
            temp[action.token] = getPhaseList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_PHASE_LIST_SUCCESS):
            temp[action.token] = getPhaseListSuccess(state[action.token], action.payload.phaseList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_PHASE_LIST_FAIL):
            temp[action.token] = getPhaseListFail(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CHASER_PHASE_LIST:
            temp[action.token] = changePhaseList(state[action.token], action.payload.selectedPhase);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_ACTIVITI_LIST):
            temp[action.token] = getActivitiList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_ACTIVITI_LIST_SUCCESS):
            temp[action.token] = getActivitiListSuccess(state[action.token], action.payload.activitiList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_ACTIVITI_LIST_FAIL):
            temp[action.token] = getActivitiListFail(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CHASER_ACTIVITI_LIST:
            temp[action.token] = changeActivitiList(state[action.token], action.payload.selectedActiviti);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_TASK_LIST):
            temp[action.token] = getTaskList(state[action.token]);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_TASK_LIST_SUCCESS):
            temp[action.token] = getTaskListSuccess(state[action.token], action.payload.taskList);
            return { ...state, ...temp };
        case (ChaserAction.LOAD_CHASER_TASK_LIST_FAIL):
            temp[action.token] = getTaskListFail(state[action.token]);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CHASER_TASK_LIST:
            temp[action.token] = changeTaskList(state[action.token], action.payload.selectedTask);
            return { ...state, ...temp };
        case ChaserAction.GET_CLASS_TYPE:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: true,
            };
            return {
                ...state, ...temp
            };
        case ChaserAction.GET_CLASS_TYPE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: false,
                classType: changeClassType(action.payload.list, 3)
            };
            return {
                ...state, ...temp
            };
        case ChaserAction.GET_CLASS_TYPE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: false
            };
            return {
                ...state, ...temp
            };
        case ChaserAction.LOAD_ATT_TYPE_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingAttTypeList: true
            };
            return { ...state, ...temp };
        case ChaserAction.LOAD_ATT_TYPE_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                attTypes: changeAttType(action.payload.attTypes, 2),
                loadingAttTypeList: false
            };
            return { ...state, ...temp };
        case ChaserAction.LOAD_ATT_TYPE_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingAttTypeList: false
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CLASS_TYPE:
            temp[action.token] = {
                ...state[action.token],
                classType: changeClassType(state[action.token].classType, action.payload.selectedClass.rectype)
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_ATT_TYPE:
            temp[action.token] = {
                ...state[action.token],
                attTypes: changeAttType(state[action.token].attTypes, action.payload.type.attId)
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_SECTION_51:
            temp[action.token] = {
                ...state[action.token],
                section51: action.payload.isSection51
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_IS_BUILK:
            temp[action.token] = {
                ...state[action.token],
                bulkEntry: action.payload.isBuilk,
                noOfEntry: !action.payload.isBuilk ? 1 : state[action.token].noOfEntry
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_NO_OF_ENTRIES:
            temp[action.token] = {
                ...state[action.token],
                noOfEntry: action.payload.noOfEntry
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_UNCHARGE:
            temp[action.token] = changeUncharge(state[action.token], action.payload.uncharged);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CHASER_PRECEDENTHS_RATE:
            temp[action.token] = changePrecedentHSRate(state[action.token], action.payload.rateValue);
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CHASER_PRECEDENTHS_UNIT:
            temp[action.token] = changePrecedentHSUnit(state[action.token], action.payload.unitValue);
            return { ...state, ...temp };

        // Civil
        case ChaserAction.GET_CIVIL_CLASS:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: true,
            };
            return {
                ...state, ...temp
            };
        case ChaserAction.GET_CIVIL_CLASS_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: false,
                civilClassList: changeCivilClassType(action.payload.list, 0)
            };
            return {
                ...state, ...temp
            };
        case ChaserAction.GET_CIVIL_CLASS_FAIL:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: false
            };
            return {
                ...state, ...temp
            };
        case ChaserAction.GET_CIVIL_LEVELS:
            temp[action.token] = {
                ...state[action.token],
                loadingAttTypeList: true
            };
            return { ...state, ...temp };
        case ChaserAction.GET_CIVIL_LEVELS_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                civilLevelList: changeCivilLevel(action.payload.list, 0),
                loadingAttTypeList: false
            };
            return { ...state, ...temp };
        case ChaserAction.GET_CIVIL_LEVELS_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingAttTypeList: false
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CIVIL_CLASS:
            temp[action.token] = {
                ...state[action.token],
                civilClassList: changeCivilClassType(state[action.token].civilClassList, action.payload.selectClasss.legalAidCaseId)
            };
            return { ...state, ...temp };
        case ChaserAction.CHANGE_CIVIL_LEVEL:
            temp[action.token] = {
                ...state[action.token],
                civilLevelList: changeCivilLevel(state[action.token].civilLevelList, action.payload.selectLevel.id),
            };
            return { ...state, ...temp };
        case ChaserAction.GET_MAIL_SUBJECT_PREFIX:
            temp[action.token] = {
                ...state[action.token],
                subjectPrefix: '',
                subjectPrefixLoading: true
            };
            return { ...state, ...temp };
        case ChaserAction.GET_MAIL_SUBJECT_PREFIX:
            temp[action.token] = {
                ...state[action.token],
                subjectPrefix: '',
                subjectPrefixLoading: true
            };
            return { ...state, ...temp };
        case ChaserAction.GET_MAIL_SUBJECT_PREFIX_SUCCESS:
            const matterInfo = state[action.token].selectedMatterInfo;
            if (matterInfo.AppID === action.payload.appId &&
                matterInfo.BranchID === action.payload.branchId &&
                matterInfo.FileID === action.payload.fileId) {
                temp[action.token] = {
                    ...state[action.token],
                    subjectPrefix: action.payload.prefix,
                    subjectPrefixLoading: false
                };
            }
            return { ...state, ...temp };
        case ChaserAction.GET_MAIL_SUBJECT_PREFIX_FAIL:
            const matInfo = state[action.token].selectedMatterInfo;
            if (matInfo.AppID === action.payload.appId &&
                matInfo.BranchID === action.payload.branchId &&
                matInfo.FileID === action.payload.fileId) {
                temp[action.token] = {
                    ...state[action.token],
                    subjectPrefixLoading: false
                };
            }
            return { ...state, ...temp };
        default:
            return state;
    }
}


function getChaserInitView(state: ChaserState, inputData: ChaserInput): Partial<ChaserState> {
    if (!inputData) {
        return state;
    }
    const openCaseTabs: any = inputData.openCaseList.map((item: OpenCaseMenueData) => {
        if (item.matterData && item.matterData.data) {
            return {
                ClientName: item.matterData.data ? item.matterData.data.clientName : '',
                MatterReferenceNo: item.matterData.data.matterReferenceNo,
                BranchID: +item.matterData.data.branchID,
                AppID: +item.matterData.data.appID,
                AppCode: item.matterData.data.app_Code,
                FileID: +item.matterData.data.fileID,
                FeeEarner: item.matterData.data.feeEarner,
                var1: item.menuDisplayText1,
                var2: item.menuDisplayText2,
                var3: item.menuDisplayText3,
                selected: false,
                source: 'open file',
                eBilling: item.matterData.data.eBilling ? item.matterData.data.eBilling : '',
                uncharge: false,
                precedentHSRate: '0.00',
                precedentHSUnit: 0.00,
            };
        } else {
            return [];
        }
    });
    // if (!state) {
    return Object.freeze({
        ...state,
        loading: true,
        init: true,
        chaserActive: false,
        loginUser: inputData.loginUser,
        fileNo: null,
        fileNote: inputData.fileNote,
        mailSubject: inputData.fileNote,
        feeEarnerList: [],
        folderList: [],
        timeTypeList: [],
        unit: inputData.unitValue,
        openCaseList: openCaseTabs,
        loadingMatterList: false,
        selectedMatterInfo: null,
        error: { isError: false, msg: '' },
        chaserSendSuccess: false,
        chaserLoading: false,
        isFeeEarnerRateValueDisable: false,
        toRecipients: inputData.toRecipients,
        contactMapResponce: null,
        isTimeRecordingEnabled: false,
        isLoginUser: inputData.isLoginUser,
        from: inputData.from,
        sentItemIds: null,
        subjectPrefix: '',
        subjectPrefixLoading: false
    });
    // } else {
    //     return state;
    // }
}

function changeClassType(classes: ClassObj[], selectetClassId: number) {
    let tempClasses: ClassObj[] = [];
    if (classes && classes.length > 0) {
        tempClasses = classes.filter(i => !i.dateclsd);
    }
    if (!tempClasses || tempClasses.length === 0) {
        return [];
    }
    if (!tempClasses.find(cl => cl.rectype === selectetClassId)) {
        return tempClasses.map((cl, i) => {
            if (i === 0) {
                return Object.freeze({ ...cl, selected: true });
            }
            return cl;
        });
    }
    return tempClasses.map((cl) => {
        if (cl.rectype === selectetClassId) {
            return Object.freeze({ ...cl, selected: true });
        } else if (cl.selected) {
            return Object.freeze({ ...cl, selected: false });
        } return cl;
    });
}

function changeAttType(type: AttType[], selectetId: number) {
    if (!type.find(t => t.attId === selectetId)) {
        return type.map((t, i) => {
            if (i === 0) {
                return Object.freeze({ ...t, selected: true });
            }
            return t;
        });
    } else {
        return type.map((t) => {
            if (t.attId === selectetId) {
                return Object.freeze({ ...t, selected: true });
            } else if (t.selected) {
                return Object.freeze({ ...t, selected: false });
            } return t;
        });
    }
}


// Civil
function changeCivilClassType(classes: CivilClassObj[], selectetClassId: number) {
    let tempClasses: CivilClassObj[] = [];
    if (classes && classes.length > 0) {
        tempClasses = classes.filter(i => !i.closeDate);
    }
    if (!tempClasses || tempClasses.length === 0) {
        return [];
    }
    if (!tempClasses.find(cl => cl.legalAidCaseId === selectetClassId)) {
        return tempClasses.map((cl, i) => {
            if (i === 0) {
                return Object.freeze({ ...cl, selected: true });
            }
            return cl;
        });
    }
    return tempClasses.map((cl) => {
        if (cl.legalAidCaseId === selectetClassId) {
            return Object.freeze({ ...cl, selected: true });
        } else if (cl.selected) {
            return Object.freeze({ ...cl, selected: false });
        } return cl;
    });
}

function changeCivilLevel(type: CivilDropDownData[], selectetId: number) {
    if (!type.find(t => t.id === selectetId)) {
        return type.map((t, i) => {
            if (i === 0) {
                return Object.freeze({ ...t, selected: true });
            }
            return t;
        });
    } else {
        return type.map((t) => {
            if (t.id === selectetId) {
                return Object.freeze({ ...t, selected: true });
            } else if (t.selected) {
                return Object.freeze({ ...t, selected: false });
            } return t;
        });
    }
}

function matterByEmailSuccess(state: ChaserState, payload: { emailMatterList: any[] }): Partial<ChaserState> {
    if (!payload || payload.emailMatterList.length === 0) {
        return { ...state, loadingMatterList: false };
    }
    const matterDataList: MatterInfo[] = payload.emailMatterList
        .filter(item => item && !state.openCaseList.find(val => val.MatterReferenceNo === item.matterRef))
        .map((item) => {
            let fileid = '';
            if (item.fileId) {
                fileid = '(' + item.fileId + ')';
            }
            return {
                ClientName: item.clientLastName ? item.clientLastName : '',
                MatterReferenceNo: item.matterRef,
                BranchID: +item.branchId,
                AppID: +item.appId,
                AppCode: item.apCode,
                FileID: +item.fileId,
                FeeEarner: item.feeEarner,
                var1: item.matterRef,
                var2: item.apCode,
                var3: fileid,
                selected: false,
                source: item.source,
                eBilling: item.eBilling ? item.eBilling : ''
            } as MatterInfo;
        });
    if (!matterDataList || matterDataList.length === 0) {
        return { ...state, loadingMatterList: false };
    } else {
        return Object.freeze({
            ...state,
            openCaseList: matterDataList.concat(state.openCaseList),
            loadingMatterList: false
            // loading: false
        });
    }
}

function chaserLoadingDisable(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        chaserEmailLoading: false,
        chaserLoading: false,
        loading: false
    });
}

function FeeEarnerRateValueDisable(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        isFeeEarnerRateValueDisable: false
    });
}
function FeeEarnerRateValueDisableSuccess(state: ChaserState, isTypeDisable: boolean): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        isFeeEarnerRateValueDisable: isTypeDisable
    });
}
function FeeEarnerRateValueDisableFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        isFeeEarnerRateValueDisable: false
    });
}

function sendChaserEmail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        chaserEmailLoading: true,
        chaserSendSuccess: false,
        chaserLoading: true,
    });
}
function sendChaserEmailSuccess(state: ChaserState, payload: any): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , chaserEmailLoading: false
        , chaserOutPutResult: payload.chaserOutPut
        , chaserSendSuccess: true,
        chaserLoading: false
    });
}
function sendChaserEmailFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        chaserEmailLoading: false,
        chaserLoading: false
    });
}

function getOpenFileChange(state: ChaserState, selectedMatterInfo: MatterInfo): Partial<ChaserState> {
    const defaultFeeEarner: FeeEarner = { user_ID: selectedMatterInfo.FeeEarner, selected: true };
    return Object.freeze({
        ...state
        , isTimeRecordingEnabled: false
        , eBillingType: selectedMatterInfo.eBilling
        , selectedMatterInfo: selectedMatterInfo
        , uncharge: false
        , precedentHSRate: '0.00'
        , precedentHSUnit: 0,
        feeEarnerList: (!!selectedMatterInfo.FeeEarner && !state.isLoginUser) ?
            changeSelectedFeeEarner(state.feeEarnerList, selectedMatterInfo.FeeEarner) :
            changeSelectedFeeEarner(state.feeEarnerList, state.loginUser)
    });
}
function unitValueChange(state: ChaserState, unitValue: number): Partial<ChaserState> {
    return Object.freeze({
        ...state, unit: unitValue
    });
}
function fileNoteValueChange(state: ChaserState, noteValue: string): Partial<ChaserState> {
    return Object.freeze({
        ...state, fileNote: noteValue
    });
}

function getFileNo(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        fileNoLoading: true,
        chaserLoading: true
    });
}
function getFileNoSuccess(state: ChaserState, fileNo: string): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , fileNoLoading: false
        , fileNo: fileNo
        , chaserLoading: false
    });
}
function getFileNoFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , fileNoLoading: false
        , chaserLoading: false
    });
}


function getFeeEarnerList(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , feeEarnerListLoading: true
        , chaserLoading: true
    });
}

function addErrorToStore(state: ChaserState, error: ChaserError): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , error: error
        , isTimeRecordingEnabled: true
    });
}

function getFeeEarnerListSuccess(state: ChaserState, feeEarnerList: FeeEarner[]): Partial<ChaserState> {
    // const getLoginUser: = state.loginUser;
    const feeEarnerWrapResponse: FeeEarner[] = feeEarnerList.map(_item => ({
        user_ID: _item.user_ID,
        selected: false
    }));


    // const feeEarnerResponse: FeeEarner[] = feeEarnerWrapResponse.map((feeEarner) => {
    //     if (state.loginUser && feeEarner.user_ID === selectesuser) {
    //         return Object.freeze({ ...feeEarner, selected: true });
    //     } else if (feeEarner.selected) {
    //         return Object.freeze({ ...feeEarner, selected: false });
    //     }
    //     return feeEarner;
    // });
    return Object.freeze({
        ...state
        , feeEarnerListLoading: false
        , feeEarnerList: (!!state.selectedMatterInfo && !!state.selectedMatterInfo.FeeEarner && !state.isLoginUser) ?
            changeSelectedFeeEarner(feeEarnerWrapResponse, state.selectedMatterInfo.FeeEarner) :
            changeSelectedFeeEarner(feeEarnerWrapResponse, state.loginUser)
        , chaserLoading: false
    });
}
function getFeeEarnerListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        feeEarnerListLoading: false,
        chaserLoading: false
    });
}

function getFolderList(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        folderListLoading: true,
        chaserLoading: true
    });
}
function getFolderListSuccess(state: ChaserState, folderList: Folder[]): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , folderListLoading: false
        , folderList: folderList
        , chaserLoading: false
    });
}
function getFolderListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , folderListLoading: false
        , chaserLoading: false
    });
}
function getTimeTypeList(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , timeTypeListLoading: true
        , chaserLoading: true
    });
}
function getTimeTypeListSuccess(state: ChaserState, timeTypeList: TimeType[]): Partial<ChaserState> {

    const timeTypeWrapResponse: TimeType[] = timeTypeList.map(_item => ({
        dtL_RecType: _item.dtL_RecType,
        dtL_Label: _item.dtL_Label,
        selected: false
    }));
    return Object.freeze({
        ...state
        , timeTypeListLoading: false
        , timeTypeList: timeTypeWrapResponse
        , chaserLoading: false
    });
}
function getTimeTypeListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , timeTypeListLoading: false
        , chaserLoading: false
    });
}

function getDefultFolderData(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , defaultFolderLoading: true
        , chaserLoading: true
    });
}
function getDefultFolderDataSuccess(state: ChaserState, folder: Folder): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , defaultFolderLoading: false
        , defaultFolder: folder
        , folderList: changeSelectedFolder(state.folderList, folder.value)
        , chaserLoading: false
    });
}
function getDefultFolderDataFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , defaultFolderLoading: false
        , chaserLoading: false
    });
}
// function getMatterDetailByMatterRef(state: ChaserState): Partial<ChaserState> {
//     return Object.freeze({ ...state, openFileChangeLoading: true });
// }
// function getMatterDetailByMatterRefSuccess(state: ChaserState, folder: Folder): Partial<ChaserState> {
//     return Object.freeze({
//         ...state
//         , openFileChangeLoading: false
//         , defaultFolder: folder
//     });
// }
// function getMatterDetailByMatterRefFail(state: ChaserState): Partial<ChaserState> {
//     return Object.freeze({ ...state, openFileChangeLoading: false });
// }
function changeFeeEarner(state: ChaserState, feeEarner: FeeEarner) {
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
function changeFolder(state: ChaserState, folder: Folder) {
    return Object.freeze({
        ...state,
        folderList: changeSelectedFolder(state.folderList, folder.value)
    });
}

function changeSelectedFolder(currentFolderList: Folder[], newFolderID: string) {
    return currentFolderList.map((folder) => {
        if (folder.value === newFolderID) {
            return Object.freeze({ ...folder, selected: true });
        } else if (folder.selected) {
            return Object.freeze({ ...folder, selected: false });
        }
        return folder;
    });
}
function changeTimeType(state: ChaserState, timeType: TimeType) {
    return Object.freeze({
        ...state,
        timeTypeList: changeSelectedTimeType(state.timeTypeList, timeType.dtL_RecType)
    });
}
function changeSelectedTimeType(currentTimeTypeList: TimeType[], newTimeTypeID: number) {
    return currentTimeTypeList.map((timeType) => {
        if (timeType.dtL_RecType === newTimeTypeID) {
            return Object.freeze({ ...timeType, selected: true });
        } else if (timeType.selected) {
            return Object.freeze({ ...timeType, selected: false });
        }
        return timeType;
    });
}

function getWorkTypeList(state: ChaserState): Partial<ChaserState> {
    return { ...state, loading: true };
}
function getWorkTypeListSuccess(state: ChaserState, workTypeList: WorkType[]): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
        , workTypeList: workTypeList
    });
}
function getWorkTypeListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
    });
}
function changeWorkTypeList(state: ChaserState, payload): Partial<ChaserState> {
    return {
        ...state,
        workTypeList: changeWorkTypeSelection(state.workTypeList, payload),
        // isDirty: true
    };
}
function getPhaseList(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        loading: true
    });
}
function getPhaseListSuccess(state: ChaserState, phaseList: PrecedentHSModel[]): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
        , phaseList: phaseList
    });
}
function getPhaseListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
    });
}
function changePhaseList(state: ChaserState, payload: PrecedentHSModel): Partial<ChaserState> {
    return {
        ...state,
        phaseList: changePrecedentHSSelection(state.phaseList, payload),
        phaseWiseTaskList: state.phaseWiseTaskList.map(item => ({ ...item, selected: false })),
        // isDirty: true
    };
}
function getActivitiList(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        loading: true
    });
}
function getActivitiListSuccess(state: ChaserState, activitiList: PrecedentHSModel[]): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
        , activitiList: activitiList
    });
}
function getActivitiListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
    });
}
function changeActivitiList(state: ChaserState, payload: PrecedentHSModel): Partial<ChaserState> {
    return {
        ...state,
        activitiList: changePrecedentHSSelection(state.activitiList, payload),
        // isDirty: true
    };
}
function getTaskList(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state,
        loading: true
    });
}
function getTaskListSuccess(state: ChaserState, taskList: PrecedentHSModel[]): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
        , phaseWiseTaskList: taskList
    });
}
function getTaskListFail(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
    });
}
function changeTaskList(state: ChaserState, selectedtask: PrecedentHSModel): Partial<ChaserState> {
    return {
        ...state,
        phaseWiseTaskList: changePrecedentHSSelection(state.phaseWiseTaskList, selectedtask),
        phaseList: state.phaseList.map(item => ({ ...item, selected: item.phaseID === selectedtask.parentId })),
        // isDirty: true
    };
}
function changePrecedentHSSelection(PrecedentHSList: PrecedentHSModel[], selectedDetails: PrecedentHSModel) {
    return PrecedentHSList.map((item) => {
        if (item.phaseID === selectedDetails.phaseID) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}
function changeWorkTypeSelection(PrecedentHSList: WorkType[], selectedDetails: WorkType) {
    return PrecedentHSList.map((item) => {
        if (item.key === selectedDetails.key) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}

function changeUncharge(state: ChaserState, value: boolean): Partial<ChaserState> {
    return {
        ...state,
        uncharge: value,
        precedentHSRate: setValue(value, state.precedentHSRate),
        precedentHSUnit: setValueUnit(value, state.precedentHSUnit),
    };
}
function changePrecedentHSRate(state: ChaserState, rate: any): Partial<ChaserState> {
    return {
        ...state,
        precedentHSRate: parseFloat(rate).toFixed(2)
    };
}
function changePrecedentHSUnit(state: ChaserState, unit: number): Partial<ChaserState> {
    return {
        ...state,
        precedentHSUnit: unit // setValue(state.uncharge, unit)
    };
}
function setValue(checkboxValue: boolean, value: any) {
    if (checkboxValue) {
        return '0.00';
    } else {
        return value;
    }
}
function setValueUnit(checkboxValue: boolean, value: any) {
    if (checkboxValue) {
        return 0;
    } else {
        return value;
    }
}
function clearDataByToken(state: ChaserState): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , chaserActive: false
        , loginUser: state.loginUser
        , fileNo: null
        , fileNote: state.mailSubject
        , folderList: []
        , timeTypeList: []
        , unit: 0
        , openCaseList: state.openCaseList
        , selectedMatterInfo: null
        , error: { isError: false, msg: '' }
        , chaserSendSuccess: false
        , chaserLoading: false
        , isFeeEarnerRateValueDisable: false
        , contactMapResponce: null
        , isTimeRecordingEnabled: false
        , uncharge: false
        , precedentHSRate: '0.00'
        , precedentHSUnit: 0
    });
}

function matterLinkSuccess(state: ChaserState, payload: any): Partial<ChaserState> {
    return Object.freeze({
        ...state
        , loading: false
        , chaserEmailLoading: false
        , chaserLoading: false
        , contactMapResponce: {
            contactEmailsViewModel: filterUnLinkContact(state, payload),
            haveOneToOneTypes: state.contactMapResponce.haveOneToOneTypes,
            oneToOneTypeListViewModel: state.contactMapResponce.oneToOneTypeListViewModel
        }
    });
}

function filterUnLinkContact(state, payload): ContactEmailsViewModel[] {
    if (payload && payload.result && payload.result.status === 'Success' && payload.sentEmailList &&
        payload.sentEmailList.length > 0) {
        return state.contactMapResponce.contactEmailsViewModel.
            filter(x => !payload.sentEmailList.find(item => item.email === x.email));
    } else {
        return state.contactMapResponce.contactEmailsViewModel;
    }
}

const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getFileNoByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.fileNo);
export const getFeeEarnerListByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.feeEarnerList);
export const getFolderListByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.folderList);
export const getTimeTypeListByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.timeTypeList);
export const getSelectedFeeEarnerByToken = (token) => createSelector(getFeeEarnerListByToken(token),
    (feeEarner) => feeEarner.find((feeEarners) => feeEarners.selected));
export const getSelectedFolderByToken = (token) => createSelector(getFolderListByToken(token),
    (folder) => folder.find((folders) => folders.selected));
export const getSelectedTimeTypeByToken = (token) => createSelector(getTimeTypeListByToken(token),
    (timeType) => timeType.find((timeTypes) => timeTypes.selected));
export const getMailSubjectToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.mailSubject);

// ebilling comment
export const getEBillingTypeByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.eBillingType : null);
export const getLoadWorkTypeListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.workTypeList : null);
export const getPhaseListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.phaseList : null);
export const getActivitiListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.activitiList : null);

export const getPrecedentRate = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.precedentHSRate : '0.00');
export const getPrecedentUnit = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.precedentHSUnit : 0.00);
export const getPrecedentValueTotal = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => {
        if (!timeRecordingState) {
            return 0.00;
        }
        if (timeRecordingState.uncharge) {
            return 0.00;
        } else {
            const unitValue = timeRecordingState.precedentHSUnit;
            const rateValue = timeRecordingState.precedentHSRate;
            const precedentValueTotal = calculateAmount(unitValue, rateValue);
            return precedentValueTotal ? precedentValueTotal : '0.00';
        }
    });
function calculateAmount(unit, rate) {
    const amount = unit * rate;
    return amount ? parseFloat(amount.toString()).toFixed(2) : '0.00';
}
export const getTaskListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => {
        if (!timeRecordingState) {
            return null;
        }
        const phase = timeRecordingState.phaseList ? timeRecordingState.phaseList.find(item => item.selected) : null;
        if (phase && timeRecordingState.phaseWiseTaskList) {
            return timeRecordingState.phaseWiseTaskList.filter(item => item.parentId === phase.phaseID);
        }
        return timeRecordingState.phaseWiseTaskList;
    });

export const getAppIdByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.selectedMatterInfo.AppID);
export const getMatterInfoByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.selectedMatterInfo);

export const getDefaultUnitByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.unit);
export const getDefaultFolderByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.defaultFolder);
export const getOpenFileByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.openCaseList);
export const getFileNoteByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.fileNote);
export const getChaserErrorByToken = (token) =>
    createSelector(getViewByToken(token), chaserState => chaserState ? chaserState.error : null);

export const getChaserSendSuccessByToken = (token) =>
    createSelector(getViewByToken(token), chaserState => chaserState ? chaserState.chaserSendSuccess : false);

export const getCommonLoading = (token) => createSelector(getViewByToken(token), (chaserState) => {
    if (chaserState && chaserState.chaserEmailLoading) {
        return true;
    }
    if (chaserState && chaserState.loading && chaserState.chaserLoading &&
        chaserState.classTypeLoading && chaserState.loadingAttTypeList) {
        return true;
    } else {
        return false;
    }
});
export const getTypeDisableValueByToken = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState.isFeeEarnerRateValueDisable);

export const getDefaultFeeEarnerByToken = (token) => createSelector(getViewByToken(token), (chaserState) => chaserState.loginUser);

export const getChaserOutDataByToken = (token) => createSelector(getViewByToken(token), (chaserState) => {
    if (chaserState && chaserState.selectedMatterInfo && chaserState.selectedMatterInfo.MatterReferenceNo) {
        const selectedTimeType = chaserState.timeTypeList.find((timeType) => timeType.selected);
        const selectedFeeEarner = chaserState.feeEarnerList.find((feeEarner) => feeEarner.selected);
        const selectedDiaryFolder = chaserState.folderList.find((folders) => folders.selected);

        const workTypeID = chaserState.workTypeList ? chaserState.workTypeList.find((detail) => detail.selected) : 0;
        const phaseID = chaserState.phaseList ? chaserState.phaseList.find((detail) => detail.selected) : 0;
        const activitiID = chaserState.activitiList ? chaserState.activitiList.find((detail) => detail.selected) : 0;
        const taskID = chaserState.phaseWiseTaskList ? chaserState.phaseWiseTaskList.find((detail) => detail.selected) : 0;
        const workType = workTypeID ? workTypeID.key : 0;
        let classId = 0;
        let subClassId = 0;
        let legalAidCaseInfoId;
        let lafundLevel;
        if (chaserState.selectedMatterInfo && chaserState.selectedMatterInfo.AppCode === MatterAppCode.CR) {
            classId = chaserState.classType && chaserState.classType.length > 0 ? chaserState.classType.find(c => c.selected).rectype : 0;
            subClassId = chaserState.attTypes && chaserState.attTypes.length > 0 ? chaserState.attTypes.find(sc => sc.selected).attId : 0
        } else if (chaserState.selectedMatterInfo && chaserState.selectedMatterInfo.AppCode === MatterAppCode.MA) {
            classId = chaserState.civilClassList && chaserState.civilClassList.find(c => c.selected) ? chaserState.civilClassList.find(c => c.selected).legalAidCaseId : 0;
            subClassId = chaserState.civilLevelList && chaserState.civilLevelList.find(c => c.selected) ? chaserState.civilLevelList.find(c => c.selected).id : 0;
            legalAidCaseInfoId = classId;
            lafundLevel = subClassId;
        }


        if (chaserState.selectedMatterInfo.eBilling === eBillingType.PrecedentH) {
            classId = workType;
        }


        const chaserModel: ChaserViewModel = {
            branchId: chaserState.selectedMatterInfo.BranchID ? chaserState.selectedMatterInfo.BranchID : 0,
            appId: chaserState.selectedMatterInfo.AppID ? chaserState.selectedMatterInfo.AppID : 0,
            fileId: chaserState.selectedMatterInfo.FileID ? chaserState.selectedMatterInfo.FileID : 0,
            appCode: chaserState.selectedMatterInfo.AppCode,
            IsOptMeChecked: true,
            feeEarner: selectedFeeEarner ? selectedFeeEarner.user_ID : chaserState.loginUser,
            diaryFoldersValue: selectedDiaryFolder ? +selectedDiaryFolder.value :
                chaserState.defaultFolder ? +chaserState.defaultFolder.value : 0,
            extraTimeUnits: chaserState.unit,
            extraTimeTypeValue: selectedTimeType ? selectedTimeType.dtL_RecType : 0,
            extraTimeType: selectedTimeType ? selectedTimeType.dtL_Label : null,
            note: chaserState.fileNote,
            fileHeaderText: GetFileHeaderText(chaserState.selectedMatterInfo.BranchID,
                chaserState.selectedMatterInfo.AppCode, chaserState.selectedMatterInfo.FileID),
            chaseDays: 1,
            chaserTextId: 1,
            matterReferenceNo: chaserState.selectedMatterInfo.MatterReferenceNo,
            fileNo: chaserState.fileNo,
            // IsChaseEmailChecked: true,
            rateCategory: chaserState.selectedMatterInfo.RateCategory,
            // New properties - Email ergent
            classSelectedIndex: 0,
            workTypeSelectedIndex: 0,
            classValue: 0,
            workTypeValue: 0,
            courtSelectedIndex: 0,
            courtValue: 0,
            eBilling: chaserState.selectedMatterInfo.eBilling,
            workType: workType,
            eBillingPhaseId: phaseID ? phaseID.phaseID : 0,
            eBillingActivityId: activitiID ? activitiID.phaseID : 0,
            eBillingTaskId: taskID ? taskID.phaseID : 0,

            numEntries: chaserState.noOfEntry,
            prepUnits: 0,
            classId: classId,
            subClassId: subClassId,
            legalAidCaseInfoId: legalAidCaseInfoId,
            lafundLevel: lafundLevel,
            uncharge: chaserState.uncharge,
            itemRate: chaserState.precedentHSRate,
            itemUnits: chaserState.precedentHSUnit
        };
        const chaserRequest: ChaserRequest = {
            chaserModel: chaserModel,
            from: chaserState.from
        };
        return chaserRequest;
    }
    //  else {
    //     return ChaserOutPutType.ChaserIgnored;
    // }
});

// LAKMAL - LS
export const getChaserRecepintList = (token) => createSelector(getViewByToken(token), (chaserState) =>
    chaserState ? chaserState.toRecipients : null);
export const getUnLinkedEmail = (token) => createSelector(getViewByToken(token), (chaserState) =>
    chaserState ? chaserState.contactMapResponce : null);

export const getTimeRecordingEnabledByToken = (token) => createSelector(getViewByToken(token), (chaserState) =>
    chaserState ? chaserState.isTimeRecordingEnabled : false);
export const getClassType = (token) => createSelector(getViewByToken(token), (chaserState) =>
    chaserState && chaserState.classType ? chaserState.classType : []);
export const getAttTypesList = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.attTypes : []);
export const getCrimeClassIdentityViewModel = (token) => createSelector(getViewByToken(token),
    (chaserState) => {
        if (chaserState && chaserState.selectedMatterInfo) {
            return {
                fileId: chaserState.selectedMatterInfo.FileID,
                branchId: chaserState.selectedMatterInfo.BranchID,
                classId: chaserState.classType.find(c => c.selected) ? chaserState.classType.find(c => c.selected).rectype : 0,
            };
        }
        return null;
    });
export const getIsSection51 = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.section51 : false);
export const getIsBulkEntry = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.bulkEntry : false);
export const getNoOfEntry = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.noOfEntry : 1);

export const getUnchargedStateByToken = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.uncharge : false);

export const getSubjectPrefixByToken = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.subjectPrefix : '');
export const getSubjectPrefixLoadingByToken = (token) => createSelector(getViewByToken(token),
    (chaserState) => chaserState ? chaserState.subjectPrefixLoading : false);

function GetFileHeaderText(branchID: number, appCode: string, fileID: number) {
    if (branchID && appCode && fileID) {
        return '(DPS:' + branchID + ':' + appCode + ':' + fileID + ')';
    } else {
        return '';
    }
}
// export const getChaserEmailLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => state.chaserEmailLoading);
export const getSentItemIdsByToken = (token) => createSelector(getViewByToken(token), (state) => state.sentItemIds);


export const getChaserEmailLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => state.chaserEmailLoading);
export const getLoadingMatterListByToken = (token) => createSelector(getViewByToken(token), (state) => state.loadingMatterList);

// civil
export const getCivilClassList = (token) => createSelector(getViewByToken(token), state =>
    state ? state.civilClassList : []);
export const getCivilLevelList = (token) => createSelector(getViewByToken(token), state =>
    state ? state.civilLevelList : []);

