import { StringUtil } from './../../time-information-core/class/util/StringUtil';
import { PosingPeriod } from './../../setting-core/models/interface';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import { TreeDataResponse, TreeDataWrapper } from '../models/interfce';
import { Dictionary } from '../../core';
import { ItemChangeKind, TreeItemType } from '../models/enums';

export interface State {
    readonly views: Dictionary<FormslibraryState>;
}

export interface FormslibraryState {
    readonly flLoading: boolean;
    readonly formslibraryTree: TreeDataWrapper;
    readonly selectedItemId: string;
    readonly childItems: TreeDataWrapper[];
    readonly matterData: { matterReferenceNo: string, appID: number };
    readonly searchText: string;
    readonly searchNode: TreeDataWrapper[];
}

const initialState: State = {
    views: {}
};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_FORMS_LIBRARY:
            temp[action.token] = setInitData(state.views[action.token], action.payload.matterData);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_FORMS_LIBRARY_DATA:
            temp[action.token] = getFlDataTree(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_FORMS_LIBRARY_DATA_SUCCESS:
            temp[action.token] = getFlDataTreeSuccess(state.views[action.token], action.payload.fileDirectoryTree);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_FORMS_LIBRARY_DATA_FAIL:
            temp[action.token] = getFlDataTreeFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.TREE_ITEM_CHANGE:
            temp[action.token] = itemChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEARCH_FORMS_LIBRARY_DATA:
            temp[action.token] = searchData(state.views[action.token], action.payload.searchText);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.FORMS_LIBRARY_RESET_TREE:
            temp[action.token] = resetTree(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        default:
            { return state; }
    }
}
function setInitData(state: FormslibraryState, matterData: { matterReferenceNo: string, appID: number }): Partial<FormslibraryState> {
    // if (!state) {
    return {
        ...state,
        flLoading: false,
        matterData: matterData,
        childItems: [],
        selectedItemId: null,
        searchText: '',
        searchNode: []
    };
    // }
    // return state;
}
function searchData(state: FormslibraryState, searchText: string) {
    return {
        ...state,
        searchText: searchText,
        searchNode: searchText ? getSearchNode(state, searchText) : []
    };
}
function getSearchNode(state: FormslibraryState, searchTest: string) {
    const searchNode: TreeDataWrapper[] = [];
    getDataFromTravers(state.formslibraryTree.items, (item: TreeDataWrapper) => {
        if (item.data.description.toLowerCase().includes(searchTest.toLowerCase())) {
            searchNode.push(item);
        }
    });
    return searchNode;
}
function getFlDataTree(state: FormslibraryState): Partial<FormslibraryState> {
    return Object.freeze({
        ...state,
        flLoading: true,
    });
}
function getFlDataTreeSuccess(state: FormslibraryState, fileDirectoryTree: TreeDataResponse): Partial<FormslibraryState> {
    return Object.freeze({
        ...state,
        flLoading: false,
        formslibraryTree: createWrapperNode(fileDirectoryTree)
    });
}
function resetTree(state: FormslibraryState): Partial<FormslibraryState> {
    return Object.freeze({
        ...state,
        flLoading: false,
        formslibraryTree: {
            ...state.formslibraryTree,
            items: treeItemReset(state)
        }
    });
}

