import { EditData } from './../models/interfaces';
import {
    TimeRecordInputData, WorkType, Activiti, Phase,
    PhaseWiseTask, PrecedentHSModel, TimeRecordingInfo, TimeRecordingState, PrecedentHRate, PrecedentHRates, DiaryFileDetails
} from '../models/interfaces';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { FeeEarner } from '../../core/lib/fee-earner';
import { TimeRecordAddingType } from '../../time-recording-core/models/enum';
import { dpsNewDate } from '../../utils/javascriptDate';
import { eBillingType } from '../../core/lib/matter';
import { editOppertunityData } from '../../opportunity-core/reducers/opportunity';

export interface State {
    readonly views: { [token: string]: TimeRecordingState };
    readonly loadFeeEarnerList: boolean;
    readonly feeEarnerList: FeeEarner[];
    readonly activeViewToken: string;
}
const initialState: State = {
    views: {},
    loadFeeEarnerList: false,
    feeEarnerList: null,
    activeViewToken: null,
};
export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_TIME_RECORDING:
            temp[action.token] = setInitialData(state.views[action.token], action.payload.inputData, action.payload.timeOffset);
            return {
                ...state, views: { ...state.views, ...temp },
                activeViewToken: action.payload.inputData.canMinimize ? action.token : state.activeViewToken
            };
        case Actions.LOAD_DEFULT_FEEEARNER_SUCCESS:
            temp[action.token] = setDefultFeeEarner(state.views[action.token], action.payload.user, state.feeEarnerList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FEEEARNER_LIST:
            return { ...state, loadFeeEarnerList: true };
        case Actions.LOAD_FEEEARNER_LIST_SUCCESS:
            // temp[action.token] = setFeeearnerList(state.views[action.token], action.payload);
            return { ...state, feeEarnerList: action.payload.feeEarnerList, loadFeeEarnerList: false };
        case Actions.TIME_RECORDING_ERROR:
            temp[action.token] = setErrorMsg(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.REQUEST_TIME_RECORDING_INFO:
            temp[action.token] = {
                ...state.views[action.token],
                loadTimeRecordInfo: state.views[action.token].matterRefNo ? true : false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_TIME_RECORDING_INFO:
            temp[action.token] = setTimeRecordingInfo(state.views[action.token], action.payload.info);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_UNIT:
            temp[action.token] = changeUnit(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_RATE:
            temp[action.token] = changeRate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_FEEEARNER:
            temp[action.token] = changeFeeEarner(state.views[action.token], action.payload, state.feeEarnerList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_UNCHARGE:
            temp[action.token] = changeUncharge(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_DATE:
            temp[action.token] = changeDate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_DETAILS:
            temp[action.token] = changeDetails(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_NOTE:
            temp[action.token] = changeNote(state.views[action.token], action.payload.note);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SUBMIT_TIME_RECORD:
            temp[action.token] = timeRecordSubmit(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.PH_RATE_CHANGE:
            temp[action.token] = changePHRate(state.views[action.token], action.payload.pHRate);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_TIME_RECORD:
            temp[action.token] = {
                ...state.views[action.token],
                isTimeRecordStart: false,
                loading:
                    (state && state.views[action.token] && !!state.views[action.token].timeRecordAddingType &&
                        (state.views[action.token].timeRecordAddingType === TimeRecordAddingType.FloatingTimeSave)) ? false : true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.TIME_RECORD_SAVE_SUCCESS:
            temp[action.token] = timeRecordingSaveSuccess(state.views[action.token], action.payload.timeRecordId);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.TIME_RECORDING_CLOSE:
            temp[action.token] = null;
            return {
                ...state, views: { ...state.views, ...temp },
                activeViewToken: state.views[action.token].canMinimize ? null : state.activeViewToken
            };
        case Actions.SET_EDIT_DATA:
            temp[action.token] = setTimeRecordinfEditData(state.views[action.token], state.feeEarnerList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_DIARY_FILE_DATA_TIME_RECORDING_SUCCESS:
            temp[action.token] = setTimeRecordinfEditDiaryFileData(state.views[action.token], action.payload.diaryDetails);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_PH_RATE_LIST):
            temp[action.token] = getPrecedentHRateList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_PH_RATE_LIST_SUCCESS):
            temp[action.token] = getPrecedentHRateListSuccess(state.views[action.token],
                action.payload.precedentHRateList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_PH_RATE_LIST_FAIL):
            temp[action.token] = getPrecedentHRateListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };


        case (Actions.LOAD_TIME_WORK_TYPE_LIST):
            temp[action.token] = getWorkTypeList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_WORK_TYPE_LIST_SUCCESS):
            temp[action.token] = getWorkTypeListSuccess(state.views[action.token], action.payload.workTypeList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_WORK_TYPE_LIST_FAIL):
            temp[action.token] = getWorkTypeListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_TIME_WORK_TYPE_LIST:
            temp[action.token] = changeWorkTypeList(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_PHASE_LIST):
            temp[action.token] = getPhaseList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_PHASE_LIST_SUCCESS):
            temp[action.token] = getPhaseListSuccess(state.views[action.token], action.payload.phaseList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_PHASE_LIST_FAIL):
            temp[action.token] = getPhaseListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_TIME_PHASE_LIST:
            temp[action.token] = changePhaseList(state.views[action.token], action.payload.selectedPhase);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_ACTIVITI_LIST):
            temp[action.token] = getActivitiList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_ACTIVITI_LIST_SUCCESS):
            temp[action.token] = getActivitiListSuccess(state.views[action.token], action.payload.activitiList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_ACTIVITI_LIST_FAIL):
            temp[action.token] = getActivitiListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_TIME_ACTIVITI_LIST:
            temp[action.token] = changeActivitiList(state.views[action.token], action.payload.selectedActiviti);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_TASK_LIST):
            temp[action.token] = getTaskList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_TASK_LIST_SUCCESS):
            temp[action.token] = getTaskListSuccess(state.views[action.token], action.payload.taskList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_TIME_TASK_LIST_FAIL):
            temp[action.token] = getTaskListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_TIME_TASK_LIST:
            temp[action.token] = changeTaskList(state.views[action.token], action.payload.selectedTask);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHECK_TIME_RECORD_ENABLE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                matterRefNo: action.payload.matterRef,
                eBillingType: action.payload.eBilling,
                // feeEarner: changeSelectedFreeEarner(state.feeEarnerList, action.payload.feeEarner),
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHECK_TIME_RECORD_ENABLE:
            temp[action.token] = {
                ...state.views[action.token],
                loading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHECK_TIME_RECORD_ENABLE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.TIME_RECORDING_OPEN_RECORD_TIME_TAB:
            temp[action.token] = setExistingTabData(state.views[action.token], action.payload.inputData, action.payload.timeOffset);
            return {
                ...state, views: { ...state.views, ...temp },
                activeViewToken: null
            };
        case Actions.DELETE_TIME_RECORDING:
            temp[action.token] = {
                ...state.views[action.token],
                isTimeRecordStart: false,
            };
            return {
                ...state, views: { ...state.views, ...temp }
            };
        case Actions.DELETE_TIME_RECORDING_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                isTimeRecordStart: true,
            };
            return {
                ...state, views: { ...state.views, ...temp }
            };
        case Actions.DELETE_TIME_RECORDING_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isTimeRecordStart: true,
            };
            return {
                ...state, views: { ...state.views, ...temp }
            };
        case Actions.CHANG_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                user: action.payload.feeEarner, // change
                matterRefNo: action.payload.matterRef,
                clientMatterData: action.payload.clientMatterData,
            };
            return {
                ...state, views: { ...state.views, ...temp }
            };
        case Actions.TR_POPUP_MINIMIZE:
            temp[action.token] = {
                ...state.views[action.token],
                isMinimize: true,
            };
            return {
                ...state, views: { ...state.views, ...temp }
            };
        case Actions.TR_STOP_START_CLOCK:
            {
                if (state.activeViewToken && state.activeViewToken === action.token) {
                    return { ...state, views: { ...state.views, ...temp }, activeViewToken: null };
                } else if (state.activeViewToken) {
                    temp[action.token] = {
                        ...state.views[action.token],
                        isTimeRecordStart: true,
                        startTime: new Date().getTime(),
                        newlyAddedTimeValue: 0
                    };
                    return { ...state, views: { ...state.views, ...temp }, activeViewToken: action.token };
                } else if (!state.activeViewToken && action.token) {
                    temp[action.token] = {
                        ...state.views[action.token],
                        isTimeRecordStart: (action.payload && action.payload.isPulse) ? false : true,
                        startTime: new Date().getTime(),
                        newlyAddedTimeValue: 0
                    };
                    return {
                        ...state, views: {
                            ...state.views, ...temp
                        },
                        activeViewToken: (action.payload && action.payload.isPulse) ? null : action.token
                    };
                } else {
                    return state;
                }
            }
        case Actions.TIME_RECORDING_TIME_UPDATING:
            {
                if (state.activeViewToken) {
                    // const startTime = state.views[state.activeViewToken].startTime;
                    // if (!startTime) {
                    //     startTime = new Date().getTime();
                    // }
                    const timeDeference = (new Date().getTime() - state.views[state.activeViewToken].startTime) / 1000;

                    const newTime = Math.round(state.views[state.activeViewToken].timeValue +
                        (timeDeference - state.views[state.activeViewToken].newlyAddedTimeValue));

                    const unit = state.views[state.activeViewToken].mpu > 0 ?
                        Math.trunc((newTime) /
                            (state.views[state.activeViewToken].mpu * 60)) + 1 :
                        state.views[state.activeViewToken].unit;


                    temp[state.activeViewToken] = {
                        ...state.views[state.activeViewToken],
                        // timeValue: state.views[state.activeViewToken].timeValue + timeDeference,
                        timeValue: newTime,
                        unit: unit,
                        newlyAddedTimeValue: timeDeference,
                        amount: calculateAmount(state.views[state.activeViewToken].uncharge,
                            unit, state.views[state.activeViewToken].hourlyRate,
                            state.views[state.activeViewToken].mpu),
                    };
                    return { ...state, views: { ...state.views, ...temp } };
                }
                return state;
            }

        default:
            {
                return state;
            }
    }
}
function setInitialData(state: TimeRecordingState, inputData: TimeRecordInputData, timeOffset): Partial<TimeRecordingState> {
    if (!state) {
        return {
            ...state,
            newlyAddedTimeValue: 0,
            startTime: new Date().getTime(),
            loading: inputData.matterReferenceNo ? true : false,
            error: null,
            matterRefNo: inputData.matterReferenceNo,
            user: inputData.feeEarner,
            details: [],
            selectDetails: '',
            date: dpsNewDate(timeOffset).toString(),
            timeValue: 0,
            mpu: 6,
            unit: 1,
            hourlyRate: 0.00,
            amount: 0.00,
            body: '',
            uncharge: false,
            submit: false,
            saved: { isError: false, msg: '', isFloatingTimeSave: false },
            isDirty: false,
            editData: inputData.editData,
            tabDataEdit: null,
            timeRecordId: 0,
            eBillingType: inputData.eBilling,
            loadPhaseList: false,
            loadActivitiList: false,
            loadTaskList: false,
            loadWorkTypeList: false,
            loadTimeRecordInfo: false,
            canMinimize: inputData.canMinimize,
            isTimeRecordStart: true,
            timeRecordAddingType: inputData.canMinimize ? TimeRecordAddingType.FloatingTimeSave : null,
            isMinimize: false,
            clientMatterData: {
                matterDetails: inputData.clientMatterData ? inputData.clientMatterData.matterDetails : '',
                clientName: inputData.clientMatterData ? inputData.clientMatterData.clientName : ''
            },
            diaryFileDetails: {
                letterName: '',
                extension: ''
            }
        };
    }
    return {
        ...state,
        newlyAddedTimeValue: 0,
        startTime: new Date().getTime(),
        loading: inputData.matterReferenceNo ? true : false,
        isMinimize: false,
        editData: inputData.editData ? inputData.editData : null,
    };
}
function setExistingTabData(state: TimeRecordingState, inputData: TimeRecordInputData, timeOffset): Partial<TimeRecordingState> {
    return {
        ...state,
        loading: inputData.matterReferenceNo ? true : false,
        error: null,
        matterRefNo: inputData.matterReferenceNo ? inputData.matterReferenceNo : '',
        user: inputData.feeEarner ? inputData.feeEarner : '',
        details: [],
        selectDetails: inputData.tabDataEdit.details ? inputData.tabDataEdit.details : '',
        date: dpsNewDate(timeOffset).toString(),
        timeValue: inputData.tabDataEdit.timerValueSeconds,
        mpu: inputData.tabDataEdit.mpu ? inputData.tabDataEdit.mpu : 0,
        unit: inputData.tabDataEdit.unit ? inputData.tabDataEdit.unit : 1,
        hourlyRate: inputData.tabDataEdit.rate ? inputData.tabDataEdit.rate : 0.00,
        amount: inputData.tabDataEdit.value ? inputData.tabDataEdit.value : 0.00,
        body: inputData.tabDataEdit.note ? inputData.tabDataEdit.note : '',
        uncharge: inputData.tabDataEdit.uncharge ? inputData.tabDataEdit.uncharge : false,
        submit: false,
        saved: { isError: false, msg: '', isFloatingTimeSave: false },
        isDirty: false,
        editData: inputData.editData ? inputData.editData : null,
        tabDataEdit: inputData.tabDataEdit ? inputData.tabDataEdit : null,
        timeRecordId: inputData.tabDataEdit.timeRecordId,
        eBillingType: inputData.eBilling,
        loadPhaseList: false,
        loadActivitiList: false,
        loadTaskList: false,
        loadWorkTypeList: false,
        loadTimeRecordInfo: false,
        canMinimize: inputData.canMinimize ? inputData.canMinimize : false,
        isTimeRecordStart: true,
        feeEarner: inputData.feeEarner ? inputData.feeEarner : '',
        timeRecordAddingType: TimeRecordAddingType.FloatingTimeSave,
        isMinimize: true,
        workTypeList: [],
        activitiList: [],
        phaseList: [],
        phaseWiseTaskList: [],
        clientMatterData: {
            matterDetails: inputData.tabDataEdit ? inputData.tabDataEdit.matterDetails : '',
            clientName: inputData.tabDataEdit ? inputData.tabDataEdit.clientName : ''
        }
    };
}
function setErrorMsg(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    return {
        ...state,
        error: payload,
        loading: false,
        isTimeRecordStart: true,
        timeRecordAddingType: state.canMinimize ? TimeRecordAddingType.FloatingTimeSave : TimeRecordAddingType.GeneralTimeSave
    };
}
function setDefultFeeEarner(state: TimeRecordingState, payload, feeEarnerList: FeeEarner[]): Partial<TimeRecordingState> {
    const selectedFeernerGroupName = changeSelectedFreeEarner(feeEarnerList, payload);
    const selctedFeeErner = feeEarnerList.find(i => i.groupName === selectedFeernerGroupName);
    const selectedJobTitle = selctedFeeErner ? selctedFeeErner.jobTitle : null;
    return { ...state, feeEarner: changeSelectedFreeEarner(feeEarnerList, payload), selectedJobTitle: selectedJobTitle };
}
function setTimeRecordingInfo(state: TimeRecordingState, info: TimeRecordingInfo): Partial<TimeRecordingState> {
    const unit = info.unit < 1 ? 1 : info.unit;
    let hourlyRate;
    if (state.eBillingType === eBillingType.PrecedentH) {
        hourlyRate = state.selectedPhRate ? state.selectedPhRate.rate : (info.rateType === 'F') ?
            (info.feRate ? parseFloat(info.feRate.toString()).toFixed(2) : 0.00) :
            (info.rate ? parseFloat(info.rate.toString()).toFixed(2) : 0.00);
    } else {
        hourlyRate = (info.rateType === 'F') ?
            (info.feRate ? parseFloat(info.feRate.toString()).toFixed(2) : 0.00) :
            (info.rate ? parseFloat(info.rate.toString()).toFixed(2) : 0.00);
        // TFS 4005 -&& !!info.feRate
    }
    return {
        ...state,
        details: info.details,
        mpu: info.mpu,
        unit: state.canMinimize && info.mpu > 0 ?
            Math.trunc((state.timeValue) / (info.mpu * 60)) + 1 :
            parseFloat(unit.toString()).toFixed(2),
        // hourlyRate: parseFloat(info.rate.toString()).toFixed(2),
        hourlyRate: hourlyRate,
        loadTimeRecordInfo: false,
        amount: calculateAmount(false, unit, hourlyRate, info.mpu),
        loading: false,

    };
}
function changeUnit(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    const unit = payload === '0' ? '1' : payload;
    return {
        ...state,
        unit: parseFloat(unit).toFixed(2),
        amount: calculateAmount(state.uncharge, unit, state.hourlyRate, state.mpu),
        isDirty: true
    };
}
function changeRate(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    return {
        ...state,
        hourlyRate: parseFloat(payload).toFixed(2),
        amount: calculateAmount(state.uncharge, state.unit, payload, state.mpu),
        isDirty: true
    };
}
function changeUncharge(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    return {
        ...state,
        uncharge: payload,
        amount: calculateAmount(payload, state.unit, state.hourlyRate, state.mpu),
        isDirty: true
    };
}

