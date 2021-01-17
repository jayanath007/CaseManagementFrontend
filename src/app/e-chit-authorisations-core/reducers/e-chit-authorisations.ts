import { EChitAuthorisationsResponse, AuthorisationsGridData } from '../models/interfaces';
import { DpsSelectModel, FeeEarner, AuthorisationsGroup } from '../models/interfaces';
import { paginatorChange, applyFieldSort } from '../../core/lib/grid-helpers';
import { ColumnDef, PaginatorDef } from './../../core/lib/grid-model';
import { PropertyNameList } from '../models/enums';
import { PageEvent } from '@angular/material';
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';

export interface State {
    readonly views: { [token: string]: EChitAuthorisationsState };
    readonly init: boolean;
    readonly feeEarnerList: DpsSelectModel<FeeEarner>[];
    readonly groupList: DpsSelectModel<AuthorisationsGroup>[];
}
export interface EChitAuthorisationsState {
    readonly mainLoading: boolean;
    readonly columnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly pageEvent: PageEvent;
    readonly authorisationsResponse: EChitAuthorisationsResponse;
    readonly authorisationsGridData: AuthorisationsGridData[];
    readonly selectedRow: AuthorisationsGridData;
    readonly selectedGroupId: number;
    readonly selectedFeeEarnerCode: string;
    readonly gridRowTotal: number;
}
const initialState: State = {
    views: {},
    init: false,
    feeEarnerList: [],
    groupList: [],
};
export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_ECHIT_AUTHORISATIONS:
            temp[action.token] = getInitViewData(state.views[action.token], action);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.ECHIT_AUTHORISATIONS_USER_GROUP_LIST:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: true,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_USER_GROUP_LIST_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                selectedGroupId: action.payload.userGroupList.find(f =>
                    f.groupId === -1) ? action.payload.userGroupList.find(f =>
                        f.groupId === -1).groupId : action.payload.userGroupList.length > 0 ? action.payload.userGroupList[0].groupId : null
            };
            return {
                ...state,
                groupList: action.payload.userGroupList ? action.payload.userGroupList
                    .map(val => ({ data: val, selected: false, key: val.groupId, value: val.groupName })) : [],
                views: { ...state.views, ...temp }
            };
        case Actions.ECHIT_AUTHORISATIONS_USER_GROUP_LIST_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_FEEEARNER_LIST:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: true,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_FEEEARNER_LIST_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
                selectedFeeEarnerCode: action.payload.feeEarnerList.find(f =>
                    f.code === 'All Users') ? action.payload.feeEarnerList.find(f =>
                        f.code === 'All Users').code : action.payload.feeEarnerList.length > 0 ? action.payload.feeEarnerList[0].code : null
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
                feeEarnerList: action.payload.feeEarnerList ? action.payload.feeEarnerList
                    .map(val => ({ data: val, selected: false, key: val.code, value: val.code })) : []
            };
        case Actions.ECHIT_AUTHORISATIONS_FEEEARNER_LIST_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_DROPDOWN_VALUE_CHANGE:
            temp[action.token] = {
                ...state.views[action.token],
                selectedGroupId: action.payload.propertyName === PropertyNameList.UserGroup ? action.payload.selectedValue.key
                    : state.views[action.token].selectedGroupId,
                selectedFeeEarnerCode: action.payload.propertyName === PropertyNameList.FeeEarner ? action.payload.selectedValue.key
                    : state.views[action.token].selectedFeeEarnerCode,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: true,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
                authorisationsGridData: (action.payload.gridDataObject && action.payload.gridDataObject.data) ?
                    action.payload.gridDataObject.data.map(item => ({ ...item, selected: false })) : [],
                gridRowTotal: action.payload.gridDataObject.total
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_SELECTED_ROW_ITEM:
            temp[action.token] = {
                ...state.views[action.token],
                selectedRow: action.payload ? action.payload.selectedRow : {}
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_CHECKBOX_CHANGE:
            temp[action.token] = {
                ...state.views[action.token],
                authorisationsGridData: state.views[action.token].authorisationsGridData ? state.views[action.token].authorisationsGridData
                    .map(rowItem => {
                        if (rowItem.id === action.payload.rowId) {
                            return Object.freeze({ ...rowItem, selected: action.payload.CheckBoxValue });
                        } else {
                            return Object.freeze({ ...rowItem, selected: rowItem.selected });
                        }
                    }) : [],
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_SAVE:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: true,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_SAVE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_SAVE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_REJECT:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: true,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_REJECT_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_REJECT_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_CHANGE_PAGE:
            temp[action.token] = {
                ...state.views[action.token],
                paginatorDef: paginatorChange(action.pageDef)
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_COLUM_SORTING:
            temp[action.token] = {
                ...state.views[action.token],
                columnDef: applyFieldSort(state.views[action.token].columnDef, action.columDef)
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.ECHIT_AUTHORISATIONS_EMAIL_ITEM:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: true,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_EMAIL_ITEM_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        case Actions.ECHIT_AUTHORISATIONS_EMAIL_ITEM_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                mainLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
            };
        default:
            { return state; }
    }
}
function getInitViewData(state: EChitAuthorisationsState, action: Actions.InitPage): Partial<EChitAuthorisationsState> {
    return {
        ...state,
        mainLoading: false,
        columnDef: action.payload.columnDef,
        paginatorDef: action.payload.paginatorDef,
        authorisationsResponse: null,
        authorisationsGridData: []
    };
}
export const getState = (state: State) => state;
export const getView = (state: State) => state.views;
export const getViewByToken = (token) => createSelector(getView, (views) => {
    return views[token];
});
export const getFeeEarnerListByGroup = (state: State) => state.feeEarnerList;
export const getGroupList = (state: State) => state.groupList;
export const getAuthorisationsColumnDefByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.columnDef : null);
export const getAuthorisationsPaginatorDefByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.paginatorDef : null);
export const getAuthorisationsRowsCountByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.authorisationsGridData.filter(item => item.selected).length : 0);
