import { CrimeClassTotalsSummaryViewModel, getRunTimeCaseTypeList } from './../../core/lib/crime-managment';
import * as Actions from '../actions/class-information';
import { createSelector } from '@ngrx/store';
import { ModelProperty, Controls, LoadinState, CommittedToCrownCourtType } from '../models/enum';
import { ProceedingClassInfoViewModal, LeadUfnTotalSummary } from '../models/interfaces';
import { DropDownItem, ControlerProperty } from '../../core/lib/crime-managment';
import { LoockupItem } from '../../shared';
import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';

export interface State {
    readonly [token: string]: ClassInformationState;
}

const initialState: State = {};

export interface ClassInformationState {
    readonly loadingData: { [loadingState: string]: boolean };
    readonly model: ProceedingClassInfoViewModal;
    readonly controlerProperty: ControlerProperty;
    readonly stageReachedList: DropDownItem[];
    readonly outComeCode: DropDownItem[];
    readonly matterType: DropDownItem[];
    readonly caseTypes: DropDownItem[];
    readonly locations: LoockupItem[];
    readonly classIdentity: CrimeClassIdentityViewModel;
    readonly totalSummery: CrimeClassTotalsSummaryViewModel;
    readonly leadUfnTotalSummary: LeadUfnTotalSummary;
}

export function reducer(state: State = initialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case Actions.INIT_PROCEEDING_CASE_INFORMATION:
            temp[action.token] = initialStateData(action.crimeClassIdentityViewModel);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_MODEL:
            temp[action.token] = changeModel(state.views[action.token], action.event);
            return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.stageReached, true)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         stageReachedList: setDropDownList(action.list, 4),
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.stageReached, false)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.matterType, true)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         matterType: setDropDownList(action.list, 2),
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.matterType, false)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_OUT_COME_CODE_VALUES_FOR_PROEEDING_CLS_INFO:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.outComeCode, true)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_OUT_COME_CODE_VALUES_SUCCESS_FOR_PROEEDING_CLS_INFO:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         outComeCode: setDropDownList(action.list, 4),
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.outComeCode, false)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_CASE_TYPE_FOR_PROEEDING_CLS_INFO:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.caseType, true)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_CASE_TYPE_SUCCESS_FOR_PROEEDING_CLS_INFO:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         caseTypes: setDropDownList(action.list, 3, true),
        //         loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.caseType, false)
        //     };
        //     return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_LOCATION_LOOKUP_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, true)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_LOCATION_LOOKUP_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token], isLoading: false,
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, false)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_LOCATION_LOOKUP_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, false)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPEN_LOOKUP_POPUP:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, false)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_INFO:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, true)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_INFO_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, false),
                model: action.data.proceedingClassInf,
                totalSummery: action.data.classTotalSummary,
                leadUfnTotalSummary: action.data.leadUfnTotalSummary,
                stageReachedList: setDropDownList(action.data.dropDownValues.stageReachedCodes, 4),
                matterType: setDropDownList(action.data.dropDownValues.matterTypes, 2),
                outComeCode: setDropDownList(action.data.dropDownValues.outcomeCodes, 4),
                caseTypes: setDropDownList(action.data.dropDownValues.caseTypes, 3, true),
                controlerProperty: setupController(!!action.data.proceedingClassInf[ModelProperty.closedDate]),
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_INFO_FAIL:
            temp[action.token] = { ...state.views[action.token] };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_TOTAL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.total, true)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_TOTAL_SUCCESS:
            const classTotalSummary = action.totalData.classTotalSummary;
            delete action.totalData.classTotalSummary;
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.total, false),
                model: { ...state.views[action.token].model, ...action.totalData },
                totalSummery: classTotalSummary
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_TOTAL_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.total, false)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, true)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, false)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingData: changeLoadingState(state.views[action.token].loadingData, LoadinState.modelData, false)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_CLASS:
            temp[action.token] = closeClass(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.RE_OPEN_CLASS:
            temp[action.token] = reOpenClass(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        default:
            return state;
    }
}


function initialStateData(classIdentity: CrimeClassIdentityViewModel): ClassInformationState {
    return {
        loadingData: {
            [LoadinState.modelData]: false,
            [LoadinState.total]: false,
        }
        ,
        model: null,
        stageReachedList: [],
        outComeCode: [],
        matterType: [],
        caseTypes: [],
        locations: [],
        classIdentity: classIdentity,
        controlerProperty: setupController(false),
        totalSummery: null,
        leadUfnTotalSummary: null
    };
}