// function setFeeearnerList(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
//     return { ...state, feeEarnerList: payload.feeEarnerList, loadFeeEarnerList: false };
// }

function changeDate(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    return { ...state, date: payload, isDirty: true };
}

function changeDetails(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    if (state) {
        return { ...state, selectDetails: payload, loading: false, isDirty: true };
    }
    return state;
}

function changeNote(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    return { ...state, body: payload, loading: false, isDirty: true };
}

function changeFeeEarner(state: TimeRecordingState, payload, feeEarnerList: FeeEarner[]): Partial<TimeRecordingState> {
    let selectedRate;
    let hourlyRate;
    if (state.eBillingType === eBillingType.PrecedentH) {

        selectedRate = state.precedentHRateList.find(a => a.type === payload.jobTitle);
        hourlyRate = selectedRate ? selectedRate.rate : 0.00;

    }
    return {
        ...state,
        feeEarner: changeSelectedFreeEarner(feeEarnerList, payload.groupName),
        isDirty: true,
        selectedPhRate: selectedRate ? selectedRate : state.selectedPhRate,
        hourlyRate: hourlyRate ? hourlyRate : state.hourlyRate,
        selectedJobTitle: payload.jobTitle
    };
}

function changePHRate(state: TimeRecordingState, changeVal: PrecedentHRates) {
    if (state.eBillingType === eBillingType.PrecedentH && !!changeVal) {
        return {
            ...state,
            isDirty: true,
            hourlyRate: changeVal.rate,
            selectedPhRate: changeVal,
            amount: calculateAmount(false, state.unit, changeVal.rate, state.mpu),
            selectedJobTitle: changeVal.type

        };
    } else {
        return state;
    }

}

