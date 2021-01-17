import { createSelector } from '@ngrx/store';
import * as Action from '../actions/core';
import { CrimeManagementInput } from '../../core/lib/crime-managment';
import { CrimeClassRequestModel, ClassObj, ClassTotalsViewModel } from '../models/interfaces';
import { UpdateModelType } from '../models/enum';
import { ClassType } from '../../core/lib/timeRecord';
import { dpsNewDate } from '../../utils/javascriptDate';

export interface State {
    readonly [token: string]: CrimeManagementState;
}

export interface CrimeManagementState {
    readonly classListLoading: boolean;
    readonly classTypeLoading: boolean;
    readonly loading: boolean;
    readonly rateFileloading: boolean;
    readonly classList: ClassObj[];
    readonly classType: ClassType[];
    readonly input: CrimeManagementInput;
    readonly isPopup: boolean;
    readonly addClassModel: CrimeClassRequestModel;
}

const initialState: State = {

};

export function reducer(state: State = initialState, action: Action.Any): State {
    const temp = {};
    switch (action.type) {
        case Action.INIT_CRIME_MANAGEMENT:
            temp[action.token] = intitState(state[action.token], action.payload);
            return {
                ...state, ...temp,
            };
        case Action.GET_CLASS_LIST:
            temp[action.token] = {
                ...state[action.token],
                classListLoading: true,
            };
            return {
                ...state, ...temp
            };
        case Action.GET_CLASS_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                classListLoading: false,
                classList: action.payload.list
            };
            return {
                ...state, ...temp
            };
        case Action.GET_CLASS_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                classListLoading: false
            };
            return {
                ...state, ...temp
            };
        case Action.GET_CLASS_TYPE:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: state[action.token] && !!state[action.token].classType ? false : true
            };
            return {
                ...state, ...temp
            };
        case Action.GET_CLASS_TYPE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: false,
                classType: action.payload.list
            };
            return {
                ...state, ...temp
            };
        case Action.GET_CLASS_TYPE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                classTypeLoading: false
            };
            return {
                ...state, ...temp
            };
        case Action.UPDATE_ADD_CLASS_MODEL:
            temp[action.token] = chanageAddClassModel(state[action.token], action.payload.changes);
            return {
                ...state, ...temp
            };
        case Action.ADD_NEW_CLASS:
            temp[action.token] = {
                ...state[action.token],
                loading: true
            };
            return {
                ...state, ...temp
            };
        case Action.ADD_NEW_CLASS_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return {
                ...state, ...temp
            };
        case Action.ADD_NEW_CLASS_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return {
                ...state, ...temp
            };
        case Action.SHOW_MSG:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return {
                ...state, ...temp
            };


        // case Action.GET_CRIME_RATE_FILES:

        //     temp[action.token] = {
        //         ...state[action.token],
        //         rateFileloading: true,
        //     };
        //     return { ...state, ...temp };

        // case Action.GET_CRIME_RATE_FILES_FAIL:
        //     temp[action.token] = {
        //         ...state[action.token],
        //         rateFileloading: false,
        //     };
        //     return { ...state, ...temp };

        // case Action.GET_CRIME_RATE_FILES_SUCCESS:

        //     temp[action.token] = {
        //         ...state[action.token],
        //         rateFileloading: false,
        //     };
        //     return { ...state, ...temp };
        case Action.DELETE_CLASS:

            temp[action.token] = {
                ...state[action.token],
                loading: true,
            };
            return { ...state, ...temp };

        case Action.DELETE_CLASS_SUCCESS:

            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };

        case Action.DELETE_CLASS_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };
        case Action.GET_CLASS_TOTAL:
            temp[action.token] = {
                ...state[action.token],
                classList: setClassTotal(state[action.token].classList, action.classInfo.rectype),
            };
            return { ...state, ...temp };
        case Action.GET_CLASS_TOTAL_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                classList: setClassTotal(state[action.token].classList, action.payLoad.classId, action.payLoad.total),
            };
            return { ...state, ...temp };
        default:
            return state;
    }
}

function intitState(state: CrimeManagementState, payload: { inputData: CrimeManagementInput, isPopup: boolean, timeOffset }) {
    if (!state) {
        return {
            classListLoading: false,
            rateFileloading: false,
            isPopup: payload.isPopup,
            input: payload.inputData,
            classList: payload.inputData.classList || [],
            addClassModel: {
                classId: 0,
                className: '',
                openDate: dpsNewDate(payload.timeOffset)
            }
        };
    } else {
        return {
            ...state,
            classListLoading: false,
            rateFileloading: false,
            classTypeLoading: false,
            input: payload.inputData,
            addClassModel: {
                classId: 0,
                classTypeText: '',
                className: '',
                openDate: dpsNewDate(payload.timeOffset)
            }
        };
    }

}

function chanageAddClassModel(state: CrimeManagementState, payload: { kind: UpdateModelType, value: string | number }) {
    switch (payload.kind) {
        case UpdateModelType.ClassType: {
            return {
                ...state,
                addClassModel: {
                    ...state.addClassModel,
                    classId: payload.value
                }
            };
        }
        case UpdateModelType.ClassName: {
            return {
                ...state,
                addClassModel: {
                    ...state.addClassModel,
                    className: payload.value
                }
            };
        }
        case UpdateModelType.OpenDate: {
            return {
                ...state,
                addClassModel: {
                    ...state.addClassModel,
                    openDate: payload.value
                }
            };
        }
        default:
            return state;
    }
}

function setClassTotal(classList: ClassObj[], classId: number, total: ClassTotalsViewModel = null) {
    if (classList && classList.length > 0) {
        return classList.map(i => {
            if (i.rectype === classId) {
                return { ...i, classTotalsViewModel: total };
            } else {
                return i;
            }
        });
    }
    return classList;
}
const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (state) => state[token]);
export const getIsLoading = (token) => createSelector(getStateByToken(token), (cmState) => {
    if (cmState && (cmState.classListLoading || cmState.classTypeLoading)) {
        return true;
    } else {
        return false;
    }
});

export const getRateFileloading = (token) => createSelector(getStateByToken(token), (cmState) => cmState ? cmState.rateFileloading : null);
export const getInputData = (token) => createSelector(getStateByToken(token), (cmState) => cmState ? cmState.input : null);
export const getClassList = (token) => createSelector(getStateByToken(token), (cmState) => cmState ? cmState.classList : []);
export const getClassType = (token) => createSelector(getStateByToken(token), (cmState) => cmState ? cmState.classType : []);
export const getAddClassModel = (token) => createSelector(getStateByToken(token), (cmState) => cmState ? cmState.addClassModel : null);
