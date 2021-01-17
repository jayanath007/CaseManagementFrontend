import { DropdownListItem, MasterDataViewModel, DepartmentWithMatterAndAppCode, FeeEarnerInfo } from '../model/interface';
import * as Actions from '../actions/master-data';
import { LookupList } from '../../core';
import { LookupType, LoockupItem } from '../../shared';

export interface LookupListData {
    readonly [token: string]: LookupList[];
}


export interface CrimeLookupListData {
    readonly [token: string]: LoockupItem[];
}

export interface State {
    readonly departmentList: MasterDataViewModel<DepartmentWithMatterAndAppCode[]>;
    readonly workTypeList: MasterDataViewModel<DropdownListItem[]>;
    readonly lookupListData: LookupListData;
    readonly crimeLookupListData: {};
    readonly feeEarners: { [key: string]: FeeEarnerInfo[] };
    readonly branchList: DropdownListItem[];
}

const initialstate: Readonly<State> = Object.freeze<State>({
    departmentList: { data: [], isLoading: false },
    workTypeList: { data: [], isLoading: false },
    lookupListData: {},
    crimeLookupListData: {},
    feeEarners: {},
    branchList: []
});

export function reducer(state: Readonly<State> = initialstate, action: Actions.Any): Readonly<State> {
    switch (action.type) {
        case Actions.GET_DEPARTMENT_LIST_SUCCESS:
            return { ...state, departmentList: { data: action.payload.departmentList, isLoading: false } };
        case Actions.GET_DEPARTMENT_LIST_FAIL:
            return { ...state, departmentList: { data: [], isLoading: false } };
        case Actions.GET_WORK_TYPE_LIST_SUCCESS:
            return { ...state, workTypeList: { data: action.payload.workTypeList, isLoading: false } };
        case Actions.GET_WORK_TYPE_LIST_FAIL:
            return { ...state, departmentList: { data: [], isLoading: false } };
        case Actions.GET_LOOCKUP_LIST_SUCCESS:
            const temList = {};
            temList[action.payload.data.luT_Type] = action.payload.data.lookupViewModels;
            return { ...state, lookupListData: { ...state.lookupListData, ...temList } };
        case Actions.GET_CRIME_LOOCKUP_LIST_SUCCESS:
            const temCrimeLkList = {};
            temCrimeLkList[action.payload.lookupType] = action.payload.data;
            return { ...state, crimeLookupListData: { ...state.crimeLookupListData, ...temCrimeLkList } };
        case Actions.GET_FEE_EARNER_LIST_SUCCESS:
            const temFeeEarner = {};
            temFeeEarner[action.isActive ? 'active' : 'deActive'] = action.list;
            return { ...state, feeEarners: { ...state.crimeLookupListData, ...temFeeEarner } };
        case Actions.GET_BRANCH_LIST_SUCCESS:
            return { ...state, branchList: action.branchList };
        default: {
            return state;
        }
    }
}

export const getDepartmentList = (state: State) => state.departmentList;
export const getWorkTypeListByDepartmentId = (departmentId) =>
    (state: State) => {
        if (state.workTypeList.data.length > 0 && !!departmentId) {
            return { ...state.workTypeList, data: state.workTypeList.data.filter(i => i.description1 === departmentId.toString()) };
        } else if (!departmentId) {
            return { ...state.workTypeList, data: [] };
        } else {
            return state.workTypeList;
        }
    };

export const getLookupListByType = (type: string) => (state: State) => state.lookupListData ? state.lookupListData[type] : [];
export const getCrimeLookupList = (type: LookupType) => (state: State) => state.crimeLookupListData ? state.crimeLookupListData[type] : [];
export const getFeeEarnerList = (isActive) => (state: State) => {
    if (state && state.feeEarners) {
        if (isActive) {
            return state.feeEarners['active'];
        } else {
            return state.feeEarners['deActive'];
        }
    }
};
export const getBranchList = (state: State) => state ? state.branchList : [];




