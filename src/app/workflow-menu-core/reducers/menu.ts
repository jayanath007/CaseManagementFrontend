
import { ItemChangeKind, MenuNodeStatus, ItemDragTo, ImportButtonType } from '../models/enums';
import { WorkflowMenuMetaDataWrapper, MatterSummery, MatterShortcuts, MoveMenuItem } from '../models/interfaces';
import { MatterSearchGridData } from '../../core/lib/matter';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as DocAction from '../../document-view';
import { WorkflowMenuMetaItem } from '../models/interfaces';
import * as _ from 'lodash';
import { matterMenusForView } from '../../core/lib/workflow';

export interface State {
    readonly [token: string]: WorkflowMenuState;
}

export interface WorkflowMenuState {
    readonly init: boolean;
    readonly isMenuListLoading: boolean;
    readonly matterInfo: MatterSearchGridData;
    readonly isFileBaseMenuLoading: boolean;
    readonly isFileBaseMenu: boolean;
    readonly workFlowMenuWrapListCopy: WorkflowMenuMetaDataWrapper[];
    readonly workFlowMenuWrapList: WorkflowMenuMetaDataWrapper[];
    // readonly workFlowTreeList: WorkflowMenuMetaDataWrapper[];
    // readonly menuList: WorkflowMenuMetaItem;
    readonly copyItem: WorkflowMenuMetaDataWrapper;
    readonly cutItem: WorkflowMenuMetaDataWrapper;
    readonly menuMatterSummery: MatterSummery[];
    readonly isMatterSummeryLoading: boolean;
    readonly menuMatterShortcuts: MatterShortcuts[];
    readonly isShortCutKeyLoading: boolean;
    readonly isActive: boolean;
    readonly openFilePathHistory: WorkflowMenuMetaDataWrapper[];
    readonly forwardFilePathHistory: WorkflowMenuMetaDataWrapper[];
    readonly exportData: any;
    readonly exportToServerTrigger: boolean;
    readonly requestToCancel: boolean;
    readonly isDirty: boolean;
    readonly validationMessage: string;
    readonly isShowDeleteMsg: boolean;
    readonly wfSearchText: string;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any | DocAction.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_WORKFLOW_MENU:
            temp[action.token] = getInitViewData(state[action.token], action.payload.inputData);
            return { ...updateActiveState(state), ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST:
            temp[action.token] = loadMenuListData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_SUCCESS:
            temp[action.token] = loadMenuListDataSuccess(state[action.token], action.payload.menuList);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_FAIL:
            temp[action.token] = loadMenuListDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SUMMARY:
            temp[action.token] = loadMatterSummery(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SUMMARY_SUCCESS:
            temp[action.token] = loadMatterSummerySuccess(state[action.token], action.payload.matterSummeryData);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SUMMARY_FAIL:
            temp[action.token] = loadMatterSummeryFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SHORTCUT_KEYS:
            temp[action.token] = loadMatterShortCutKeys(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS:
            temp[action.token] = loadMatterShortCutKeysSuccess(state[action.token], action.payload.matterShortCut);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL:
            temp[action.token] = loadMatterShortCutKeysFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_FILE_BASE_MENU:
            temp[action.token] = loadFileBaseMenuData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_FILE_BASE_MENU_SUCCESS:
            temp[action.token] = loadFileBaseMenuDataSuccess(state[action.token], action.payload.isFileBaseMenu);
            return { ...state, ...temp };
        case Actions.LOAD_FILE_BASE_MENU_FAIL:
            temp[action.token] = loadFileBaseMenuDataFail(state[action.token], action.payload.error);
            return { ...state, ...temp };
        case Actions.TREE_ITEM_CHANGE:
            temp[action.token] = itemChange(state[action.token], action);
            return { ...state, ...temp };
        case Actions.CANCEL_EDIT:
            temp[action.token] = requestMenuCancel(state[action.token]);
            return { ...state, ...temp };
        case Actions.IGNOW_CANCEL:
            temp[action.token] = RemoveIsCancel(state[action.token]);
            return { ...state, ...temp };
        case Actions.CLOSE_MENU_EDIT:
            temp[action.token] = closeMenuEdit(state[action.token]);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_EXPORT_TO_LOCAL:
            temp[action.token] = getExportWorkFlowMenu(state[action.token]);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_EXPORT_TO_LOCAL_SUCCESS:
            temp[action.token] = getExportWorkFlowMenuSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_EXPORT_TO_LOCAL_FAIL:
            temp[action.token] = getExportWorkFlowMenuFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_ACTION:
            temp[action.token] = saveWorkflowMenu(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_ACTION_SUCCESS:
            temp[action.token] = saveWorkflowMenuSuccess(state[action.token], action.payload.newMenuList);
            return { ...state, ...temp };
        case Actions.SAVE_ACTION_FAIL:
            temp[action.token] = saveWorkflowMenuFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.MENU_EDIT_DUPLICATE:
            temp[action.token] = saveWorkflowMenu(state[action.token]);
            return { ...state, ...temp };
        case Actions.MENU_EDIT_DUPLICATE_SUCCESS:
            temp[action.token] = saveWorkflowMenuSuccess(state[action.token], action.payload.newMenuList);
            return { ...state, ...temp };
        case Actions.MENU_EDIT_DUPLICATE_FAIL:
            temp[action.token] = saveWorkflowMenuFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.CLOSE_OPEN_CASE_TAB:
            temp[action.token] = null;
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_MSG_RESET:
            temp[action.token] = msgReset(state[action.token], action.payload.value);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_DELETE_LINK_MENU:
            temp[action.token] = deleteLinkItem(state[action.token], action.payload.value);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_IMPORT:
            temp[action.token] = getImportWorkFlowRule(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_IMPORT_SUCCESS:
            temp[action.token] = getImportWorkFlowRuleSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_IMPORT_FAIL:
            temp[action.token] = getImportWorkFlowRuleFail(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_KEY_UP_DOWN:
            temp[action.token] = getImportWorkFlowMenuKeyUpDown(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_MENU_TO_BE_SELECTED_ITEM:
            temp[action.token] = getToBeSelectedItem(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_REFRESH:
            temp[action.token] = loadMenuListAffterRefresh(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_REFRESH_SUCCESS:
            temp[action.token] = loadMenuListAffterRefreshSuccess(state[action.token], action.payload.menuList);
            return { ...state, ...temp };
        case Actions.LOAD_WORKFLOW_MENU_LIST_REFRESH_FAIL:
            {
                temp[action.token] = loadMenuListAffterRefreshFail(state[action.token]);
                return { ...state, ...temp };
            }
        case Actions.WORKFLOW_ITEM_SEARCH:
            {
                temp[action.token] = setSearchText(state[action.token], action.searchText);
                return { ...state, ...temp };
            }
        case DocAction.CHECKOUT_TEMPALTE_FILE: {
            const _act = action as DocAction.CheckoutTempalteFiles;
            const req = _act.payload;
            const _state = mutateMenuItem(state, (item) => {
                return item.data.atN_AppID === req.appId && item.data.atN_Command.toLowerCase() === req.fileName.toLowerCase();
            }, (item) => {
                return { ...item, editingBusy: true };
            });
            return _state;
        }

        case DocAction.DISCARD_CHECKOUT:
        case DocAction.CHECKIN_FILE: {
            const _act = action as DocAction.EditingResultAction;

            if (_act.docCheckin.fileManagerType !== DocAction.FileManagerType.TemplateManager) {
                return state;
            }

            const _state = mutateMenuItem(state, (item) => {
                return item.data.checkedOutHashKey === _act.docCheckin.hashKey;
            }, (item) => {
                return { ...item, editingBusy: true };
            });

            return _state;
        }

        case DocAction.FILE_CHECKOUT_FAIL: {
            const _act = action as DocAction.FileCheckoutFailed;
            if (_act.fileMgrType !== DocAction.FileManagerType.TemplateManager) {
                return state;
            }

            const req = _act.requestPaylod as DocAction.TempaltePathInfo;
            const _state = mutateMenuItem(state, (item) => {
                return item.data.atN_AppID === req.appId && item.data.atN_Command.toLowerCase() === req.fileName.toLowerCase();
            }, (item) => {
                return { ...item, editingBusy: false };
            });
            return _state;
        }

        case DocAction.DISCARD_CHECKOUT_FAIL:
        case DocAction.CHECKIN_FILE_FAIL: {
            const _act = action as DocAction.EditingResultAction;

            if (_act.docCheckin.fileManagerType !== DocAction.FileManagerType.FileWithDiaryEntryManager) {
                return state;
            }

            const _state = mutateMenuItem(state, (item) => {
                return item.data.checkedOutHashKey === _act.docCheckin.hashKey;
            }, (item) => {
                return { ...item, editingBusy: false };
            });

            return _state;
        }

        case DocAction.FILE_CHECKOUT_SUCCESS: {
            const _act = action as DocAction.FileCheckoutSuccess;
            if (_act.docCheckin.fileManagerType !== DocAction.FileManagerType.TemplateManager) {
                return state;
            }
            const req = _act.requestPaylod as DocAction.TempaltePathInfo;
            const _state = mutateMenuItem(state, (item) => {
                return item.data.atN_AppID === req.appId && item.data.atN_Command.toLowerCase() === req.fileName.toLowerCase();
            }, (item) => {
                return { ...item, editingBusy: false, data: { ...item.data, checkedOutHashKey: _act.docCheckin.hashKey } };
            });

            return _state;
        }

        case DocAction.DISCARD_CHECKOUT_SUCCESS:
        case DocAction.CHECKIN_FILE_SUCCESS:
            {
                const docCheckin = action.docCheckin as DocAction.IDocumentCheckin;
                if (docCheckin.fileManagerType !== DocAction.FileManagerType.TemplateManager) {
                    return state;
                }

                const _state = mutateMenuItem(state, (item) => {
                    return item.data.checkedOutHashKey && item.data.checkedOutHashKey === docCheckin.hashKey;
                }, (item) => {
                    return { ...item, editingBusy: false, data: { ...item.data, checkedOutHashKey: null, checkedOutByUser: null } };
                });

                return _state;
            }
        default:
            {
                return state;
            }
    }
}
function mutateMenuItem(state: State, predicate: (item: WorkflowMenuMetaDataWrapper) => boolean,
    mutor: (item: WorkflowMenuMetaDataWrapper) => WorkflowMenuMetaDataWrapper) {

    const handleWorkflowMenuState = (wfState: WorkflowMenuState): WorkflowMenuState => {
        let isDirty = false;
        const newList = [];
        if (wfState && wfState.workFlowMenuWrapList) {
            wfState.workFlowMenuWrapList.forEach((item) => {
                if (predicate(item)) {
                    isDirty = true;
                    const newItwem = mutor(item);
                    newList.push(newItwem);
                } else {
                    newList.push(item);
                }
            });
        }
        if (isDirty) {
            return { ...wfState, workFlowMenuWrapList: newList };
        }
        return wfState;
    };

    const handleState = (_state: State): State => {
        let isDirty = false;
        const newState = {};
        Object.keys(_state).forEach((token) => {
            const tmpView = _state[token];
            const newView = handleWorkflowMenuState(tmpView);
            if (newView !== tmpView) {
                isDirty = true;
                newState[token] = newView;
            } else {
                newState[token] = tmpView;
            }
        });
        if (isDirty) {
            return newState;
        }

        return _state;
    };

    return handleState(state);
}

function saveWorkflowMenu(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: true,
    };
}
function saveWorkflowMenuSuccess(state: WorkflowMenuState, menuList: WorkflowMenuMetaItem[]) {
    const rootRap: WorkflowMenuMetaDataWrapper[] = menuList.map(_item => ({
        treeId: _item.atN_ID,
        parentId: _item.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: _item,
        items: null,
        enabled: true,
        isTreeNodeExpand: false,
    }));
    return {
        ...state,
        isMenuListLoading: false,
        workFlowMenuWrapList: rootRap,
        isDirty: false,
        isFileBaseMenu: false,
        workFlowMenuWrapListCopy: rootRap
    };

}
// function getWorkflowSessionCompleted(state: WorkflowMenuState, menuName: WorkflowMenuMetaItem) {
//     debugger;
//     return {
//         ...state,
//         isMenuListLoading: true,
//     };
// }

function getToBeSelectedItem(state: WorkflowMenuState, menuName: string) {
    const newToBeSelectItem: WorkflowMenuMetaDataWrapper[] = state.workFlowMenuWrapList.map((row) => {
        if (row.data.atN_Command === menuName) {
            return row;
        }
    }).filter((item) => item);
    if (newToBeSelectItem && newToBeSelectItem.length > 0) {
        const expandMenuList: WorkflowMenuMetaDataWrapper[] = [];
        getOpenFilePathList(state.workFlowMenuWrapList, newToBeSelectItem[0], expandMenuList);
        // expandMenuList.push(newToBeSelectItem[0]);
        const newList = state.workFlowMenuWrapList.map((item) => {
            if (item.data.atN_Command === menuName && item.treeId === newToBeSelectItem[0].treeId) {
                return {
                    ...item,
                    isRowSelected: true
                };
            } else {
                if (expandMenuList.find(val => val.treeId === item.treeId)) {
                    return {
                        ...item,
                        isTreeNodeExpand: true
                    };
                } else {
                    return {
                        ...item,
                        isRowSelected: false
                    };
                }
            }
        });
        return {
            ...state,
            workFlowMenuWrapList: newList,
            forwardFilePathHistory: []
        };
    } else {
        return {
            ...state
        };
    }
}

// This is developed for XM command (Letter Engine)
// function findTheNodeByMenuName(parent: WorkflowMenuMetaDataWrapper,
//     lookupName: string): WorkflowMenuMetaDataWrapper {
//     // if (!state.menuItemToBeSelected) {
//     if (parent.data.atN_Command === lookupName) {
//         return parent;
//     } else if (parent.items && parent.items.length > 0) {
//         parent.items.filter(x => x.data.atN_Type === 1).forEach((item) => {
//             if (item.data.atN_Command === lookupName) {
//                 return item;
//             } else if (item.items) {
//                 if (item.data.atN_Command === lookupName) {
//                     return item;
//                 } else if (item.items.length > 0) {
//                     item.items.forEach((childItem) => {
//                         findTheNodeByMenuName(childItem, lookupName);
//                     });
//                 } else {
//                     return null;
//                 }
//             }
//         });
//     } else {
//         return null;
//     }
// }

function saveWorkflowMenuFail(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: false
    };
}
function msgReset(state: WorkflowMenuState, payload: string) {
    return {
        ...state,
        validationMessage: null,
        exportToServerTrigger: false
    };
}
function getImportWorkFlowRule(state: WorkflowMenuState, payload: any) {
    return {
        ...state,
        isMenuListLoading: true
    };
}

function getImportWorkFlowMenuKeyUpDown(state: WorkflowMenuState, payload: any) {
    if (payload.keyCode === 40) {
        const nextItem = getNextItem(state, payload.selectMenuItem);
        const newList = state.workFlowMenuWrapList.map((row) => {
            if (nextItem && row.treeId === payload.selectMenuItem.treeId) {
                return { ...row, isRowSelected: false };
            }
            if (nextItem && row.treeId === nextItem.treeId) {
                return { ...row, isRowSelected: true };
            }
            return row;
        });
        return {
            ...state, workFlowMenuWrapList: newList
        };
    } else if (payload.keyCode === 38) {
        const preItem = getPreviousItem(state, payload.selectMenuItem);

        const newList = state.workFlowMenuWrapList.map((row) => {
            if (preItem && row.treeId === payload.selectMenuItem.treeId) {
                return { ...row, isRowSelected: false };
            }
            if (preItem && row.treeId === preItem.treeId) {
                return { ...row, isRowSelected: true };
            }
            return row;
        });
        return {
            ...state, workFlowMenuWrapList: newList
        };
    }
    return {
        ...state
    };
}

function getNextItem(state: WorkflowMenuState, selectMenuItem: WorkflowMenuMetaDataWrapper) {

    let nextItem: WorkflowMenuMetaDataWrapper;
    if (selectMenuItem.data.atN_Type === 1 && selectMenuItem.isTreeNodeExpand) {
        nextItem = selectMenuItem.items[0];
    } else {
        nextItem = state.workFlowMenuWrapList.filter(p => p.data.atN_ParentMenu === selectMenuItem.data.atN_ParentMenu &&
            p.data.atN_Order > selectMenuItem.data.atN_Order)[0];
        if (nextItem) {
            let fullNextItem: WorkflowMenuMetaDataWrapper[] = [];

            travers(state.workFlowMenuWrapList, (item: WorkflowMenuMetaDataWrapper) => {
                if (item.data.atN_ID === nextItem.data.atN_ID && item.data.atN_Command === nextItem.data.atN_Command) {
                    fullNextItem.push(item);
                } else {

                }
            });
            if (fullNextItem.length > 1) {
                const tempList = fullNextItem.filter(p => p.indexId > selectMenuItem.indexId);
                fullNextItem = tempList;
            }
            nextItem = fullNextItem[0];
        } else {
            let nextUperItem: WorkflowMenuMetaDataWrapper;
            const masterItem = state.workFlowMenuWrapList.filter(p => p.data.atN_Command === selectMenuItem.data.atN_ParentMenu &&
                p.data.atN_Level === (selectMenuItem.data.atN_Level - 1))[0];
            if (masterItem) {
                nextUperItem = state.workFlowMenuWrapList.filter(p => p.data.atN_ParentMenu === masterItem.data.atN_ParentMenu &&
                    p.data.atN_Order > masterItem.data.atN_Order)[0];
            }
            if (nextUperItem) {
                let fullNextItem: WorkflowMenuMetaDataWrapper[] = [];
                travers(state.workFlowMenuWrapList, (item: WorkflowMenuMetaDataWrapper) => {
                    if (item.data.atN_ID === nextUperItem.data.atN_ID && item.data.atN_Command === nextUperItem.data.atN_Command) {
                        fullNextItem.push(item);
                    }
                });
                if (fullNextItem.length > 1) {
                    const tempList = fullNextItem.filter(p => p.indexId > masterItem.indexId);
                    fullNextItem = tempList;
                }
                nextItem = fullNextItem[0];
            }
        }
    }
    return nextItem;
}

function getChildrenCount(item: WorkflowMenuMetaDataWrapper): number {

    let count = 0;
    item.items.forEach(function(child) {
        count = count + 1;
        if (child.items.length > 0) {
            count = count + getChildrenCount(child);
        }
    });
    return count;
}

function getPreviousItem(state: WorkflowMenuState, selectMenuItem: WorkflowMenuMetaDataWrapper) {
    let previousItemList: WorkflowMenuMetaDataWrapper[];
    let previousItem: WorkflowMenuMetaDataWrapper;
    previousItemList = state.workFlowMenuWrapList.filter(p => p.data.atN_ParentMenu === selectMenuItem.data.atN_ParentMenu &&
        p.data.atN_Order < selectMenuItem.data.atN_Order);

    previousItem = previousItemList[previousItemList.length - 1];
    if (previousItem) {
        if (previousItem.isTreeNodeExpand) {
            const nextItemList: WorkflowMenuMetaDataWrapper[] = state.workFlowMenuWrapList.filter(p =>
                p.data.atN_ParentMenu === previousItem.data.atN_Command &&
                p.data.atN_Level === (previousItem.data.atN_Level + 1));
            if (nextItemList.length > 0) {
                previousItem = nextItemList[nextItemList.length - 1];
            }
        } else {
            // nomal previous
            let fullPreviousItem: WorkflowMenuMetaDataWrapper[] = [];

            travers(state.workFlowMenuWrapList, (item: WorkflowMenuMetaDataWrapper) => {
                if (item.data.atN_ID === previousItem.data.atN_ID && item.data.atN_Command === previousItem.data.atN_Command) {
                    fullPreviousItem.push(item);
                } else {

                }
            });
            if (fullPreviousItem.length > 1) {
                const tempList = fullPreviousItem.filter(p => p.indexId < selectMenuItem.indexId);
                fullPreviousItem = tempList;
            }
            previousItem = fullPreviousItem[fullPreviousItem.length - 1];
        }
    } else {
        const masterItem = state.workFlowMenuWrapList.filter(p => p.data.atN_Command === selectMenuItem.data.atN_ParentMenu &&
            p.data.atN_Level === (selectMenuItem.data.atN_Level - 1))[0];
        if (masterItem) {
            previousItem = masterItem;
        }
    }
    return previousItem;
}

// function getExpandedLastItem(item: WorkflowMenuMetaDataWrapper): WorkflowMenuMetaDataWrapper {

//     const newItem = JSON.parse(JSON.stringify(item));
//     if (item.isTreeNodeExpand) {
//         const childList = item.items;
//         return getExpandedLastItem(childList[childList.length - 1]);
//     }
//     return newItem;
// }

function getImportWorkFlowRuleSuccess(state: WorkflowMenuState, payload: any) {
    let validationMessage = null;
    const selectedNode = state.workFlowMenuWrapList.find((row) => row.isRowSelected);
    if (payload.importedData && payload.importedData.clientView && payload.importedData.dpsParam1 && payload.importedData.dpsParam2) {
        if (payload.importedData.dpsParam1 && payload.importedData.dpsParam1.substring(0, 4) === 'ROOT') {
            payload.importedData.dpsParam1 = 'ROOT';
        }
        if (payload.importButtonType === ImportButtonType.FullMenuAbove) {
            if (menuValidation(state, payload.importedData.dpsParam1) || (payload.importedData.dpsParam1.substring(0, 4) === 'ROOT' &&
                selectedNode.data.atN_ParentMenu === 'ROOT' && selectedNode.data.atN_Type === 1)) {
                validationMessage = `The menu'` + payload.importedData.dpsParam1 + ':' + payload.importedData.dpsParam2 + `'
                is already an ancestor of this item an cannot be imported at this position. `;
                return {
                    ...state,
                    isMenuListLoading: false,
                    validationMessage: validationMessage
                };
            } else {
                return addFullMenuAbove(state, selectedNode, payload.importedData.dpsParam1, payload.importedData.dpsParam2,
                    payload.importedData.clientView);
            }
        } else if (payload.importButtonType === ImportButtonType.FullMenuBelow) {
            if (menuValidation(state, payload.importedData.dpsParam1) || (payload.importedData.dpsParam1.substring(0, 4) === 'ROOT' &&
                selectedNode.data.atN_ParentMenu === 'ROOT' && selectedNode.data.atN_Type === 1)) {
                validationMessage = `The menu'` + payload.importedData.dpsParam1 + ':' + payload.importedData.dpsParam2 + `'
                is already an ancestor of this item an cannot be imported at this position. `;
                return {
                    ...state,
                    isMenuListLoading: false,
                    validationMessage: validationMessage
                };
            } else {
                return addFullMenuBelow(state, selectedNode, payload.importedData.dpsParam1, payload.importedData.dpsParam2,
                    payload.importedData.clientView);
            }
        } else if (payload.importButtonType === ImportButtonType.ChildMenu) {
            if (menuValidation(state, payload.importedData.dpsParam1) || (payload.importedData.dpsParam1.substring(0, 4) === 'ROOT' &&
                selectedNode.data.atN_ParentMenu === 'ROOT' && selectedNode.data.atN_Type === 1)) {
                validationMessage = `The menu'` + payload.importedData.dpsParam1 + ':' + payload.importedData.dpsParam2 + `'
                is already an ancestor of this item an cannot be imported at this position. `;
                return {
                    ...state,
                    isMenuListLoading: false,
                    validationMessage: validationMessage
                };
            } else {
                return addChildrenMenuBelow(state, selectedNode, payload.importedData.dpsParam1, payload.importedData.dpsParam2,
                    payload.importedData.clientView);
            }
        } else {
            return {
                ...state,
                isMenuListLoading: false
            };
        }
    } else {
        validationMessage = `No data to import`;
        return {
            ...state,
            isMenuListLoading: false,
            validationMessage: validationMessage
        };
    }
}



function getImportWorkFlowRuleFail(state: WorkflowMenuState, payload: any) {
    return {
        ...state,
        isMenuListLoading: false
    };
}

function menuValidation(workFlowState: WorkflowMenuState, addMenuCommand: string): boolean {
    let rtn = false;
    let filePathList: WorkflowMenuMetaDataWrapper[] = [];
    const selectedItem = getSelectedItem(workFlowState ? workFlowState.workFlowMenuWrapList : null);
    if (selectedItem && selectedItem.data.atN_ParentMenu === 'ROOT') {
        // filePathList.push(addFirstMenu());
        filePathList.push(selectedItem);
        // return filePathList;
    } else if (selectedItem && workFlowState && workFlowState.workFlowMenuWrapList) {
        getOpenFilePathList(workFlowState.workFlowMenuWrapList, selectedItem, filePathList);
        // filePathList.push(addFirstMenu());
        filePathList.reverse().concat(selectedItem);
    } else if (!selectedItem && workFlowState && workFlowState.workFlowMenuWrapList) {
        filePathList.push(addFirstMenu());
        // return filePathList;
    } else {
        filePathList = [];
    }
    if (!addMenuCommand) {
        rtn = true;
    } else if (addMenuCommand && filePathList && filePathList.length > 0) {
        filePathList.forEach((dataItem) => {
            if (dataItem.data.atN_Command === addMenuCommand) {
                rtn = true;
            }
            if (addMenuCommand === 'ROOT' && selectedItem.data.atN_Level !== 0) {
                rtn = true;
            }
        });
    }
    return rtn;
}

function submenuValidation(selectedNode: any, DPSCommandParam1: string,
    DPSDescriptionParam2: string, importMenuList: any): boolean {

    let rtn = false;
    if (importMenuList && importMenuList.length > 0) {
        _.each(importMenuList, function(item) {
            if (item.ATN_Command === selectedNode.data.ATN_Command) {
                rtn = true;
            }
        });
    }
    return rtn;
}
function addChildrenMenuBelow(state: WorkflowMenuState, selectedNode: WorkflowMenuMetaDataWrapper, dPSCommandParam1: string,
    dPSDescriptionParam2: string, importMenuList: WorkflowMenuMetaItem[]) {
    // const newPerentNode: WorkflowMenuMetaDataWrapper = CreatePerentNode(state, selectedNode, dPSCommandParam1, dPSDescriptionParam2);
    const updatedImportMenuList: WorkflowMenuMetaDataWrapper[] =
        getUpdatedImportChildMenuList(state, selectedNode, dPSCommandParam1, dPSDescriptionParam2, importMenuList);

    return {
        ...state, isDirty: true,
        isMenuListLoading: false,
        workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem, index) => {

            if (rowItem.data.atN_ParentMenu === selectedNode.data.atN_Command) {
                return {
                    ...rowItem, isRightClick: false,
                    data: { ...rowItem.data, atN_Order: ((updatedImportMenuList.length + 1) + index) }
                };
            } else {
                return Object.freeze({ ...rowItem, isRightClick: false });
            }
        }).concat(updatedImportMenuList)
    };
}
function addFullMenuBelow(state: WorkflowMenuState, selectedNode: WorkflowMenuMetaDataWrapper, dPSCommandParam1: string,
    dPSDescriptionParam2: string, importMenuList: WorkflowMenuMetaItem[]) {
    if (selectedNode.data.atN_Type === 1) {
        const newPerentNode: WorkflowMenuMetaDataWrapper = CreatePerentNode(state, selectedNode, dPSCommandParam1,
            dPSDescriptionParam2, 1, true);
        const updatedImportMenuList: WorkflowMenuMetaDataWrapper[] =
            getUpdatedImportMenuList(state, selectedNode, newPerentNode.data.atN_Command, dPSDescriptionParam2, importMenuList);
        return {
            ...state, isDirty: true, isMenuListLoading: false,
            workFlowMenuWrapList: state.workFlowMenuWrapList.concat(updatedImportMenuList).map((rowItem) => {
                if (rowItem.data.atN_ParentMenu === selectedNode.data.atN_Command) {
                    return {
                        ...rowItem, isRightClick: false, isRowSelected: false,
                        data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                    };
                } else {
                    return Object.freeze({ ...rowItem, isRightClick: false, isRowSelected: false, });
                }
            }).concat(newPerentNode)
        };
    } else {
        const newPerentNode: WorkflowMenuMetaDataWrapper = CreatePerentNode(state, selectedNode, dPSCommandParam1,
            dPSDescriptionParam2, (selectedNode.data.atN_Order + 1), true);
        const updatedImportMenuList: WorkflowMenuMetaDataWrapper[] =
            getUpdatedImportMenuList(state, selectedNode, newPerentNode.data.atN_Command, dPSDescriptionParam2, importMenuList);
        return {
            ...state, isDirty: true, isMenuListLoading: false,
            workFlowMenuWrapList: state.workFlowMenuWrapList.concat(updatedImportMenuList).map((rowItem) => {
                if (rowItem.data.atN_ParentMenu === selectedNode.data.atN_ParentMenu &&
                    rowItem.data.atN_Order > selectedNode.data.atN_Order) {
                    return {
                        ...rowItem, isRightClick: false, isRowSelected: false,
                        data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                    };
                } else {
                    return Object.freeze({ ...rowItem, isRightClick: false, isRowSelected: false, });
                }
            }).concat(newPerentNode)
        };
    }
}
function addFullMenuAbove(state: WorkflowMenuState, selectedNode: WorkflowMenuMetaDataWrapper, dPSCommandParam1: string,
    dPSDescriptionParam2: string, importMenuList: WorkflowMenuMetaItem[]) {
    const newPerentNode: WorkflowMenuMetaDataWrapper = CreatePerentNode(state, selectedNode, dPSCommandParam1,
        dPSDescriptionParam2, selectedNode.data.atN_Order, false);
    const updatedImportMenuList: WorkflowMenuMetaDataWrapper[] =
        getUpdatedImportMenuList(state, selectedNode, newPerentNode.data.atN_Command, dPSDescriptionParam2, importMenuList);
    return {
        ...state, isDirty: true, isMenuListLoading: false,
        workFlowMenuWrapList: state.workFlowMenuWrapList.concat(updatedImportMenuList).map((rowItem) => {
            if (rowItem.data.atN_ParentMenu === selectedNode.data.atN_ParentMenu &&
                rowItem.data.atN_Order >= selectedNode.data.atN_Order) {
                return {
                    ...rowItem, isRightClick: false, isRowSelected: false,
                    data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                };
            } else {
                return Object.freeze({ ...rowItem });
            }
        }).concat(newPerentNode)
    };
}
function getUpdatedImportChildMenuList(state: WorkflowMenuState, selectedNode: WorkflowMenuMetaDataWrapper,
    dPSCommandParam1: string, dPSDescriptionParam2: string,
    menuList: WorkflowMenuMetaItem[]): WorkflowMenuMetaDataWrapper[] {

    // if (dPSCommandParam1 === 'ROOT') { dPSCommandParam1 = dPSCommandParam1 + (getMaxMenuKeyId(state, null) + 1); }
    const maxMenuKeyId = getMaxMenuKeyId(state, null) + 2;
    const maxParentId = getMaxParentId(state, null) + 2;

    const importMenuList: WorkflowMenuMetaItem[] = menuList.map((_item, index) => ({
        atN_ID: maxMenuKeyId + index,
        atN_ParentID: maxParentId + index,
        atN_AppID: selectedNode.data.atN_AppID,
        atN_Type: _item.atN_Type,
        atN_Order: 1 + index,
        atN_Command: _item.atN_Command,
        atN_Desc: _item.atN_Desc,
        atN_Level: selectedNode.data.atN_Level + 1,
        atN_Help: '',
        atN_ParentMenu: selectedNode.data.atN_Command,
        nodeStatus: 1, // Request by Suren
        createUser: '',
        dateDone: '',
        checkedOutByUser: _item.checkedOutByUser,
        checkedOutHashKey: _item.checkedOutHashKey
    }));
    const importWrapMenuList: WorkflowMenuMetaDataWrapper[] = importMenuList.map(_item => ({
        treeId: _item.atN_ID,
        parentId: _item.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: _item,
        items: null,
        enabled: true,
        isTreeNodeExpand: false,
    })).filter((row) => {
        const findItem = state.workFlowMenuWrapList.find(
            (item) => item.data.atN_Command === row.data.atN_Command && item.data.atN_ParentMenu === row.data.atN_ParentMenu);
        if (findItem) {
            return null;
        } else {
            return row;
        }
    });
    return importWrapMenuList;
}
function getUpdatedImportMenuList(state: WorkflowMenuState, selectedNode: WorkflowMenuMetaDataWrapper,
    dPSCommandParam1: string, dPSDescriptionParam2: string,
    menuList: WorkflowMenuMetaItem[]): WorkflowMenuMetaDataWrapper[] {

    // if (dPSCommandParam1 === 'ROOT') { dPSCommandParam1 = dPSCommandParam1 + (getMaxMenuKeyId(state, null) + 1); }
    const maxMenuKeyId = getMaxMenuKeyId(state, null) + 2;
    const maxParentId = getMaxParentId(state, null) + 2;

    const importMenuList: WorkflowMenuMetaItem[] = menuList.map((_item, index) => ({
        atN_ID: maxMenuKeyId + index,
        atN_ParentID: maxParentId + index,
        atN_AppID: selectedNode.data.atN_AppID,
        atN_Type: _item.atN_Type,
        atN_Order: _item.atN_Order,
        atN_Command: _item.atN_Command,
        atN_Desc: _item.atN_Desc,
        atN_Level: selectedNode.data.atN_Level + 1,
        atN_Help: '',
        atN_ParentMenu: dPSCommandParam1,
        nodeStatus: 1,
        createUser: '',
        dateDone: '',
        checkedOutByUser: _item.checkedOutByUser,
        checkedOutHashKey: _item.checkedOutHashKey
    }));
    const importWrapMenuList: WorkflowMenuMetaDataWrapper[] = importMenuList.map(_item => ({
        treeId: _item.atN_ID,
        parentId: _item.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: _item,
        items: null,
        enabled: true,
        isTreeNodeExpand: false,
    })).filter((row) => {
        const findItem = state.workFlowMenuWrapList.find(
            (item) => item.data.atN_Command === row.data.atN_Command && item.data.atN_ParentMenu === row.data.atN_ParentMenu);
        if (findItem) {
            return null;
        } else {
            return row;
        }
    });
    return importWrapMenuList;
}

function updateActiveState(rootState: State) {
    return Object.keys(rootState)
        .reduce((_state, key) => {
            if (rootState[key] && rootState[key].isActive) {
                _state[key] = { ...rootState[key], isActive: false };
            } else {
                _state[key] = rootState[key];
            }
            return _state;
        }, {});
}

function requestMenuCancel(state: WorkflowMenuState): Partial<WorkflowMenuState> {
    return {
        ...state,
        requestToCancel: true,
        // isDirty: false
    };
}

function closeMenuEdit(state: WorkflowMenuState): Partial<WorkflowMenuState> {
    return {
        ...state,
        requestToCancel: false,
        isDirty: false,
        workFlowMenuWrapList: state.workFlowMenuWrapListCopy
    };
}

function RemoveIsCancel(state: WorkflowMenuState): Partial<WorkflowMenuState> {
    return {
        ...state,
        requestToCancel: false
    };
}

function getInitViewData(state: WorkflowMenuState, inputData: OpenCaseMenueData): Partial<WorkflowMenuState> {
    let matterDetails: MatterSearchGridData;
    if (inputData && inputData.matterData && inputData.matterData.data) {
        matterDetails = inputData.matterData.data;
    }
    // if (!state) {
    return {
        ...state,
        init: true,
        isActive: true,
        matterInfo: matterDetails,
        openFilePathHistory: [],
        forwardFilePathHistory: [],
        requestToCancel: false,
        isDirty: false,
        isFileBaseMenu: false,
        isShowDeleteMsg: false,
        exportData: null,
        wfSearchText: '',
    };
    // }
    // return state;
}
function loadMenuListData(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: true
    };
}
function loadMenuListDataSuccess(state: WorkflowMenuState, menuList: WorkflowMenuMetaItem[]) {
    // if (state.matterInfo.isProspectMatter) {
    //     menuList = prospectMatterMenu(menuList);
    // }
    const rootRap: WorkflowMenuMetaDataWrapper[] = menuList.map(_item => ({
        treeId: _item.atN_ID,
        parentId: _item.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: _item,
        items: null,
        enabled: true,
        isTreeNodeExpand: false,
    }));
    return {
        ...state,
        isMenuListLoading: false,
        workFlowMenuWrapList: rootRap,
        workFlowMenuWrapListCopy: rootRap
    };

}

function loadMenuListDataFail(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: false
    };
}
// Refresh
function loadMenuListAffterRefresh(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: true
    };
}
function loadMenuListAffterRefreshSuccess(state: WorkflowMenuState, menuList: WorkflowMenuMetaItem[]) {
    // if (state.matterInfo.isProspectMatter) {
    //     menuList = prospectMatterMenu(menuList);
    // }
    const rootRap: WorkflowMenuMetaDataWrapper[] = menuList.map(_item => ({
        treeId: _item.atN_ID,
        parentId: _item.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: _item,
        items: null,
        enabled: true,
        isTreeNodeExpand: false,
    }));
    const newToBeSelectItem = state.workFlowMenuWrapList.find((row) => row.isRowSelected);
    if (newToBeSelectItem) {
        const expandMenuList: WorkflowMenuMetaDataWrapper[] = [];
        getOpenFilePathList(state.workFlowMenuWrapList, newToBeSelectItem, expandMenuList);
        const newList = rootRap.map((item) => {
            if (item.data.atN_Command === newToBeSelectItem.data.atN_Command &&
                item.data.atN_ParentMenu === newToBeSelectItem.data.atN_ParentMenu) {
                return {
                    ...item,
                    isRowSelected: true
                };
            } else {
                if (expandMenuList.find(val => val.data.atN_Command === item.data.atN_Command &&
                    val.data.atN_ParentMenu === item.data.atN_ParentMenu)) {
                    return {
                        ...item,
                        isTreeNodeExpand: true
                    };
                } else {
                    return {
                        ...item,
                        isRowSelected: false
                    };
                }
            }
        });
        return {
            ...state,
            isMenuListLoading: false,
            workFlowMenuWrapList: newList,
            workFlowMenuWrapListCopy: newList,
            forwardFilePathHistory: []
        };
    } else {
        return {
            ...state,
            isMenuListLoading: false,
            workFlowMenuWrapList: rootRap,
            workFlowMenuWrapListCopy: rootRap
        };
    }

}

function loadMenuListAffterRefreshFail(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: false
    };
}
function setSearchText(state: WorkflowMenuState, searchText) {
    return {
        ...state,
        wfSearchText: searchText,
    };
}
// refresh end
function loadMatterSummery(state: WorkflowMenuState) {
    return {
        ...state,
        isMatterSummeryLoading: true
    };
}
function loadMatterSummerySuccess(state: WorkflowMenuState, matterSummery: MatterSummery[]) {
    return {
        ...state,
        menuMatterSummery: matterSummery,
        isMatterSummeryLoading: true
    };
}
function loadMatterSummeryFail(state: WorkflowMenuState) {
    return {
        ...state,
        isMatterSummeryLoading: false
    };
}