function changeModel(state: ClassInformationState, event: { key: ModelProperty, value: any }): ClassInformationState {
    const temp = {};
    temp[event.key] = event.value;
    let newState = { ...state, model: { ...state.model, ...temp } };
    switch (event.key) {
        case ModelProperty.roNotGranted:
        case ModelProperty.urbanRates: {
            const runTimeStateReList = geRunTimeStageReachedList(newState);
            if (!!runTimeStateReList && runTimeStateReList.length > 0) {
                const selectedItem = runTimeStateReList.find(i => i.key === newState.model.stageReached);
                temp[ModelProperty.stageReached] = !!selectedItem ? selectedItem.key : null;
            }
            break;
        } case ModelProperty.stageReached: {
            if (event.value === 'PROV') {
                temp[ModelProperty.locationId] = 'CCHC';
                temp[ModelProperty.locationName] = 'High Court, Country Court or Crown Court';
            }
            break;
        } case ModelProperty.committedToCrownCourt: {
            if (!!event.value) {
                temp[ModelProperty.committedToCrownCourtType] = CommittedToCrownCourtType.indictable;
            }
            break;
        }
        default:
            break;
    }
    newState = { ...state, model: { ...state.model, ...temp } };
    return newState;
}

function setDropDownList(list: string[], lengthOfKey: number, isFullValue = false): DropDownItem[] {
    const temp: DropDownItem[] = [];
    if (list && list.length > 0) {
        list.forEach(i => temp.push({
            key: (i.substr(0, lengthOfKey)).trim(),
            value: !!isFullValue ? i : (i.substr(lengthOfKey + 1, i.length).trim())
        }));
    }
    return temp;
}

function closeClass(infoState: ClassInformationState): ClassInformationState {
    const temp = {};
    temp[ModelProperty.billedDate] = new Date().toDpsString(true);
    temp[ModelProperty.closedDate] = new Date().toDpsString(true);
    return {
        ...infoState, model: { ...infoState.model, ...temp, },
        controlerProperty: setupController(true, true),
    };
}

function reOpenClass(infoState: ClassInformationState): ClassInformationState {
    const temp = {};
    if (!!infoState.model && !!infoState.model[ModelProperty.closedDate]) {
        temp[ModelProperty.closedDate] = null;
    }
    return {
        ...infoState, model: { ...infoState.model, ...temp },
        controlerProperty: setupController(false, true),
    };
}

function geRunTimeStageReachedList(infoState: ClassInformationState): DropDownItem[] {
    const tempList: DropDownItem[] = [];
    if (!!infoState && !!infoState.stageReachedList && !!infoState.model) {
        infoState.stageReachedList.forEach(i => {
            const sRCode = i.key;
            if (sRCode === 'PROJ') {
                return;
            } else if (infoState.model.roNotGranted) {
                if (sRCode !== 'PROP') {
                    return;
                }
            } else if ((infoState.model[ModelProperty.urbanRates])
                && (sRCode === 'PROE' || sRCode === 'PROF' || sRCode === 'PROG')) {
                return;
            } else if ((!infoState.model[ModelProperty.urbanRates])
                && (sRCode === 'PROK' || sRCode === 'PROL' || sRCode === 'PROM')) {
                return;
            }
            tempList.push(i);
        });
    }
    return tempList;
}
function setupController(isClassClose: boolean, changeClose?: boolean):
    ControlerProperty {
    const tem = {};
    tem[Controls.btnSave] = {
        enabled: changeClose ? true : !isClassClose,
        visible: true
    };
    tem[Controls.dtpCloseDate] = {
        enabled: true,
        visible: isClassClose ? true : false
    };
    tem[Controls.dtpBillDate] = {
        enabled: true,
        visible: isClassClose ? true : false
    };
    return tem;
}

function changeLoadingState(loadingState: { [loadingState: string]: boolean }[],
    changePropert: LoadinState, isLoading: boolean): { [loadingState: string]: boolean }[] {
    const temp = { [changePropert]: isLoading };
    return { ...loadingState, ...temp };
}

export const getViews = (state: State) => state.views;
export const getStateByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getIsLoadingByToken = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) => {
    if (infoState &&
        !!infoState.loadingData[LoadinState.modelData] ||
        !!infoState.loadingData[LoadinState.total]) {
        return true;
    } else {
        return false;
    }
}
);
export const getClassIdentity = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.classIdentity : null);
export const getInfomationModel = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.model : null);
// export const getTotal = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
//     infoState ? infoState.total : null);
export const getStageReachedList = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.stageReachedList : []);
export const getMatterTypeList = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.matterType : []);
export const getOutComeCodeList = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.outComeCode : []);
export const getCaseTypeList = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.caseTypes : []);
export const getFilterdStageReachedList = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    geRunTimeStageReachedList(infoState));
export const getFilterdCaseTypeList = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState && infoState.model ? getRunTimeCaseTypeList(infoState.caseTypes, infoState.model.stageReached) : []);
export const getLocationLookupDataByToken = (token) => createSelector(getStateByToken(token), (infoState: ClassInformationState) =>
    infoState ? infoState.locations : []);
export const getUIControllerProperty = (token) => createSelector(getStateByToken(token), infoState => {
    return infoState.controlerProperty;
});
export const getTotalSummery = (token) => createSelector(getStateByToken(token), infoState => infoState.totalSummery);
export const getLeadUfnTotalSummary = (token) => createSelector(getStateByToken(token), infoState => infoState.leadUfnTotalSummary);