function timeRecordSubmit(state: TimeRecordingState): Partial<TimeRecordingState> {
    return {
        ...state,
        submit: true,
        timeRecordAddingType: (state && state.canMinimize) ?
            TimeRecordAddingType.FloatingTimeUnpostToPost : TimeRecordAddingType.GeneralTimeSave
    };
}

function timeRecordingSaveSuccess(state: TimeRecordingState, TimeRecordingId: number): Partial<TimeRecordingState> {
    return {
        ...state,
        timeRecordId: TimeRecordingId,
        isTimeRecordStart: true,
        saved: {
            isError: false,
            msg: 'Time Recording Save Success !',
            isFloatingTimeSave: (state && state.timeRecordAddingType &&
                (state.timeRecordAddingType === TimeRecordAddingType.FloatingTimeSave)) ? true : false
        },
        loading: false
    };
}
function setTimeRecordinfEditDiaryFileData(state: TimeRecordingState, diaryDetails: DiaryFileDetails) {
    return {
        ...state,
        loading: false,
        diaryFileDetails: {
            letterName: diaryDetails.letterName,
            extension: diaryDetails.extension
        }
    };
}
function setTimeRecordinfEditData(state: TimeRecordingState, feeEarnerList: FeeEarner[]): Partial<TimeRecordingState> {
    if (!!state.editData && !state.isSetEditData && !state.loading) {
        let workTypeList = state.workTypeList;
        let phaseList = state.phaseList;
        let activitiList = state.activitiList;
        let phaseWiseTaskList = state.phaseWiseTaskList;
        if (workTypeList && workTypeList.length > 0 && state.editData && state.editData.workType) {
            workTypeList = setWorkTypeSelection(state.workTypeList, state.editData.workType);
        }
        if (phaseList && phaseList.length > 0 && state.editData && state.editData.eBillingPhaseID) {
            phaseList = setSelection(state.phaseList, state.editData.eBillingPhaseID);
        }
        if (activitiList && activitiList.length > 0 && state.editData && state.editData.eBillingActivityID) {
            activitiList = setSelection(state.activitiList, state.editData.eBillingActivityID);
        }
        if (phaseWiseTaskList && phaseWiseTaskList.length > 0 && state.editData && state.editData.eBillingTaskID) {
            phaseWiseTaskList = setSelection(state.phaseWiseTaskList, state.editData.eBillingTaskID);
        }
        return {
            ...state,
            matterRefNo: state.editData.matterReferenceNo,
            mpu: state.editData.mpu,
            unit: state.editData.units,
            amount: state.editData.value,
            hourlyRate: state.editData.rate,
            body: state.editData.timeEditNote,
            date: state.editData.postingDate,
            feeEarner: changeSelectedFreeEarner(feeEarnerList, state.editData.timeFeeEarner),
            selectDetails: state.editData.timeEditDetails,
            timeRecordId: state.editData.timeUniqueRef,
            uncharge: state.editData.value <= 0,
            isSetEditData: true,
            workTypeList: workTypeList,
            activitiList: activitiList,
            phaseList: phaseList,
            phaseWiseTaskList: phaseWiseTaskList
        };
    } else if (!!state.editData && !state.loading) {
        return {
            ...state,
            mpu: state.editData.mpu,
            unit: state.editData.units,
            amount: state.editData.value,
            hourlyRate: state.editData.rate,
        }
    } else {
        return state;
    }
}
function setWorkTypeSelection(workTypeList: WorkType[], selectedId: any) {
    return workTypeList.map((item) => {
        if (item.key === selectedId) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}
function setSelection(precedentHSModel: PrecedentHSModel[], selectedId: any) {
    return precedentHSModel.map((item) => {
        if (item.phaseID === selectedId) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}


function calculateAmount(uncharge: boolean, unit, rate, mpu) {
    const amount = (unit * rate) * mpu / 60;
    return uncharge ? '0.00' : parseFloat(amount.toString()).toFixed(2);
}

function changeSelectedFreeEarner(currentFeeEarnerList: FeeEarner[], user: string) {
    if (currentFeeEarnerList.find((feeEarner) => feeEarner.groupName === user)) {
        return user;
    } else if (currentFeeEarnerList.length > 0) {
        return currentFeeEarnerList[0].groupName;
    }
    return '';
}
function getPrecedentHRateList(state: TimeRecordingState): Partial<TimeRecordingState> {
    return { ...state, loadWorkTypeList: true };
}
function getPrecedentHRateListSuccess(state: TimeRecordingState, precedentHRateList: any[]): Partial<TimeRecordingState> {
    let rateListData = [];
    if (precedentHRateList && precedentHRateList.length > 0 && state.tabDataEdit && state.tabDataEdit.workType) {
        rateListData = setWorkTypeSelection(precedentHRateList, state.tabDataEdit.workType);
    } else {
        rateListData = precedentHRateList;
    }

    let selectedRate;
    let hourlyRate;
    if (state.eBillingType === eBillingType.PrecedentH && !!state.selectedJobTitle) {
        selectedRate = precedentHRateList && precedentHRateList.length >
            0 ? precedentHRateList.find(a => a.type === state.selectedJobTitle) : null;
        hourlyRate = selectedRate ? selectedRate.rate : 0.00;

    }

    return Object.freeze({
        ...state
        , loadWorkTypeList: false
        , precedentHRateList: rateListData
        , selectedPhRate: selectedRate ? selectedRate : state.selectedPhRate
        , hourlyRate: hourlyRate ? hourlyRate : state.hourlyRate

    });
}
function getPrecedentHRateListFail(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state
        , loadWorkTypeList: false
    });
}



function getWorkTypeList(state: TimeRecordingState): Partial<TimeRecordingState> {
    return { ...state, loadWorkTypeList: true };
}
function getWorkTypeListSuccess(state: TimeRecordingState, workTypeList: WorkType[]): Partial<TimeRecordingState> {
    let workTypeListData = [];
    if (workTypeList && workTypeList.length > 0 && state.tabDataEdit && state.tabDataEdit.workType) {
        workTypeListData = setWorkTypeSelection(workTypeList, state.tabDataEdit.workType);
    } else {
        workTypeListData = workTypeList;
    }
    return Object.freeze({
        ...state
        , loadWorkTypeList: false
        , workTypeList: workTypeListData
    });
}
function getWorkTypeListFail(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state
        , loadWorkTypeList: false
    });
}
function changeWorkTypeList(state: TimeRecordingState, payload): Partial<TimeRecordingState> {
    return {
        ...state,
        workTypeList: changeWorkTypeSelection(state.workTypeList, payload),
        isDirty: true
    };
}
function getPhaseList(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state,
        loadPhaseList: true
    });
}
function getPhaseListSuccess(state: TimeRecordingState, phaseList: Phase[]): Partial<TimeRecordingState> {
    let phaseListData = [];
    if (phaseList && phaseList.length > 0 && state.tabDataEdit && state.tabDataEdit.eBillingPhaseID) {
        phaseListData = setSelection(phaseList, state.tabDataEdit.eBillingPhaseID);
    } else {
        phaseListData = phaseList;
    }
    return Object.freeze({
        ...state
        , loadPhaseList: false
        , phaseList: phaseListData
    });
}
function getPhaseListFail(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state
        , loadPhaseList: false
    });
}
function changePhaseList(state: TimeRecordingState, payload: PrecedentHSModel): Partial<TimeRecordingState> {
    return {
        ...state,
        phaseList: changePrecedentHSSelection(state.phaseList, payload),
        phaseWiseTaskList: state.phaseWiseTaskList.map(item => ({ ...item, selected: false })),
        isDirty: true
    };
}
function getActivitiList(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state,
        loadActivitiList: true
    });
}
function getActivitiListSuccess(state: TimeRecordingState, activitiList: Activiti[]): Partial<TimeRecordingState> {
    let activitiListData = [];
    if (activitiList && activitiList.length > 0 && state.tabDataEdit && state.tabDataEdit.eBillingActivityID) {
        activitiListData = setSelection(activitiList, state.tabDataEdit.eBillingActivityID);
    } else {
        activitiListData = activitiList;
    }
    return Object.freeze({
        ...state
        , loadActivitiList: false
        , activitiList: activitiListData
    });
}
function getActivitiListFail(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state
        , loadActivitiList: false
    });
}
function changeActivitiList(state: TimeRecordingState, payload: PrecedentHSModel): Partial<TimeRecordingState> {
    return {
        ...state,
        activitiList: changePrecedentHSSelection(state.activitiList, payload),
        isDirty: true
    };
}
function getTaskList(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state,
        loadTaskList: true
    });
}
function getTaskListSuccess(state: TimeRecordingState, taskList: PhaseWiseTask[]): Partial<TimeRecordingState> {
    let taskListData = [];
    if (taskList && taskList.length > 0 && state.tabDataEdit && state.tabDataEdit.eBillingTaskID) {
        taskListData = setSelection(taskList, state.tabDataEdit.eBillingTaskID);
    } else {
        taskListData = taskList;
    }
    return Object.freeze({
        ...state
        , loadTaskList: false
        , phaseWiseTaskList: taskListData
    });
}
function getTaskListFail(state: TimeRecordingState): Partial<TimeRecordingState> {
    return Object.freeze({
        ...state
        , loadTaskList: false
    });
}
function changeTaskList(state: TimeRecordingState, selectedtask: PrecedentHSModel): Partial<TimeRecordingState> {
    return {
        ...state,
        phaseWiseTaskList: changePrecedentHSSelection(state.phaseWiseTaskList, selectedtask),
        phaseList: state.phaseList.map(item => ({ ...item, selected: item.phaseID === selectedtask.parentId })),
        isDirty: true
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
export const getState = (state: State) => state;
export const getViews = (state: State) => state.views;
export const getCanMinimizeViews = (state: State) =>
    Object.keys(state.views)
        .filter(val => state.views[val] && state.views[val].canMinimize)
        .map(val => ({ token: val, view: state.views[val], isActive: val === state.activeViewToken }))
        .sort((a, b) => new Date(a.view.date).valueOf() > new Date(b.view.date).valueOf() ? 1 :
            (new Date(a.view.date).valueOf() < new Date(b.view.date).valueOf() ? -1 : 0));

export const getFeeEarnerList = (state: State) => state.feeEarnerList;
export const getLoadFeeEarnerList = (state: State) => state.loadFeeEarnerList;
export const getViewByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getDetailListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.details : []);
export const getselectedDetailByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.selectDetails : null);
export const getMatterReferenceNoByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.matterRefNo : null);
export const getClientMatterDataByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.clientMatterData : null);
export const getIsLoadingByToken = (token) => createSelector(getLoadFeeEarnerList, getViewByToken(token),
    (loadFeeEarnerList, timeRecordingState) => {
        if (timeRecordingState &&
            (timeRecordingState.loadActivitiList ||
                loadFeeEarnerList ||
                timeRecordingState.loading ||
                timeRecordingState.loadPhaseList ||
                timeRecordingState.loadTaskList ||
                timeRecordingState.loadTimeRecordInfo ||
                timeRecordingState.loadWorkTypeList)) {
            return true;
        } else {
            return false;
        }
    });