function loadMatterShortCutKeys(state: WorkflowMenuState) {
    return {
        ...state,
        isShortCutKeyLoading: true
    };
}
function loadMatterShortCutKeysSuccess(state: WorkflowMenuState, menuMatterShortcuts: MatterShortcuts[]) {
    return {
        ...state,
        menuMatterShortcuts: menuMatterShortcuts,
        isShortCutKeyLoading: true
    };
}
function loadMatterShortCutKeysFail(state: WorkflowMenuState) {
    return {
        ...state,
        isShortCutKeyLoading: false
    };
}

function loadFileBaseMenuData(state: WorkflowMenuState) {
    return {
        ...state,
        isFileBaseMenuLoading: true
    };
}

function loadFileBaseMenuDataSuccess(state: WorkflowMenuState, isFileBaseMenu: boolean) {
    return {
        ...state,
        isFileBaseMenuLoading: false,
        isFileBaseMenu: isFileBaseMenu
    };
}

function loadFileBaseMenuDataFail(state: WorkflowMenuState, s: boolean) {
    return {
        ...state,
        isFileBaseMenuLoading: false
    };
}

function getExportWorkFlowMenu(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: true
    };
}

function getExportWorkFlowMenuSuccess(state: WorkflowMenuState, payload: any) {
    if (!payload.menuExportData.isToServer) {
        return {
            ...state,
            exportData: payload.exportData.data,
            isMenuListLoading: false
        };

    } else {
        return {
            ...state,
            exportToServerTrigger: true, // !state.exportToServerTrigger,
            isMenuListLoading: false
        };
    }
}

