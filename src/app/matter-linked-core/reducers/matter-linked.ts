import { INIT_MATTER_LINKED_FAIL } from './../actions/core';
import { ColumnDef, PaginatorDef } from './../../core/lib/grid-model';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { GridData, PlotSyncSuccessInfo, MatterDataInput } from '../models/interfaces';
import { MatterLinkedType } from '../models/enum';
import { MatterSearchGridData } from '../../core/lib/matter';

export interface State {
    readonly [token: string]: MatterLinkedState;

}


export interface MatterLinkedState {

    readonly loading: boolean;
    readonly gridData: GridData[];
    readonly columnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly matterRef: string;
    readonly selectedMatterRef: string[];
    readonly matterData: MatterDataInput;
    readonly screenId: any;
    readonly diaryIds: any;
    readonly parentToken: string;
    readonly openFrom: MatterLinkedType;
    readonly multiSelectItem: string[];
    readonly plotRange: string;
    readonly plotSyncSuccessInfo: PlotSyncSuccessInfo;
    readonly onlySelectMatter: boolean;

}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {


        case Actions.INIT_MATTER_LINKED:
            temp[action.token] = setInitialData(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.REQUEST_LINKED_DATA:
            temp[action.token] = setRequestGridData(state[action.token]);
            return { ...state, ...temp };
        case Actions.INIT_MATTER_LINKED_SUCCESS:
            temp[action.token] = setGridData(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.INIT_MATTER_LINKED_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.CREATE_LINKED_MATTER:
            temp[action.token] = createLinkedMatter(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PLOT_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.SAVE_PLOT_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.SELECTED_LINKED_MATTER:
            temp[action.token] = selectedLinkedMatter(state[action.token], action.selectedMatter);
            return { ...state, ...temp };

        case Actions.ADD_DIARY_RECORD_FOR_PLOT_MATTER:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ADD_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS:
            temp[action.token] = plotDiaryDataSuccess(state[action.token], action.payload.plotSyncSuccessInfo);
            return { ...state, ...temp };
        case Actions.ADD_DIARY_RECORD_FOR_PLOT_MATTER_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };


        case Actions.UPDATE_PLOT_LINKED_MATTER:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.UPDATE_PLOT_LINKED_MATTER_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.UPDATE_PLOT_LINKED_MATTER_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };


        case Actions.SAVE_PLOT_SALE_SCREEN_DATA:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.SAVE_PLOT_SALE_SCREEN_DATA_SUCCESS:
            temp[action.token] = plotScreenDataSuccess(state[action.token], action.payload.plotSyncSuccessInfo);
            return { ...state, ...temp };
        case Actions.SAVE_PLOT_SALE_SCREEN_DATA_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.SELECT_ALL_LINK_MATTER:
            temp[action.token] = selectAllLinkedMatter(state[action.token], action.value);
            return { ...state, ...temp };
        case Actions.MULTI_SELECT_MATTER:
            temp[action.token] = multiSelectMatter(state[action.token], action.value);
            return { ...state, ...temp };
        case Actions.CHANGE_PLOT_RANGE:
            temp[action.token] = changePlotRange(state[action.token], action.plotRange);
            return { ...state, ...temp };
        case Actions.CHANGE_MATTER_DATA:
            temp[action.token] = changeMatterData(state[action.token], action.matterData);
            return { ...state, ...temp };


        default:
            {
                return state;
            }
    }
}
function setInitialData(state: MatterLinkedState, initData: {
    matterRef: string, openFrom: MatterLinkedType,
    coloumnDef: any, matterData: MatterDataInput, screenId: any, diaryIds: any, parentToken: string,
    onlySelectMatter?: boolean,
}) {
    return {
        ...state,
        matterRef: initData.matterRef,
        columnDef: initData.coloumnDef,
        selectedMatterRef: [],
        multiSelectItem: [],
        paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 }),
        matterData: initData.matterData,
        screenId: initData.screenId,
        diaryIds: initData.diaryIds,
        parentToken: initData.parentToken,
        openFrom: initData.openFrom,
        plotRange: null,
        plotSyncSuccessInfo: null,
        onlySelectMatter: initData.onlySelectMatter
    };
}