function getFlDataTreeFail(state: FormslibraryState): Partial<FormslibraryState> {
    return Object.freeze({
        ...state
        , flLoading: false
    });
}
function createWrapperNode(item: TreeDataResponse, index = 0, parentId = '', treeLevel = 0): TreeDataWrapper {
    const treeId = parentId + index;
    return {
        treeId,
        parentId,
        treeLevel,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        enabled: true,
        nodeType: item.id === null ? TreeItemType.Folder : TreeItemType.Template,
        isTreeNodeExpand: parentId ? false : true,
        data: {
            description: item.description,
            id: item.id,
            path: item.path
        },
        items: item.items ? item.items.map((_item, i) => createWrapperNode(_item, i, treeId, treeLevel + 1)) : []
    };
}
function itemChange(state: FormslibraryState, action: Actions.TreeItemChange): Partial<FormslibraryState> {
    const temp: any = {};
    switch (action.payload.kind) {
        case ItemChangeKind.RowSelected:
            return {
                ...state,
                selectedItemId: action.payload.value.treeId,
                childItems: getChildList(state, action.payload.value),
                formslibraryTree: {
                    ...state.formslibraryTree,
                    items: treeRowSelectChange(state, action.payload.value)
                }
            };
        case ItemChangeKind.RowNodeExpand:
            return {
                ...state,
                formslibraryTree: {
                    ...state.formslibraryTree,
                    items: treeRowExpand(state, action.payload.value)
                }
            };
        case ItemChangeKind.RunLetterEnging:
            return {
                ...state,
                formslibraryTree: {
                    ...state.formslibraryTree,
                    items: runLetterEnging(state, action.payload.value)
                }
            };
        case ItemChangeKind.DetailDbClick:
            return {
                ...state,
                searchNode: [],
                searchText: '',
                formslibraryTree: {
                    ...state.formslibraryTree,
                    items: parentTreeNodeExpand(state, action.payload.value)
                }
            };
        default:
            {
                return state;
            }
    }
}
function getDataFromTravers(list: TreeDataWrapper[], callback: (item: TreeDataWrapper, parent?: TreeDataWrapper) => void) {
    const travel = function(items: TreeDataWrapper[], parent: TreeDataWrapper) {
        items.forEach((item) => {
            callback(item, parent);
            if (item.items && item.items.length) {
                travel(item.items, item);
            }
        });
    };
    travel(list, null);
}
function getChildList(state: FormslibraryState, selectItem: TreeDataWrapper) {
    const childList: TreeDataWrapper[] = [];
    getDataFromTravers(state.formslibraryTree.items, (item: TreeDataWrapper) => {
        if (item.parentId === selectItem.treeId) {
            childList.push(item);
        }
    });
    return childList;
}
function travers(list: TreeDataWrapper[], callback: (item: TreeDataWrapper, parent?: TreeDataWrapper) => TreeDataWrapper) {
    function travel(items: TreeDataWrapper[], parent: TreeDataWrapper): TreeDataWrapper[] {
        return items.map((item) => {
            if (item.items && item.items.length) {
                return { ...callback(item, parent), items: travel(item.items, item) };
            }
            return callback(item, parent);
        });
    }
    return travel(list, null);
}
function treeRowSelectChange(state: FormslibraryState, selectItem: TreeDataWrapper) {
    return travers(state.formslibraryTree.items, (rowItem: TreeDataWrapper) => {
        if (rowItem.treeId === selectItem.treeId) {
            return { ...rowItem, isRowSelected: true };
        } else {
            return { ...rowItem, isRowSelected: false };
        }
    });
}
function parentTreeNodeExpand(state: FormslibraryState, selectItem: TreeDataWrapper) {
    return travers(state.formslibraryTree.items, (rowItem: TreeDataWrapper) => {
        if (rowItem.treeId === selectItem.parentId) {
            return { ...rowItem, isTreeNodeExpand: true };
        } else {
            return { ...rowItem };
        }
    });
}
function treeRowExpand(state: FormslibraryState, selectItem: TreeDataWrapper) {
    return travers(state.formslibraryTree.items, (rowItem: TreeDataWrapper) => {
        if (rowItem.treeId === selectItem.treeId) {
            return { ...rowItem, isTreeNodeExpand: !rowItem.isTreeNodeExpand };
        } else {
            return { ...rowItem };
        }
    });
}
function runLetterEnging(state: FormslibraryState, selectItem: TreeDataWrapper) {
    return travers(state.formslibraryTree.items, (rowItem: TreeDataWrapper) => {
        if (rowItem.treeId === selectItem.treeId) {
            return { ...rowItem, isRowSelected: true };
        } else {
            return { ...rowItem, isRowSelected: false };
        }
    });
}
function treeItemReset(state: FormslibraryState) {
    return travers(state.formslibraryTree.items, (rowItem: TreeDataWrapper) => {
        return { ...rowItem, isRowSelected: false, isTreeNodeExpand: false, };
    });
}

export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (states) => states.views[token]);

export const getFormsLibraryLoadingByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.flLoading : null);
export const getFormsLibrarytreeByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.formslibraryTree : []);
export const getFlLoadingByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.flLoading : false);
export const getSelectedItemChildListByToken = (token) => createSelector(getViewByToken(token),
    (view) => view && view.searchText && view.searchNode ? view.searchNode : view && view.childItems ? view.childItems : []);
export const getMatterMatterData = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.matterData : null);
export const getFlSearchTextByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.searchText : null);