function getExportWorkFlowMenuFail(state: WorkflowMenuState) {
    return {
        ...state,
        isMenuListLoading: false
    };
}

// function getSelectedFilePath(items: WorkflowMenuMetaDataWrapper[], selectedItem: WorkflowMenuMetaDataWrapper) {

//     let parentItems: WorkflowMenuMetaDataWrapper[] = [];

//     if (selectedItem && selectedItem.data.atN_ParentMenu === 'DPSMenuRoot') {
//         parentItems.push(selectedItem);
//     }    else if (selectedItem && selectedItem.data.atN_ParentMenu === 'ROOT') {
//         const root = _.filter(items, (item) => item.data.atN_ParentMenu === 'DPSMenuRoot')[0];
//         parentItems.push(selectedItem);
//         parentItems.push(root);
//     } else if (selectedItem && selectedItem.data.atN_Command) {
//         parentItems = self.getParentsList(items, selectedItem);
//         parentItems.unshift(selectedItem);
//     }
//     return parentItems;
// }

// function getParentsList(items: WorkflowMenuMetaDataWrapper[], selectedItem: WorkflowMenuMetaDataWrapper) {

//     let parentItems: WorkflowMenuMetaDataWrapper[];
//     let parentItem: WorkflowMenuMetaDataWrapper;