export const getFeeEarnerListByToken = (token) => createSelector(getFeeEarnerList, getViewByToken(token),
    (feeEarnerList, timeRecordingState) => feeEarnerList && timeRecordingState ?
        feeEarnerList.map(val => ({ ...val, selected: timeRecordingState.feeEarner === val.groupName })) : null);
export const getErrorDetailsByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.error : null);
export const getTimeRecordingUserByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.user : null);
export const getSelectedFeeEarnerByToken = (token) => createSelector(getFeeEarnerList, getViewByToken(token),
    (feeEarnerList, timeRecordingState) => feeEarnerList && timeRecordingState ?
        feeEarnerList.find((feeEarner) => feeEarner.groupName === timeRecordingState.feeEarner) : null);
export const getTimeRecordingDateByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.date : null);
export const getMPUByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.mpu : null);
export const getUnitByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.unit : null);
export const getHourlyRateByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.hourlyRate : null);
export const getAmountByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.amount : null);
export const getBodyTextByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.body : null);
export const getUnchargeStateByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.uncharge : null);
export const getSaveStateToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.saved : null);
export const getIsDirtyByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.isDirty : null);
export const getTimeRecordEditDataByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.editData : null);
// ebilling comment
export const getEBillingTypeByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.eBillingType : null);
export const getLoadWorkTypeListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.workTypeList : null);

export const getLoadPrecedentHRateByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.precedentHRateList : null);
export const getPhaseListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.phaseList : null);
export const getActivitiListByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.activitiList : null);
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
export const getIsActiveTokenByToken = (token) => createSelector(getState,
    (state) => state ? state.activeViewToken === token : false);

export const getTimeValueByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.timeValue : 0);
export const getIsTimerStartByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.isTimeRecordStart : false);
export const isMinimizePopupByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.isMinimize : false);

export const getSelectedPhRateByToken = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.selectedPhRate : null);
export const getSelectedJobTitle = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.selectedJobTitle : null);
export const getDiaryFileDetails = (token) => createSelector(getViewByToken(token),
    (timeRecordingState) => timeRecordingState ? timeRecordingState.diaryFileDetails : null);
