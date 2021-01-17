import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { WorkflowMenuMetaItem } from '../models/interfaces';
import { WorkFlowMenuPopupInput } from '../../core/lib/workflow';
import * as _ from 'lodash';

export interface State {
    readonly [token: string]: WorkflowMenuPopupState;
}

export interface WorkflowMenuPopupState {
    readonly loading: boolean;
    readonly inputData: WorkFlowMenuPopupInput;
    readonly list: WorkflowMenuMetaItem[];
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_WORKFLOW_MENU:
            temp[action.token] = getInitViewData(state[action.token], action.payload.inputData);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST:
            temp[action.token] = loadMenuListData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_SUCCESS:
            temp[action.token] = loadMenuListDataSuccess(state[action.token], action.payload.menuList);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_FAIL:
            temp[action.token] = loadMenuListFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CLEAR_WORKFLOW_MENU:
            temp[action.token] = null;
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function getInitViewData(state: WorkflowMenuPopupState, inputData: WorkFlowMenuPopupInput): Partial<WorkflowMenuPopupState> {
    if (!state) {
        return {
            ...state,
            inputData: inputData ? inputData : null,
            loading: false,
            list: null
        };
    } else {
        return state;
    }

}
function loadMenuListData(state: WorkflowMenuPopupState) {
    return {
        ...state,
        loading: true
    };
}
function loadMenuListFail(state: WorkflowMenuPopupState) {
    return {
        ...state,
        loading: false
    };
}
function loadMenuListDataSuccess(state: WorkflowMenuPopupState, menuList: WorkflowMenuMetaItem[]) {
    const rootRap: WorkflowMenuMetaItem[] = [];
    if (menuList) {
        const root = menuList.filter((item) => item.atN_ParentMenu === 'ROOT');
        root.forEach((item) => {
            const tempItem: WorkflowMenuMetaItem = {
                atN_ID: item.atN_ID,
                atN_ParentID: item.atN_ParentID,
                atN_AppID: item.atN_AppID,
                atN_Type: item.atN_Type,
                atN_Order: item.atN_Order,
                atN_Command: item.atN_Command,
                atN_Desc: item.atN_Desc,
                atN_Level: item.atN_Level,
                atN_Help: item.atN_Help,
                atN_ParentMenu: item.atN_ParentMenu,
                nodeStatus: item.nodeStatus,
                createUser: item.createUser,
                dateDone: item.dateDone,
                children: []
            };
            tempItem.children = getEditNestedChildren(item.atN_Command, menuList);
            rootRap.push(tempItem);
        });
    }

    return {
        ...state,
        loading: false,
        list: rootRap,
    };
}

function getEditNestedChildren(parentId: string, nodes: WorkflowMenuMetaItem[]): WorkflowMenuMetaItem[] {
    const out: WorkflowMenuMetaItem[] = [];
    nodes.forEach(function (object) {
        if (object.atN_ParentMenu === parentId) {
            const tempobject: WorkflowMenuMetaItem = {
                atN_ID: object.atN_ID,
                atN_ParentID: object.atN_ParentID,
                atN_AppID: object.atN_AppID,
                atN_Type: object.atN_Type,
                atN_Order: object.atN_Order,
                atN_Command: object.atN_Command,
                atN_Desc: object.atN_Desc,
                atN_Level: object.atN_Level,
                atN_Help: object.atN_Help,
                atN_ParentMenu: object.atN_ParentMenu,
                nodeStatus: object.nodeStatus,
                createUser: object.createUser,
                dateDone: object.dateDone,
                children: []
            };
            tempobject.children = getEditNestedChildren(object.atN_Command, nodes);
            out.push(tempobject);
        }
    });
    return out;
}


export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getMatterInfoByToken = (token) => createSelector(getViewByToken(token), (workFlowState) =>
    workFlowState ? workFlowState.inputData : null);
export const getTreeViewByToken = (token) => createSelector(getViewByToken(token), (workFlowState) =>
    workFlowState ? workFlowState.list : null);
export const getisLoadingByToken = (token) => createSelector(getViewByToken(token), (workFlowState) =>
    workFlowState ? workFlowState.loading : null);