//     self.viewTreetravers(items, (item: IWorkflowViewMetaDataRap) => {
//         if (item.data.ATN_Command == selectedItem.data.ATN_ParentMenu && item.myId == selectedItem.parentId) {
//             parentItem = item;
//         }
//     })
//     if (parentItem) {
//         self.parentsObj.push(parentItem);
//         self.getParentsList(items, parentItem);
//     }
//     return self.parentsObj
// }


function itemChange(state: WorkflowMenuState, action: Actions.TreeItemChange): Partial<WorkflowMenuState> {
    const temp: any = {};
    switch (action.payload.kind) {
        case ItemChangeKind.RowSelected:
            return {
                ...state,
                workFlowMenuWrapList: treeRowSelectChange(state, action.payload.value),
                openFilePathHistory: state.openFilePathHistory.concat(action.payload.value),
                forwardFilePathHistory: [],
                wfSearchText: ''
            };
        case ItemChangeKind.RowEdit:
            return {
                ...state,
                workFlowMenuWrapList: treeRowEdit(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.RowRightClick:
            return {
                ...state,
                workFlowMenuWrapList: treeRowRightClick(state, action.payload.value)
            };
        case ItemChangeKind.RowEnter:
            return {
                ...state,
                workFlowMenuWrapList: treeRowEnter(state, action.payload.value)
            };
        case ItemChangeKind.RowNodeExpand:
            return {
                ...state,
                workFlowMenuWrapList: treeRowExpand(state, action.payload.value)
            };
        case ItemChangeKind.EditDescriptionUpdate:
            return {
                ...state,
                workFlowMenuWrapList: editDescriptionUpdate(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.EditTypeUpdate:
            return {
                ...state,
                workFlowMenuWrapList: editMenuTypeUpdate(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.EditCommandUpdate:
            return {
                ...state,
                workFlowMenuWrapList: editCommandUpdate(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.AddItemAbove:
            return {
                ...state,
                workFlowMenuWrapList: addItemAbove(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.AddItemBelow:
            return {
                ...state,
                workFlowMenuWrapList: addItemBelow(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.AddMenuAbove:
            return {
                ...state,
                workFlowMenuWrapList: addMenuAbove(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.AddMenuBelow:
            return {
                ...state,
                workFlowMenuWrapList: addMenuBelow(state, action.payload.value),
                isDirty: true
            };
        case ItemChangeKind.CutItem:
            return {
                ...state,
                workFlowMenuWrapList: treeRowSelectChange(state, action.payload.value),
                cutItem: action.payload.value,
                isDirty: true
            };
        case ItemChangeKind.CopyItem:
            return {
                ...state,
                workFlowMenuWrapList: treeRowSelectChange(state, action.payload.value),
                copyItem: action.payload.value,
                isDirty: true
            };
        /////// WorkFlow
        case ItemChangeKind.editTemplate:
            // alert('editTemplate');
            return {
                ...state,
            };
        case ItemChangeKind.RunWorkFlow:
            return {
                ...state
            };
        /////////
        case ItemChangeKind.PaseteItem:
            return paseteItem(state, action.payload.value);
        case ItemChangeKind.DeleteItem:
            return deleteMenuItem(state, action.payload.value);
        // temp[action.token] = deleteMenuItem(state, action.payload.value);
        // return { ...state, ...temp };
        case ItemChangeKind.MenuDragItem:
            return menuItemMove(state, action.payload.value);
        // return {
        //     ...state,
        //     workFlowMenuWrapList: menuItemMove(state, action.payload.value),
        //     isDirty: true
        // };
        case ItemChangeKind.BackwardMenuPath:
            const reverseList = state.openFilePathHistory;
            if (reverseList.length > 1) {
                const nodeZero = reverseList[reverseList.length - 1];
                const nodeOne = reverseList[reverseList.length - 2];
                return {
                    ...state,
                    forwardFilePathHistory: state.forwardFilePathHistory.concat(nodeZero),
                    openFilePathHistory: state.openFilePathHistory.filter((row) => row.treeId !== nodeZero.treeId),
                    workFlowMenuWrapList: treeRowSelectChange(state, nodeOne),
                };
            } else if (reverseList.length === 1) {
                return {
                    ...state,
                    openFilePathHistory: [],
                    workFlowMenuWrapList: treeRowSelectChange(state, addFirstMenu()),
                };
            } else {
                return state;
            }
        case ItemChangeKind.ForwardMenuPath:
            const forwardList = state.forwardFilePathHistory;
            if (forwardList.length > 0) {
                const nodeItemZero = forwardList[forwardList.length - 1];
                return {
                    ...state,
                    openFilePathHistory: state.openFilePathHistory.concat(nodeItemZero),
                    forwardFilePathHistory: state.forwardFilePathHistory.filter((row) => row.treeId !== nodeItemZero.treeId),
                    workFlowMenuWrapList: treeRowSelectChange(state, nodeItemZero),
                };
            } else {
                return state;
            }
        default:
            {
                return state;
            }
    }
}

function treeRowEnter(state: WorkflowMenuState, newItem: any) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === newItem.treeId) {
            return Object.freeze({
                ...rowItem, isRowSelected: true, isRightClick: false, isRowEdit: false,
                data: { ...rowItem.data, atN_Desc: newItem.atN_Desc, atN_Command: newItem.atN_Command }
            });
        } else {
            return Object.freeze({ ...rowItem });
        }
    });
}

function menuItemMove(state: WorkflowMenuState, data: MoveMenuItem) {
    let dragItem = null;
    if (data.ItemDragTo === ItemDragTo.Into) {
        dragItem = CreateDragItem(state, data.dropItem, data.dragItem, 1);
        return {
            ...state, isDirty: true,
            workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
                if (rowItem.data.atN_ID === data.dropItem.data.atN_ID) {
                    return {
                        ...rowItem, isRightClick: false, isRowSelected: false, isTreeNodeExpand: true,
                        data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                    };
                } else {
                    return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
                }
            }).concat(dragItem).filter((row) => row.treeId !== data.dragItem.treeId)
        };
    } else {
        dragItem = CreateDragItem(state, data.dropItem, data.dragItem, 0);
        return {
            ...state, isDirty: true,
            workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
                if (rowItem.data.atN_ParentMenu === data.dropItem.data.atN_ParentMenu &&
                    rowItem.data.atN_Order >= data.dropItem.data.atN_Order) {
                    return {
                        ...rowItem, isRightClick: false, isRowSelected: false,
                        data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                    };
                } else {
                    return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
                }
            }).concat(dragItem).filter((row) => row.treeId !== data.dragItem.treeId)
        };
    }

    // if (data.ItemDragTo === ItemDragTo.Position) {
    //     return state.workFlowMenuWrapList.map(rowItem => {
    //         if (rowItem.treeId === data.dragItem.treeId) {
    //             return Object.freeze({
    //                 ...rowItem, data: {
    //                     ...rowItem.data,
    //                     atN_Order: data.dropItem.data.atN_Order + 1,
    //                     treeLevel: data.dropItem.treeLevel
    //                 }
    //             });
    //         } if (rowItem.data.atN_Order > data.dragItem.data.atN_Order
    //             && rowItem.data.atN_Order < data.dropItem.data.atN_Order
    //             && rowItem.treeLevel === data.dragItem.treeLevel) {
    //             if (data.dragItem.data.atN_Order < data.dropItem.data.atN_Order) {
    //                 return Object.freeze({
    //                     ...rowItem, data: {
    //                         ...rowItem.data,
    //                         atN_Order: rowItem.data.atN_Order - 1
    //                     }
    //                 });
    //             } else {
    //                 return Object.freeze({
    //                     ...rowItem, data: {
    //                         ...rowItem.data,
    //                         atN_Order: rowItem.data.atN_Order + 1
    //                     }
    //                 });
    //             }
    //         }
    //         return rowItem;
    //     });
    // } else if (data.ItemDragTo === ItemDragTo.Into) {
    //     return state.workFlowMenuWrapList.map(rowItem => {
    //         if (rowItem.treeId === data.dragItem.treeId) {
    //             return Object.freeze({
    //                 ...rowItem, data: {
    //                     ...rowItem.data,
    //                     atN_ParentMenu: data.dropItem.data.atN_Command,
    //                     treeLevel: data.dropItem.treeLevel,
    //                     atN_Order: 1
    //                 }
    //             });
    //         } if (rowItem.data.atN_Order > data.dragItem.data.atN_Order && rowItem.treeLevel === data.dragItem.treeLevel) {
    //             return Object.freeze({
    //                 ...rowItem, data: {
    //                     ...rowItem.data,
    //                     atN_Order: rowItem.data.atN_Order - 1
    //                 }
    //             });
    //         } else if (rowItem.treeLevel === data.dropItem.treeLevel) {
    //             return Object.freeze({
    //                 ...rowItem, data: {
    //                     ...rowItem.data,
    //                     atN_Order: rowItem.data.atN_Order + 1
    //                 }
    //             });
    //         }
    //     });
    // } else {
    //     return state.workFlowMenuWrapList;
    // }
}

function deleteLinkItem(state: WorkflowMenuState, value: boolean) {
    const selectedItem = state.workFlowMenuWrapList.find((row) => row.isRowSelected);
    const deletedMainItemList: WorkflowMenuMetaDataWrapper[] = state.workFlowMenuWrapList
        .filter(p => p.treeId !== selectedItem.treeId);
    const parentItemList: WorkflowMenuMetaDataWrapper[] = state.workFlowMenuWrapList
        .filter(p => p.data.atN_Command === selectedItem.data.atN_ParentMenu);
    const deleteItemList: WorkflowMenuMetaDataWrapper[] = deletedMainItemList
        .filter(p => p.data.atN_ParentMenu !== selectedItem.data.atN_Command);
    if (value && deleteItemList && deleteItemList.length > 0) {
        return {
            ...state,
            workFlowMenuWrapList: deleteItemList,
            isShowDeleteMsg: false,
            isDirty: true
        };
    } else {
        return {
            ...state,
            workFlowMenuWrapList: state.workFlowMenuWrapList,
            isShowDeleteMsg: false,
            isDirty: true
        };
    }
}

function deleteMenuItem(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    const deletedMainItemList: WorkflowMenuMetaDataWrapper[] = state.workFlowMenuWrapList
        .filter(p => p.treeId !== selectedItem.treeId);
    const parentItemList: WorkflowMenuMetaDataWrapper[] = state.workFlowMenuWrapList
        .filter(p => p.data.atN_Command === selectedItem.data.atN_ParentMenu);
    const deleteItemList: WorkflowMenuMetaDataWrapper[] = deletedMainItemList
        .filter(p => p.data.atN_ParentMenu !== selectedItem.data.atN_Command);

    if (parentItemList.length > 1) {
        return {
            ...state,
            isShowDeleteMsg: true,
        };
    } else {
        return {
            ...state,
            workFlowMenuWrapList: deleteItemList,
            isShowDeleteMsg: false,
            isDirty: true
        };
    }
}

function paseteItem(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    let copyOrCutItem = null;
    if (state.cutItem) {
        copyOrCutItem = CreateModelItem(state, selectedItem, state.cutItem);
        if (selectedItem.data.atN_Type === 1) {
            return {
                ...state, copyItem: null, cutItem: null,
                workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
                    if (rowItem.data.atN_ID === selectedItem.data.atN_ID) {
                        return {
                            ...rowItem, isRightClick: false, isRowSelected: false, isTreeNodeExpand: true,
                            data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                        };
                    } else {
                        return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
                    }
                }).concat(copyOrCutItem).filter((row) => row.treeId !== state.cutItem.treeId)
            };
        } else {
            return {
                ...state, copyItem: null, cutItem: null,
                workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
                    if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_ParentMenu &&
                        rowItem.data.atN_Order > selectedItem.data.atN_Order) {
                        return {
                            ...rowItem, isRightClick: false, isRowSelected: false,
                            data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                        };
                    } else {
                        return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
                    }
                }).concat(copyOrCutItem).filter((row) => row.treeId !== state.cutItem.treeId)
            };
        }
    } else if (state.copyItem) {
        copyOrCutItem = CreateModelItem(state, selectedItem, state.copyItem);
        if (selectedItem.data.atN_Type === 1) {
            return {
                ...state, copyItem: null, cutItem: null,
                workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
                    if (rowItem.data.atN_ID === selectedItem.data.atN_ID) {
                        return {
                            ...rowItem, isRightClick: false, isRowSelected: false, isTreeNodeExpand: true,
                            data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                        };
                    } else {
                        return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
                    }
                }).concat(copyOrCutItem)
            };
        } else {
            return {
                ...state, copyItem: null, cutItem: null,
                workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
                    if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_ParentMenu &&
                        rowItem.data.atN_Order > selectedItem.data.atN_Order) {
                        return {
                            ...rowItem, isRightClick: false, isRowSelected: false,
                            data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                        };
                    } else {
                        return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
                    }
                }).concat(copyOrCutItem)
            };
        }
    } else {
        return state;
    }
}