function setGridData(state: MatterLinkedState, gridData) {
    return {
        ...state,
        gridData: gridData.data ? gridData.data.data : [],
        loading: false,

    };
}

function createLinkedMatter(state: MatterLinkedState) {
    return {
        ...state,
        loading: true,

    };
}


function setRequestGridData(state: MatterLinkedState) {
    return {
        ...state,
        loading: true,

    };
}

function plotScreenDataSuccess(state: MatterLinkedState, plotSyncSuccessInfo) {
    return {
        ...state,
        loading: false,
        plotSyncSuccessInfo: plotSyncSuccessInfo

    };
}

function plotDiaryDataSuccess(state: MatterLinkedState, plotSyncSuccessInfo) {
    return {
        ...state,
        loading: false,
        plotSyncSuccessInfo: plotSyncSuccessInfo

    };
}

function paginatorChange(pagerDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage


    };
}

function selectedLinkedMatter(state: MatterLinkedState, selectedMatter: any) {
    let selectedRef: string[] = [];
    if (state.selectedMatterRef.find(f => f === selectedMatter.matterRef)) {
        selectedRef = state.selectedMatterRef.filter(f => f !== selectedMatter.matterRef);
    } else {
        selectedRef = state.selectedMatterRef.concat(selectedMatter.matterRef);
    }
    return {
        ...state,
        selectedMatterRef: selectedRef,
        plotRange: null
    };


}

function selectAllLinkedMatter(state: MatterLinkedState, value: any) {
    let selectedRef: string[] = [];
    if (value.checked === true) {

        if (state.multiSelectItem && state.multiSelectItem.length !== 0) {
            selectedRef = state.multiSelectItem;
        } else {
            selectedRef = state.gridData.map(a => a.matterReferenceNo);

        }
    } else {
        selectedRef = [];

    }
    return {
        ...state,
        selectedMatterRef: selectedRef,
        plotRange: null
    };

}

function multiSelectMatter(state: MatterLinkedState, matterRef: any) {
    let multiSelectRef: string[] = [];
    // if (state.multiSelectItem.find(f => f === value.matterReferenceNo)) {
    if (matterRef !== null) {

        if (state.multiSelectItem.find(f => f === matterRef)) {
            multiSelectRef = state.multiSelectItem;
        } else {
            multiSelectRef = state.multiSelectItem.concat(matterRef);
        }
    } else {
        multiSelectRef = [];

    }

    return {
        ...state,
        multiSelectItem: multiSelectRef,
        // plotRange: null
    };

}

function changePlotRange(state: MatterLinkedState, plots: string) {
    return {
        ...state,
        plotRange: plots,
        selectedMatterRef: []

    };


}

function changeMatterData(state: MatterLinkedState, matterData) {
    return {
        ...state,
        matterData: matterData,
    };



}









export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (views) => views[token]);
export const getColumnDefByToken = (token) => createSelector(getViewByToken(token), (matterLinkedState) => {
    //  matterLinkedState.matterData.isPlotMasterMatter ?
    return matterLinkedState.onlySelectMatter || matterLinkedState.matterData.isPlotMasterMatter ? matterLinkedState.columnDef :
        matterLinkedState.columnDef.filter(c => c.fieldName !== 'select');
}

    // matterLinkedState ? matterLinkedState.columnDef : null
);
export const getPaginatorDefByToken = (token) => createSelector(getViewByToken(token), (matterLinkedState) =>
    matterLinkedState ? matterLinkedState.paginatorDef : null);
export const getGridDataByToken = (token) => createSelector(getViewByToken(token), (matterLinkedState) =>
    matterLinkedState ? matterLinkedState.gridData : null);
export const getLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.loading : null);
export const getMatterRefByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.matterRef : null);
export const getSelectedMatterDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.selectedMatterRef : []);
export const getMatterDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.matterData : null);
export const getScreenId = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.screenId : null);
export const getDiaryId = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.diaryIds : null);

export const getOpenFromByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.openFrom : null);

export const getParentTokenByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.parentToken : null);

export const getMultiselectItemTokenByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.multiSelectItem : null);


export const getPlotRangeTokenByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.plotRange : null);

export const getPlotSyncSuccessInfoByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.plotSyncSuccessInfo : null);