// function paseteItem1(state: WorkflowMenuState, copyOrCutItem: WorkflowMenuMetaDataWrapper, selectedItem: WorkflowMenuMetaDataWrapper) {
//     // let copyOrCutItem = null;
//     // if (state.cutItem) {
//     //     copyOrCutItem = CreateModelItem(state, selectedItem, state.cutItem);
//     //     // item = JSON.parse(JSON.stringify(state.cutItem));
//     // } else if (state.copyItem) {
//     //     copyOrCutItem = CreateModelItem(state, selectedItem, state.copyItem);
//     // } else {
//     //     // return state;
//     // }
//     return {
//         ...state.workFlowMenuWrapList,
//         workFlowMenuWrapList: state.workFlowMenuWrapList.map((rowItem) => {
//             if (copyOrCutItem.data.atN_Type === 1 && rowItem.data.atN_ParentMenu === copyOrCutItem.data.atN_Command) {
//                 return {
//                     ...rowItem, isRightClick: false, isRowSelected: false,
//                     data: { ...rowItem.data, atN_Order: selectedItem.data.atN_Order + 1 }
//                 };
//             }
//             if (rowItem.data.atN_ParentMenu === copyOrCutItem.data.atN_ParentMenu
//                 && rowItem.data.atN_Order > copyOrCutItem.data.atN_Order) {
//                 return {
//                     ...rowItem, isRightClick: false, isRowSelected: false,
//                     data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
//                 };
//             } else {
//                 return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
//             }
//         }).concat(copyOrCutItem)
//     };
// }

function editDescriptionUpdate(state: WorkflowMenuState, editUpdateItem: any) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === editUpdateItem.treeId) {
            return Object.freeze({ ...rowItem, data: { ...rowItem.data, atN_Desc: editUpdateItem.atN_Desc } });
        }
        return rowItem;
        // else {
        //     return Object.freeze({ ...rowItem });
        // }
    });
}
function editMenuTypeUpdate(state: WorkflowMenuState, editUpdateItem: any) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === editUpdateItem.treeId) {
            return Object.freeze({
                ...rowItem, data: {
                    ...rowItem.data, atN_Type: editUpdateItem.atN_Type,
                    atN_Command: editUpdateItem.atN_Command
                }
            });
        }
        return rowItem;
    });
}
function editCommandUpdate(state: WorkflowMenuState, editUpdateItem: any) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === editUpdateItem.treeId) {
            return Object.freeze({ ...rowItem, data: { ...rowItem.data, atN_Command: editUpdateItem.atN_Command } });
        }
        return rowItem;
    });
}
function addItemAbove(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    // selectedNode/isAbove/isSelectedNodeIsMenu/isAddMenuItem/maxMenuKeyID/maxParentID/matterAppId/
    const newNode = createNewRowItem(selectedItem, true, isNodeTypeMenu(selectedItem), false,
        getMaxMenuKeyId(state, selectedItem), getMaxParentId(state, selectedItem), +state.matterInfo.appID);

    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_ParentMenu && rowItem.data.atN_Order >= selectedItem.data.atN_Order) {
            return {
                ...rowItem, isRightClick: false, isRowSelected: false,
                data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
            };
        } else {
            return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
        }
    }).concat(newNode);
}

function addItemBelow(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    // selectedNode/isAbove/isSelectedNodeIsMenu/isAddMenuItem/maxMenuKeyID/maxParentID/matterAppId/
    const newNode = createNewRowItem(selectedItem, false, isNodeTypeMenu(selectedItem), false,
        getMaxMenuKeyId(state, selectedItem), getMaxParentId(state, selectedItem), +state.matterInfo.appID);
    if (selectedItem.data.atN_Type === 1) {
        return state.workFlowMenuWrapList.map((rowItem) => {
            if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_Command) {
                return {
                    ...rowItem,
                    data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                };
            } else if (rowItem.data.atN_ID === selectedItem.data.atN_ID) {
                return {
                    ...rowItem, isTreeNodeExpand: true, isRightClick: false, isRowSelected: false
                };
            } else {
                return Object.freeze({ ...rowItem, isRowSelected: false });
            }
        }).concat(newNode);
    } else {
        return state.workFlowMenuWrapList.map((rowItem) => {
            if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_ParentMenu && rowItem.data.atN_Order > selectedItem.data.atN_Order) {
                return {
                    ...rowItem, isRightClick: false, isRowSelected: false,
                    data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                };
            } else {
                return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
            }
        }).concat(newNode);
    }
}

function addMenuAbove(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    // selectedNode/isAbove/isSelectedNodeIsMenu/isAddMenuItem/maxMenuKeyID/maxParentID/matterAppId/
    const newNode = createNewRowItem(selectedItem, true, isNodeTypeMenu(selectedItem), true,
        getMaxMenuKeyId(state, selectedItem), getMaxParentId(state, selectedItem), +state.matterInfo.appID);

    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_ParentMenu && rowItem.data.atN_Order >= selectedItem.data.atN_Order) {
            return {
                ...rowItem, isRightClick: false, isRowSelected: false,
                data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
            };
        } else {
            return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
        }
    }).concat(newNode);
}

function addMenuBelow(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    // selectedNode/isAbove/isSelectedNodeIsMenu/isAddMenuItem/maxMenuKeyID/maxParentID/matterAppId/
    const newNode = createNewRowItem(selectedItem, false, isNodeTypeMenu(selectedItem), true,
        getMaxMenuKeyId(state, selectedItem), getMaxParentId(state, selectedItem), +state.matterInfo.appID);
    if (selectedItem.data.atN_Type === 1) {
        return state.workFlowMenuWrapList.map((rowItem) => {
            if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_Command) {
                return {
                    ...rowItem,
                    data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                };
            } else if (rowItem.data.atN_ID === selectedItem.data.atN_ID) {
                return {
                    ...rowItem, isTreeNodeExpand: true, isRightClick: false, isRowSelected: false
                };
            } else {
                return Object.freeze({ ...rowItem, isRowSelected: false });
            }
        }).concat(newNode);
    } else {
        return state.workFlowMenuWrapList.map((rowItem) => {
            if (rowItem.data.atN_ParentMenu === selectedItem.data.atN_ParentMenu && rowItem.data.atN_Order > selectedItem.data.atN_Order) {
                return {
                    ...rowItem, isRightClick: false, isRowSelected: false,
                    data: { ...rowItem.data, atN_Order: rowItem.data.atN_Order + 1 }
                };
            } else {
                return Object.freeze({ ...rowItem, isRowSelected: false, isRightClick: false });
            }
        }).concat(newNode);
    }
}

function getMaxMenuKeyId(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    const maxMenuKeyId = _.maxBy(state.workFlowMenuWrapList, function(item) { return item.treeId; }).treeId;
    return maxMenuKeyId;
}
function getMaxParentId(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    const maxParentId = _.maxBy(state.workFlowMenuWrapList, function(item) { return item.parentId; }).parentId;
    return maxParentId;
}
function getSelectedParentLevelNode(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    const menuGroup = _.groupBy(state.workFlowMenuWrapList, function(item) { return item.data.atN_ParentMenu; });
    const parentItems = menuGroup[selectedItem.data.atN_ParentMenu];
    return parentItems;
}
function getSelectedChildLevelNode(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper) {
    const menuGroup = _.groupBy(state.workFlowMenuWrapList, function(item) { return item.data.atN_ParentMenu; });
    const childItems = menuGroup[selectedItem.data.atN_Command];
    return childItems;
}
function isNodeTypeMenu(selectedItem: WorkflowMenuMetaDataWrapper): boolean {
    if (selectedItem && selectedItem.data && selectedItem.data.atN_Type === 1) {
        return true;
    } else {
        return false;
    }
}
function CreatePerentNode(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper,
    dPSCommandParam1: string, dPSDescriptionParam2: string, menuOrder: number, isBelow: boolean): WorkflowMenuMetaDataWrapper {
    if (dPSCommandParam1 === 'ROOT') { dPSCommandParam1 = dPSCommandParam1 + (getMaxMenuKeyId(state, null) + 1); }
    const maxMenuKeyId = getMaxMenuKeyId(state, null) + 1;
    const maxParentId = getMaxParentId(state, null) + 1;

    const newMenuPerentNode: WorkflowMenuMetaItem = {
        atN_AppID: selectedItem.data.atN_AppID,
        atN_Command: dPSCommandParam1,
        atN_Desc: dPSDescriptionParam2,
        atN_Help: '',
        atN_ID: maxMenuKeyId,
        atN_Level: selectedItem.data.atN_Level,
        atN_Order: menuOrder,
        atN_ParentID: maxParentId,
        atN_ParentMenu: selectedItem.data.atN_ParentMenu,
        atN_Type: 1, // Menu
        createUser: '',
        dateDone: '',
        nodeStatus: MenuNodeStatus.NotChange,

    };
    if (isBelow && selectedItem.data.atN_Type === 1) {
        newMenuPerentNode.atN_Level = selectedItem.data.atN_Level + 1;
        newMenuPerentNode.atN_Order = 1;
        newMenuPerentNode.atN_ParentMenu = selectedItem.data.atN_Command;
    }
    const newPerentNode: WorkflowMenuMetaDataWrapper = {
        treeId: maxMenuKeyId,
        parentId: maxParentId,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: true,
        indexId: 0,
        data: newMenuPerentNode,
        items: [],
        enabled: true,
        isTreeNodeExpand: false,
    };
    return newPerentNode;
}
function CreateDragItem(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper,
    copyNode: WorkflowMenuMetaDataWrapper, itemType: number): WorkflowMenuMetaDataWrapper {
    const newMenuItemData: WorkflowMenuMetaItem = {
        atN_AppID: copyNode.data.atN_AppID,
        atN_Command: copyNode.data.atN_Command,
        atN_Desc: copyNode.data.atN_Desc,
        atN_Help: copyNode.data.atN_Help,
        atN_ID: copyNode.data.atN_ID,
        atN_Level: copyNode.data.atN_Level,
        atN_Order: copyNode.data.atN_Order,
        atN_ParentID: copyNode.data.atN_ParentID,
        atN_ParentMenu: copyNode.data.atN_ParentMenu,
        atN_Type: copyNode.data.atN_Type,
        createUser: '',
        dateDone: '',
        nodeStatus: MenuNodeStatus.NotChange,
    };
    if (itemType === 1) {
        newMenuItemData.atN_ID = getMaxMenuKeyId(state, selectedItem) + 1;
        newMenuItemData.atN_Order = selectedItem.data.atN_Order;
        newMenuItemData.atN_ParentMenu = selectedItem.data.atN_Command;
        newMenuItemData.atN_Level = selectedItem.data.atN_Level + 1;
        // selectedNode.data.isTreeNodeExpand = true;
    } else {
        newMenuItemData.atN_ID = getMaxMenuKeyId(state, selectedItem) + 1;
        newMenuItemData.atN_Order = selectedItem.data.atN_Order;
        newMenuItemData.atN_ParentMenu = selectedItem.data.atN_ParentMenu;
        newMenuItemData.atN_Level = selectedItem.data.atN_Level;
    }

    const newItem: WorkflowMenuMetaDataWrapper = {
        treeId: getMaxMenuKeyId(state, selectedItem) + 1,
        parentId: copyNode.data.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: true,
        indexId: 0,
        data: newMenuItemData,
        items: [],
        enabled: true,
        isTreeNodeExpand: false,
    };
    return newItem;
}
function CreateModelItem(state: WorkflowMenuState, selectedItem: WorkflowMenuMetaDataWrapper,
    copyNode: WorkflowMenuMetaDataWrapper): WorkflowMenuMetaDataWrapper {
    const newMenuItemData: WorkflowMenuMetaItem = {
        atN_AppID: copyNode.data.atN_AppID,
        atN_Command: copyNode.data.atN_Command,
        atN_Desc: copyNode.data.atN_Desc,
        atN_Help: copyNode.data.atN_Help,
        atN_ID: copyNode.data.atN_ID,
        atN_Level: copyNode.data.atN_Level,
        atN_Order: copyNode.data.atN_Order,
        atN_ParentID: copyNode.data.atN_ParentID,
        atN_ParentMenu: copyNode.data.atN_ParentMenu,
        atN_Type: copyNode.data.atN_Type,
        createUser: '',
        dateDone: '',
        nodeStatus: MenuNodeStatus.NotChange,
    };
    if (selectedItem.data.atN_Type === 1) {
        newMenuItemData.atN_ID = getMaxMenuKeyId(state, selectedItem) + 1;
        newMenuItemData.atN_Order = 1;
        newMenuItemData.atN_ParentMenu = selectedItem.data.atN_Command;
        newMenuItemData.atN_Level = selectedItem.data.atN_Level + 1;
        // selectedNode.data.isTreeNodeExpand = true;
    } else {
        newMenuItemData.atN_ID = getMaxMenuKeyId(state, selectedItem) + 1;
        newMenuItemData.atN_Order = selectedItem.data.atN_Order + 1;
        newMenuItemData.atN_ParentMenu = selectedItem.data.atN_ParentMenu;
        newMenuItemData.atN_Level = selectedItem.data.atN_Level;
    }

    const newItem: WorkflowMenuMetaDataWrapper = {
        treeId: getMaxMenuKeyId(state, selectedItem) + 1,
        parentId: copyNode.data.atN_ParentID,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: true,
        indexId: 0,
        data: newMenuItemData,
        items: [],
        enabled: true,
        isTreeNodeExpand: false,
    };
    return newItem;
}
// selectedNode/isAbove/isSelectedNodeIsMenu/isAddMenuItem/maxMenuKeyID/maxParentID/matterAppId/
function createNewRowItem(selectedNode: WorkflowMenuMetaDataWrapper, isAbove: boolean, isSelectedNodeIsMenu: boolean,
    isAddMenuItem: boolean, maxMenuKeyID: number, maxParentID: number, matterAppId: number): WorkflowMenuMetaDataWrapper {
    let menuOrder = 1;
    let menuType = 4;
    let ParentMenu = 'ROOT';
    let MenuNodeCommand = 'TEMPLATE.XML';
    let menuNodeLevel = 0;
    maxMenuKeyID = maxMenuKeyID + 1; // ATN_ID
    maxParentID = maxParentID + 1; // ATN_ParentID;
    if (isAddMenuItem) {
        MenuNodeCommand = 'NEW_MENU' + maxParentID + '.MNU';
        menuType = 1;
    }
    if (isSelectedNodeIsMenu) {
        if (isAbove) {
            menuOrder = selectedNode.data.atN_Order;
            ParentMenu = selectedNode.data.atN_ParentMenu;
            menuNodeLevel = selectedNode.data.atN_Level;
        } else {
            menuOrder = 1;
            ParentMenu = selectedNode.data.atN_Command;
            menuNodeLevel = selectedNode.data.atN_Level + 1;
        }
    } else {
        ParentMenu = selectedNode.data.atN_ParentMenu;
        menuNodeLevel = selectedNode.data.atN_Level;
        if (isAbove) {
            menuOrder = selectedNode.data.atN_Order;
        } else {
            menuOrder = selectedNode.data.atN_Order + 1;
        }
    }
    const newMenuItemData: WorkflowMenuMetaItem = {
        atN_AppID: matterAppId,
        atN_Command: MenuNodeCommand,
        atN_Desc: 'Enter a description',
        atN_Help: '',
        atN_ID: maxMenuKeyID,
        atN_Level: menuNodeLevel,
        atN_Order: menuOrder,
        atN_ParentID: maxParentID,
        atN_ParentMenu: ParentMenu,
        atN_Type: menuType,
        createUser: '',
        dateDone: '',
        nodeStatus: MenuNodeStatus.NotChange,
    };
    const rapNewItem: WorkflowMenuMetaDataWrapper = {
        treeId: maxMenuKeyID,
        parentId: maxParentID,
        treeLevel: 0,
        isRowEdit: true,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: newMenuItemData,
        items: [],
        enabled: true,
        isTreeNodeExpand: false,
    };
    return rapNewItem;
}

function treeRowSelectChange(state: WorkflowMenuState, newItem: WorkflowMenuMetaDataWrapper) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === newItem.treeId) {
            return Object.freeze({ ...rowItem, isRowSelected: true, isRightClick: false });
        } else {
            return Object.freeze({ ...rowItem, isRowSelected: false, isRowEdit: false, isRightClick: false });
        }
    });
}
function treeRowExpand(state: WorkflowMenuState, newItem: WorkflowMenuMetaDataWrapper) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === newItem.treeId) {
            return Object.freeze({ ...rowItem, isTreeNodeExpand: !rowItem.isTreeNodeExpand });
        } else {
            return Object.freeze({ ...rowItem });
        }

    });
}
function treeRowEdit(state: WorkflowMenuState, newItem: WorkflowMenuMetaDataWrapper) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === newItem.treeId) {
            return Object.freeze({ ...rowItem, isRowEdit: true, isRightClick: false });
        } else {
            return Object.freeze({ ...rowItem, isRowEdit: false, isRowSelected: false, isRightClick: false });
        }

    });
}
function treeRowRightClick(state: WorkflowMenuState, newItem: WorkflowMenuMetaDataWrapper) {
    return state.workFlowMenuWrapList.map((rowItem) => {
        if (rowItem.treeId === newItem.treeId) {
            return Object.freeze({ ...rowItem, isRightClick: true, isRowSelected: true });
        } else {
            return Object.freeze({ ...rowItem, isRightClick: false, isRowSelected: false, isRowEdit: false });
        }
    });
}





export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => {
    return views[token];
});

export const getActiveToken = createSelector(getView, (views) =>
    Object.keys(views)
        .map((key) => ({ token: key, state: views[key] }))
        .filter((info) => info.state ? !!info.state.isActive : false)
        .map((info) => info.token)
        .reduce((val, cur) => cur, null)
);

export const getMatterInfoByToken = (token) => createSelector(getViewByToken(token), (workFlowState) => {
    return workFlowState ? workFlowState.matterInfo : null;
});
export const getTreeViewByToken = (token) => createSelector(getViewByToken(token), (workFlowState) => {
    return workFlowState ? CreateTreeForEditMenu(workFlowState.workFlowMenuWrapList, workFlowState.matterInfo) : null;
});
export const getMenuMatterSummeryByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.menuMatterSummery : null);
export const getMenuShortcutKeysByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.menuMatterShortcuts : null);
export const getIsMenuInitByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState && workFlowState.init && workFlowState.workFlowMenuWrapList ? true : false);
export const getFilePathHistoryByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.openFilePathHistory : null);
export const getForwardFilePathByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.forwardFilePathHistory : null);

export const getExportrdDataByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.exportData : null);

export const getExportToServerTriggerByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.exportToServerTrigger : null);

export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.isMenuListLoading : false);
export const getmenuListByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.workFlowMenuWrapListCopy : []);


export const getCutOrCopyItemByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => {
        if (workFlowState && workFlowState.cutItem) {
            return workFlowState.cutItem;
        } else if (workFlowState && workFlowState.copyItem) {
            return workFlowState.copyItem;
        } else {
            return null;
        }
    });
export const getValidationMessageByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.validationMessage : null);

export const getIsFileBaseMenuByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.isFileBaseMenu : false);
export const getWfItemSearchTextByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.wfSearchText : '');

export const getSelectedChildListByToken = (token) => createSelector(getViewByToken(token), (workFlowState) => {
    const selectedMenuItem = workFlowState && workFlowState.workFlowMenuWrapList ? workFlowState.workFlowMenuWrapList.find((item) =>
        item.isRowSelected) : null;
    if (workFlowState && workFlowState.workFlowMenuWrapList && workFlowState.wfSearchText) {
        const searchWfNodes = getSearchNode(workFlowState.workFlowMenuWrapList, workFlowState.wfSearchText)
        return searchWfNodes ? searchWfNodes : [];
    }
    else if (workFlowState && workFlowState.workFlowMenuWrapList && selectedMenuItem) {
        const menuGroup = _.groupBy(workFlowState.workFlowMenuWrapList, function(item) { return item.data.atN_ParentMenu; });
        const allItems = menuGroup[selectedMenuItem.data.atN_Command];
        return allItems;
    } else if (workFlowState && workFlowState.matterInfo && workFlowState.matterInfo.isProspectMatter && !selectedMenuItem) {
        const prospectItems = matterMenusForView(workFlowState.workFlowMenuWrapList, workFlowState.matterInfo);
        if (prospectItems && prospectItems.length > 0) {
            const menuGroup = _.groupBy(workFlowState.workFlowMenuWrapList, function(item) { return item.data.atN_ParentMenu; });
            return menuGroup[prospectItems[0].data.atN_Command];
        }
        return [];
    } else if (workFlowState && workFlowState.workFlowMenuWrapList && !selectedMenuItem) {
        const menuGroup = _.groupBy(workFlowState.workFlowMenuWrapList, function(item) { return item.data.atN_ParentMenu; });
        const allItems = menuGroup['ROOT'];
        return allItems;
    } else {
        return [];
    }
});
export const getIsOpenConfrimExitByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => {
        if (workFlowState && workFlowState.requestToCancel && workFlowState.isDirty) {
            return true;
        }
        return false;
    });
export const getIsDirtyByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.isDirty : false);

export const getIsRequestToExitByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.requestToCancel : null);

export const getSelectedMenuItemByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState && workFlowState.workFlowMenuWrapList ? workFlowState.workFlowMenuWrapList.find((row) => row.isRowSelected) : null);

function getSelectedItem(workFlowMenuWrapList: WorkflowMenuMetaDataWrapper[]) {
    if (!workFlowMenuWrapList) {
        return null;
    }
    return workFlowMenuWrapList.find((row) => row.isRowSelected);
}

export const getOpenFilePathByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => {
        const filePathList: WorkflowMenuMetaDataWrapper[] = [];
        const selectedItem = getSelectedItem(workFlowState ? workFlowState.workFlowMenuWrapList : null);
        if (selectedItem && selectedItem.data.atN_ParentMenu === 'ROOT') {
            filePathList.push(addFirstMenu());
            filePathList.push(selectedItem);
            return filePathList;
        } else if (selectedItem && workFlowState && workFlowState.workFlowMenuWrapList) {
            getOpenFilePathList(workFlowState.workFlowMenuWrapList, selectedItem, filePathList);
            filePathList.push(addFirstMenu());
            return filePathList.reverse().concat(selectedItem);
        } else if (!selectedItem && workFlowState && workFlowState.workFlowMenuWrapList) {
            filePathList.push(addFirstMenu());
            return filePathList;
        } else {
            return [];
        }
    });

export const getIsRequestToCancelByToken = (token) => createSelector(getViewByToken(token),
    (workFlowState) => workFlowState ? workFlowState.requestToCancel : null);

export const getMenuListByToken = (token) => createSelector(getViewByToken(token), (workFlowState) => {
    let menuList: WorkflowMenuMetaItem[] = [];
    if (workFlowState && workFlowState.workFlowMenuWrapList) {
        workFlowState.workFlowMenuWrapList.forEach((item) => {
            menuList = menuList.concat(item.data);
        });
    }
    return menuList;
});

export const getRightMenuByToken = (token) => createSelector(getViewByToken(token), (workFlowState) => {
    return workFlowState ? workFlowState.workFlowMenuWrapList.find((row) => row.isRightClick).data : null;
});
export const getCanDeleteMsgByToken = (token) => createSelector(getViewByToken(token), (workFlowState) => {
    return workFlowState ? workFlowState.isShowDeleteMsg : null;
});

function getSearchNode(treeList: WorkflowMenuMetaDataWrapper[], searchTest: string) {
    const searchNode: WorkflowMenuMetaDataWrapper[] = [];
    getDataWfTravers(treeList, (item: WorkflowMenuMetaDataWrapper) => {
        if (item.data.atN_Desc.toLowerCase().includes(searchTest.trim().toLowerCase())) {
            searchNode.push(item);
        }
    });
    return searchNode;
}
function getDataWfTravers(list: WorkflowMenuMetaDataWrapper[], callback: (item: WorkflowMenuMetaDataWrapper, parent?: WorkflowMenuMetaDataWrapper) => void) {
    const travel = function(items: WorkflowMenuMetaDataWrapper[], parent: WorkflowMenuMetaDataWrapper) {
        items.forEach((item) => {
            callback(item, parent);
            if (item.items && item.items.length) {
                travel(item.items, item);
            }
        });
    };
    travel(list, null);
}

function addFirstMenu() {
    const newMenuItemData: WorkflowMenuMetaItem = {
        atN_AppID: -1,
        atN_Command: 'ROOT',
        atN_Desc: 'First Menu',
        atN_Help: '',
        atN_ID: -1,
        atN_Level: -1,
        atN_Order: 0,
        atN_ParentID: 0,
        atN_ParentMenu: 'DPSMenuRoot',
        atN_Type: 1,
        createUser: '',
        dateDone: '',
        nodeStatus: MenuNodeStatus.NotChange,
    };
    const rapNewItem: WorkflowMenuMetaDataWrapper = {
        treeId: -1,
        parentId: -1,
        treeLevel: 0,
        isRowEdit: true,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: newMenuItemData,
        items: [],
        enabled: true,
        isTreeNodeExpand: false,
    };
    return rapNewItem;
}

function getOpenFilePathList(items: WorkflowMenuMetaDataWrapper[], selectedItem: WorkflowMenuMetaDataWrapper,
    filePathList: WorkflowMenuMetaDataWrapper[]) {
    // const fileList: WorkflowMenuMetaDataWrapper[] = [];
    let parentItem: WorkflowMenuMetaDataWrapper;
    travers(items, (item: WorkflowMenuMetaDataWrapper) => {
        if (item.data.atN_Command === selectedItem.data.atN_ParentMenu) {
            parentItem = item;
        }
    });
    if (parentItem) {
        filePathList.push(parentItem);
        getOpenFilePathList(items, parentItem, filePathList);
    }
    // return fileList;
}

// --------- Menu Edit ------------
function CreateTreeForEditMenu(items: WorkflowMenuMetaDataWrapper[], matterInfo: MatterSearchGridData): WorkflowMenuMetaDataWrapper[] {
    const rootRap: WorkflowMenuMetaDataWrapper[] = [];
    items = matterMenusForView(items, matterInfo);
    if (items) {
        let index = 0;
        items.sort(function(a, b) {
            return (a.data.atN_Order > b.data.atN_Order) ? 1 :
                ((b.data.atN_Order > a.data.atN_Order) ? -1 : 0);
        });
        const root = items.filter((item) => item.data.atN_ParentMenu === 'ROOT');
        root.forEach((item) => {
            const tempItem: WorkflowMenuMetaDataWrapper = {
                treeLevel: item.treeLevel,
                parentId: item.parentId,
                isRowEdit: item.isRowEdit,
                isRightClick: item.isRightClick,
                isRowSelected: item.isRowSelected,
                indexId: item.indexId,
                data: item.data,
                items: item.items,
                enabled: item.enabled,
                isTreeNodeExpand: item.isTreeNodeExpand,
                treeId: item.treeId
            };
            // console.log('WF ROOT - ' + item.data.atN_ID + ' - ' + item.data.atN_Command);
            tempItem.items = getEditNestedChildren(item.data.atN_Command, items);
            rootRap.push(tempItem);
        });

        travers(rootRap, (item: WorkflowMenuMetaDataWrapper, parent: WorkflowMenuMetaDataWrapper) => {
            if (parent) {
                item.treeLevel = parent.treeLevel + 1;
                item.indexId = index;
            } else {
                item.treeLevel = 0;
                item.indexId = index;
            }
            index = index + 1;
        });
    }
    return rootRap;
}

function travers(list: WorkflowMenuMetaDataWrapper[], callback: (item: WorkflowMenuMetaDataWrapper, parent?:
    WorkflowMenuMetaDataWrapper) => void) {
    const curItem = list;
    const travel = function(items: WorkflowMenuMetaDataWrapper[], parent: WorkflowMenuMetaDataWrapper) {
        items.forEach((item) => {
            callback(item, parent);
            if (item.items && item.items.length) {
                travel(item.items, item);
            }
        });
    };
    travel(list, null);
}

function getEditNestedChildren(parentId: string, nodes: WorkflowMenuMetaDataWrapper[]): WorkflowMenuMetaDataWrapper[] {
    const out: WorkflowMenuMetaDataWrapper[] = [];
    nodes.forEach(function(object) {
        if (object.data.atN_ParentMenu === parentId) {
            const tempobject: WorkflowMenuMetaDataWrapper = {
                treeLevel: object.treeLevel,
                parentId: object.parentId,
                isRowEdit: object.isRowEdit,
                isRightClick: object.isRightClick,
                isRowSelected: object.isRowSelected,
                indexId: object.indexId,
                data: object.data,
                items: object.items,
                enabled: object.enabled,
                isTreeNodeExpand: object.isTreeNodeExpand,
                treeId: object.treeId
            };
            //  console.log('WF CHILD - ' + object.data.atN_ID + ' - ' + object.data.atN_Command);
            tempobject.items = getEditNestedChildren(object.data.atN_Command, nodes);
            out.push(tempobject);
        }
    });
    return out;
}

// --------- Menu Edit End ------------






// getMatterInfoByToken getIsLoadingByToken = (token) => createSelector(getViewByToken(token), (menuState) =>
//     menuState ?
//         menuState.isMenuListLoading || menuState.isFileBaseMenuLoading
//         : false);

// this.matterInfo = {
//     appID: inputData.matterData.data.appID,
//     fileID: inputData.matterData.data.appID,
//     closed: inputData.matterData.data.closed,
//     lastUsed: inputData.matterData.data.lastUsed,
//     app_Code: inputData.matterData.data.app_Code,
//     branchID: inputData.matterData.data.branchID,
//     feeEarner: inputData.matterData.data.feeEarner,
//     reviewDate: inputData.matterData.data.reviewDate,
//     clientName: inputData.matterData.data.clientName,
//     reviewNote: inputData.matterData.data.reviewNote,
//     company_Name: inputData.matterData.data.matterDetails,
//     matterDetails: inputData.matterData.data.matterDetails,
//     matterReferenceNo: inputData.matterData.data.matterReferenceNo,
//     rateCategory: inputData.matterData.data.rateCategory,
// };

