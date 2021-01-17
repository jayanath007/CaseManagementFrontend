// import { sortBy } from 'lodash/sortBy';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import { WorkflowRuleListData, RuleOperator, WorkflowRuleSelectedItemData, MatterData } from '../models/interfaces';

export interface State {
    readonly [token: string]: WorkflowRuleState;
}

export interface WorkflowRuleState {
    readonly loading: boolean;
    readonly isDirty: boolean;
    readonly isSaveApply: boolean;
    readonly workflowRuleList: WorkflowRuleListData[];
    readonly selectedWorkflowRuleList: WorkflowRuleListData[];
    readonly recentlySelectedItem: WorkflowRuleListData;
    readonly appId: number;
    readonly fileId: number;
    readonly branchId: number;
    readonly maxRuleID: number;
    readonly maxRowOrder: number;
    readonly maxPosition: number;
    readonly matterData: MatterData;
    readonly exportedData: any;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.INIT_WORKFLOW_RULE:
            temp[action.token] = getInitViewData(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.INIT_WORKFLOW_RULE_SUCCESS:
            temp[action.token] = getInitViewDataSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.INIT_WORKFLOW_RULE_FAIL:
            temp[action.token] = getInitViewDataFail(state[action.token]);
            return { ...state, ...temp };


        case Actions.SAVE_WORKFLOW_RULE:
            temp[action.token] = saveData(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_WORKFLOW_RULE_SUCCESS:
            temp[action.token] = saveDataSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.SAVE_WORKFLOW_RULE_FAIL:
            temp[action.token] = saveDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_OPERATOR:
            temp[action.token] = setChangeOperator(state[action.token], action.payload.selectedItem, action.payload.operator);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_ACTION:
            temp[action.token] = setChangeAction(state[action.token], action.payload.selectedItem, action.payload.action);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_TEXT_VAR_NO:
            temp[action.token] = setChangeTestVarNo(state[action.token], action.payload.selectedItem, action.payload.wfR_Test);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_CRITERIA:
            temp[action.token] = setChangeCriteria(state[action.token], action.payload.selectedItem, action.payload.wfR_Control);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_ITEM:
            temp[action.token] = setChangeItem(state[action.token], action.payload.selectedItem, action.payload.wfR_Command);
            return { ...state, ...temp };
        case Actions.SELECT_WORKFLOW_RULE_ITEM:
            temp[action.token] = setSelectItem(state[action.token], action.payload.selectedItem, action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_DESCRIPTION:
            temp[action.token] = setChangeDescription(state[action.token], action.payload.selectedItem, action.payload.wfR_Description);
            return { ...state, ...temp };

        case Actions.WORKFLOW_RULE_EXPORT:
            temp[action.token] = getExportWorkFlowRule(state[action.token]);
            return { ...state, ...temp };
        case Actions.WORKFLOW_RULE_EXPORT_SUCCESS:
            temp[action.token] = getExportWorkFlowRuleSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_RULE_EXPORT_FAIL:
            temp[action.token] = getExportWorkFlowRuleFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.WORKFLOW_RULE_IMPORT:
            temp[action.token] = getImportWorkFlowRule(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_RULE_IMPORT_SUCCESS:
            temp[action.token] = getImportWorkFlowRuleSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.WORKFLOW_RULE_IMPORT_FAIL:
            temp[action.token] = getImportWorkFlowRuleFail(state[action.token]);
            return { ...state, ...temp };


        case Actions.ADD_NEW_WORKFLOW_RULE:
            temp[action.token] = addNewWorkFlowRule(state[action.token]);
            return { ...state, ...temp };
        case Actions.ADD_NEW_WORKFLOW_RULE_SUCCESS:
            temp[action.token] = AddNewWFRuleSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.SELECT_WORKFLOW_RULE_ROW:
            temp[action.token] = selectWFRuleItem(state[action.token], action.payload.selectedItemData);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_UP:
            temp[action.token] = workflowRuleUp(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_DOWN:
            temp[action.token] = workflowRuleDown(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_WORKFLOW_RULE_UP_DOWN:
            temp[action.token] = workflowRuleUpDown(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.DELETE_WORKFLOW_RULE:
            temp[action.token] = deleteWorkflowRule(state[action.token]);
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function getInitViewData(state: WorkflowRuleState, inputData) {
      return {
        ...state,
        init: true,
        isDirty: false,
        loading: true,
        isSaveApply: false,
        appId: inputData.appId,
        fileId: inputData.fileId,
        branchId: inputData.branchId,
        matterData: inputData,
        recentlySelectedItem: null,
        selectedWorkflowRuleList: []
    };
}

function getInitViewDataSuccess(state: WorkflowRuleState, payload) {

    const newRuleList = updateEntireRuleListProperties(payload.workflowRuleList.data);
    return {
        ...state,
        loading: false,
        workflowRuleList: newRuleList,
        maxRuleID: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_ID').wfR_ID : null,
        maxRowOrder: newRuleList.length > 0 ? _.maxBy(newRuleList, 'rowOrder').rowOrder : 0,
        maxPosition: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_Position').wfR_Position : 0,
    };
}

function getInitViewDataFail(state: WorkflowRuleState) {
    return {
        ...state,
        loading: false,
        workflowRuleList: []
    };
}
function getExportWorkFlowRule(state: WorkflowRuleState) {
    return {
        ...state,
        loading: true
    };
}

function getExportWorkFlowRuleSuccess(state: WorkflowRuleState, payload: any) {
    return {
        ...state,
        exportedData: payload.exportedData.data,
        loading: false
    };
}

function getExportWorkFlowRuleFail(state: WorkflowRuleState) {
    return {
        ...state,
        loading: false
    };
}

function getImportWorkFlowRule(state: WorkflowRuleState, payload: any) {
    return {
        ...state,
        loading: true
    };
}

function getImportWorkFlowRuleSuccess(state: WorkflowRuleState, payload: any) {

    if (payload.isReplace) {
        const newRuleList = updateEntireRuleListProperties(payload.importedData);
        return {
            ...state,
            loading: false,
            isDirty: true,
            workflowRuleList: newRuleList,
            maxRuleID: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_ID').wfR_ID : null,
            maxRowOrder: newRuleList.length > 0 ? _.maxBy(newRuleList, 'rowOrder').rowOrder : 0,
            maxPosition: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_Position').wfR_Position : 0,
            recentlySelectedItem: null,
            selectedWorkflowRuleList: []
        };
    } else {

        let ruleList = state.workflowRuleList;
        const newRuleList: WorkflowRuleListData[] = payload.importedData;

        let max_RuleID = state.maxRuleID ? state.maxRuleID : null;
        let max_Position = state.maxPosition;
        let max_RowOrder = state.maxRowOrder;

        newRuleList.forEach((row) => {
            max_RuleID = max_RuleID ? max_RuleID + 1 : null;
            max_Position = max_Position + 1;
            max_RowOrder = max_RowOrder + 1;

            row.wfR_ID = max_RuleID ? max_RuleID : 0;
            row.wfR_Position = max_Position;
            row.rowOrder = max_RowOrder;
            row.operatorText = getOperatorText(row.wfR_Operator);
            row.actionText = getActionText(row.wfR_Action);
            ruleList = ruleList.concat(row);

        });

        return {
            ...state,
            loading: false,
            isDirty: true,
            workflowRuleList: ruleList,
            maxRuleID: max_RuleID,
            maxRowOrder: max_RowOrder,
            maxPosition: max_Position,
            recentlySelectedItem: null,
            selectedWorkflowRuleList: []
        };
        // +

        // maxRuleID: state.maxRuleID ? state.maxRuleID + 1 : null,
        // maxPosition: state.maxPosition + 1,
        // maxRowOrder: state.maxRowOrder + 1,
        // isDirty: true,
        // workflowRuleList: state.workflowRuleList.concat([CreateRowItem(state)]),
        // selectedWorkflowRuleList: selectedItems.concat([CreateRowItem(state)]),
        // recentlySelectedItem: CreateRowItem(state)
    }
}

function getImportWorkFlowRuleFail(state: WorkflowRuleState) {
    return {
        ...state,
        loading: false
    };
}



function saveData(state: WorkflowRuleState) {
    return {
        ...state,
        loading: true
    };
}

function saveDataSuccess(state: WorkflowRuleState, payload) {
    const newRuleList = updateEntireRuleListProperties(payload.workflowRuleList.data);
    return {
        ...state,
        loading: false,
        isSaveApply: true,
        isDirty: false,
        workflowRuleList: newRuleList,
        maxRuleID: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_ID').wfR_ID : null,
        maxRowOrder: newRuleList.length > 0 ? _.maxBy(newRuleList, 'rowOrder').rowOrder : 0,
        maxPosition: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_Position').wfR_Position : 0,
    };
}

function saveDataFail(state: WorkflowRuleState) {
    return {
        ...state,
        loading: false
    };
}

function addNewWorkFlowRule(state: WorkflowRuleState) {
    return {
        ...state
    };
}


function deleteWorkflowRule(state: WorkflowRuleState) {

    let itemList = state.workflowRuleList;

    state.selectedWorkflowRuleList.map((row) => {
        const ind = itemList.findIndex((item) => item.rowOrder === row.rowOrder);
        itemList.splice(ind, 1);
    });



    itemList = itemList.map((ruleRow, index) => {
        return Object.freeze({
            ...ruleRow,
            rowOrder: index + 1,
            wfR_Position: index + 1
        });
    });

    return {
        ...state,
        isDirty: true,
        workflowRuleList: itemList,
        recentlySelectedItem: null,
        selectedWorkflowRuleList: []
    };
}

function workflowRuleUp(state: WorkflowRuleState) {
    return {
        ...state
    };
}

function workflowRuleDown(state: WorkflowRuleState) {
    return {
        ...state
    };
}

function workflowRuleUpDown(state: WorkflowRuleState, payload) {

    let updatedItems: WorkflowRuleListData[];
    let newSelectedItemOrder: number;

    if (payload.isUp) {
        const preItem: WorkflowRuleListData = state.workflowRuleList.find((row) =>
            row.rowOrder === payload.selectedItemList.rowOrder - 1);
        newSelectedItemOrder = payload.selectedItemList.rowOrder - 1;

        updatedItems = state.workflowRuleList.map((ruleRow) => {
            if (ruleRow.rowOrder === payload.selectedItemList.rowOrder) {
                return Object.freeze({
                    ...ruleRow, wfR_Position: preItem.wfR_Position,
                    rowOrder: preItem.rowOrder
                });
            } else {
                if (ruleRow.rowOrder === payload.selectedItemList.rowOrder - 1) {

                    return Object.freeze({
                        ...ruleRow, wfR_Position: payload.selectedItemList.wfR_Position,
                        rowOrder: payload.selectedItemList.rowOrder
                    });
                }
                return ruleRow;
            }
        });
    } else {

        const postItem: WorkflowRuleListData = state.workflowRuleList.find((row) =>
            row.rowOrder === payload.selectedItemList.rowOrder + 1);
        newSelectedItemOrder = payload.selectedItemList.rowOrder + 1;

        updatedItems = state.workflowRuleList.map((ruleRow) => {
            if (ruleRow.rowOrder === payload.selectedItemList.rowOrder) {
                return Object.freeze({
                    ...ruleRow, wfR_Position: postItem.wfR_Position,
                    rowOrder: postItem.rowOrder
                });
            } else {
                if (ruleRow.rowOrder === payload.selectedItemList.rowOrder + 1) {

                    return Object.freeze({
                        ...ruleRow, wfR_Position: payload.selectedItemList.wfR_Position,
                        rowOrder: payload.selectedItemList.rowOrder
                    });
                }
                return ruleRow;
            }
        });

    }

    let tempList: WorkflowRuleListData[] = [];
    tempList = tempList.concat(updatedItems.find((row) => row.rowOrder === newSelectedItemOrder));
    return {
        ...state, workflowRuleList: updatedItems.sort(compare),
        recentlySelectedItem: tempList,
        selectedWorkflowRuleList: tempList,
        isDirty: true
    };
}

function compare(a, b) {
    if (a.rowOrder < b.rowOrder) {
        return -1;
    }
    if (a.rowOrder > b.rowOrder) {
        return 1;
    }
    return 0;
}

function selectWFRuleItem(state: WorkflowRuleState, selectedItemData: WorkflowRuleSelectedItemData) {
    // desabled other rows ctrl visibility
    // const updatedItems = state.workflowRuleList.map((ruleRow) => {
    //     if (ruleRow.rowOrder === selectedItemData.item.rowOrder) {
    //         return Object.freeze({ ...ruleRow });
    //     } else {
    //         return Object.freeze({ ...ruleRow, isOperatorShow: false, isActionShow: false });
    //     }
    // });
    const updatedItems = state.workflowRuleList;

    if (selectedItemData.isWithCtrlKey) {
        return {
            ...state, selectedWorkflowRuleList: controlKeyOperation(state.selectedWorkflowRuleList, selectedItemData)
            , recentlySelectedItem: selectedItemData.item
        };
    } else if (selectedItemData.isWithShiftKey) {
        return {
            ...state, selectedWorkflowRuleList: shiftKeyOperation(state, updatedItems, selectedItemData)
            , recentlySelectedItem: state.recentlySelectedItem ? state.recentlySelectedItem : selectedItemData.item
        };
    } else {
        return {
            ...state, selectedWorkflowRuleList: mouseClickOperation(state.selectedWorkflowRuleList, updatedItems, selectedItemData)
            , recentlySelectedItem: selectedItemData.item
        };
    }
}

function controlKeyOperation(selectedItems: WorkflowRuleListData[], selectedItem: WorkflowRuleSelectedItemData) {
    const alreadySelected = selectedItems && selectedItems.length > 0 ?
        selectedItems.find((row) => row.rowOrder === selectedItem.item.rowOrder) : null;
    // Invert selection
    // return updatedItems.map((ruleRow) => {
    //     if (ruleRow.rowOrder === selectedItem.item.rowOrder) {
    //         return { ...ruleRow, isRowSelected: !ruleRow.isRowSelected };
    //     }
    //     return ruleRow;
    // });
    if (alreadySelected) {
        return selectedItems.filter((row) => row.rowOrder !== selectedItem.item.rowOrder);
    } else {
        return selectedItems.concat(selectedItem.item);
    }
}

function shiftKeyOperation(state: WorkflowRuleState, updatedItems: WorkflowRuleListData[], selectedItem: WorkflowRuleSelectedItemData) {

    let indexRecentlySelectedItem: number;
    let indexSelectedItem: number;

    // If there is no any recently selected item, consider the first item of the work flow rule data model as the first item.
    // state.recentlySelectedItem : state.recentlySelectedItem ? state.recentlySelectedItem : state.workflowRuleList[0];
    indexRecentlySelectedItem = state.recentlySelectedItem ?
        state.recentlySelectedItem.rowOrder : state.workflowRuleList[0].rowOrder;
    // indexSelectedItem = state.workflowRuleList.indexOf(selectedItem.item);
    indexSelectedItem = selectedItem.item.rowOrder;

    if (indexRecentlySelectedItem === indexSelectedItem) {
        // return updatedItems.map((ruleRow) => {
        //     if (ruleRow.rowOrder === selectedItem.item.rowOrder) {
        //        // return Object.freeze({ ...ruleRow, selectedWorkflowRuleList: state.selectedWorkflowRuleList.concat(ruleRow) });
        //        return ruleRow;
        //     }
        //     return ruleRow;
        // });
        //  no any change
        // return state.selectedWorkflowRuleList;
        return updatedItems.filter((row) => row.rowOrder === indexSelectedItem);
    } else if (indexRecentlySelectedItem < indexSelectedItem) {
        let selectedItems: WorkflowRuleListData[] = [];


        updatedItems.forEach((ruleRow) => {
            if (ruleRow.rowOrder >= indexRecentlySelectedItem && ruleRow.rowOrder <= indexSelectedItem) {
                // return Object.freeze({ ...ruleRow, isRowSelected: true });
                selectedItems = selectedItems.concat(ruleRow);
            }
            // else {
            //     return Object.freeze({ ...ruleRow, isRowSelected: false });
            // }
        });

        return selectedItems;
    } else {
        let selectedItems: WorkflowRuleListData[] = [];
        updatedItems.forEach((ruleRow) => {
            if (ruleRow.rowOrder >= indexSelectedItem && ruleRow.rowOrder <= indexRecentlySelectedItem) {
                // return Object.freeze({ ...ruleRow, isRowSelected: true });
                selectedItems = selectedItems.concat(ruleRow);
            }
            // else {
            //     return Object.freeze({ ...ruleRow, isRowSelected: false });
            // }
        });
        return selectedItems;
    }
}

function mouseClickOperation(selectedItems: WorkflowRuleListData[], updatedItems: WorkflowRuleListData[],
    selectedItem: WorkflowRuleSelectedItemData) {
    // Invert selection
    // return updatedItems.map((ruleRow) => {
    //     if (ruleRow.rowOrder === selectedItem.item.rowOrder) {
    //         return { ...ruleRow, isRowSelected: true };
    //     } else if (ruleRow.isRowSelected) {
    //         return { ...ruleRow, isRowSelected: false };
    //     }
    //     return ruleRow;
    // });
    // if (selectedItems && selectedItems.length === 1 && selectedItems[0].rowOrder === selectedItem.item.rowOrder) {
    //     return selectedItems;
    // }
    selectedItems = [];
    return selectedItems.concat(selectedItem.item);

}


function updateEntireRuleListProperties(ruleList: WorkflowRuleListData[]) {
    return ruleList.map((ruleRow, index) => {
        return Object.freeze({
            ...ruleRow,
            operatorText: getOperatorText(ruleRow.wfR_Operator),
            actionText: getActionText(ruleRow.wfR_Action),
            isRowSelected: ruleRow.rowOrder === 1 ? true : false,
            isOperatorShow: false,
            isDirty: false,
            isActionShow: false,
            rowOrder: index + 1
        });
    });
}

function AddNewWFRuleSuccess(state: WorkflowRuleState) {
    const selectedItems: WorkflowRuleListData[] = [];
    return {
        ...state,
        maxRuleID: state.maxRuleID ? state.maxRuleID + 1 : null,
        maxPosition: state.maxPosition + 1,
        maxRowOrder: state.maxRowOrder + 1,
        isDirty: true,
        workflowRuleList: state.workflowRuleList.concat([CreateRowItem(state)]),
        selectedWorkflowRuleList: selectedItems.concat([CreateRowItem(state)]),
        recentlySelectedItem: CreateRowItem(state)
    };
}

function CreateRowItem(state: WorkflowRuleState) {
    if (state.appId) {
        const newMenuItemData: WorkflowRuleListData = {
            wfR_ID: state.maxRuleID ? state.maxRuleID + 1 : 0,
            wfR_AppID: state.appId,
            wfR_Position: state.maxPosition + 1,
            wfR_Test: '',
            wfR_Operator: 'EQ',
            wfR_Control: '',
            wfR_Action: 0,
            wfR_Command: '',
            wfR_Description: '',
            wfR_CommandNodeID: null,
            operatorText: 'EqualTo',
            actionText: 'Hide Item',
            itemText: '',
            rowOrder: state.maxRowOrder + 1,
            isRowSelected: true,
            isDirty: true,
            isOperatorShow: false,
            isActionShow: false,
            isItemShow: false,
        };

        return newMenuItemData;
    } else {
        return null;
    }
}

// function updateSingleRowSelected(ruleList: WorkflowRuleListData[], rule: WorkflowRuleListData) {

//     return ruleList.map((ruleRow) => {
//         if (ruleRow === rule) {
//             return Object.freeze({ ...ruleRow, isRowSelected: true });
//         } else {
//             return Object.freeze({ ...ruleRow, isRowSelected: false });
//         }
//     });
// }

// function updateMultipleRowSelected(ruleList: WorkflowRuleListData[], rules: WorkflowRuleListData[]) {

//     return ruleList.map((ruleRow) => {
//         rules.map((rule) => {
//             if (ruleRow === rule) {
//                 return Object.freeze({ ...ruleRow, isRowSelected: true });
//             } else {
//                 return Object.freeze({ ...ruleRow });
//             }
//         });

//     });
// }

function updateOperatorShow(ruleList: WorkflowRuleListData[], rule: WorkflowRuleListData) {

    return ruleList.map((ruleRow) => {
        if (ruleRow === rule) {
            return Object.freeze({ ...ruleRow, isOperatorShow: !ruleRow.isOperatorShow });
        } else {
            return Object.freeze({ ...ruleRow });
        }
    });
}

function setChangeOperator(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, ruleOperator: RuleOperator) {

    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({ ...ruleRow, wfR_Operator: ruleOperator, operatorText: getOperatorText(ruleOperator), isDirty: true });
        }
        return ruleRow;
    });

    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}


function setChangeAction(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, action: number) {

    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({ ...ruleRow, wfR_Action: action, actionText: getActionText(action), isDirty: true });
        }
        return ruleRow;
    });

    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}

function setChangeTestVarNo(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Test: string) {

    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({ ...ruleRow, wfR_Test: wfR_Test, isDirty: true });
        }
        return ruleRow;
    });

    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}

function setChangeCriteria(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Control: string) {

    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({ ...ruleRow, wfR_Control: wfR_Control, isDirty: true });
        }
        return ruleRow;
    });

    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}

function setChangeItem(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Command: string) {

    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({ ...ruleRow, wfR_Command: wfR_Command, isDirty: true });
        }
        return ruleRow;
    });

    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}

function setSelectItem(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, payload) {
    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({
                ...ruleRow,
                wfR_Command: payload.wfR_Command,
                wfR_Description: payload.wfR_Description,
                wfR_CommandNodeID: payload.wfR_CommandNodeID,
                isDirty: true
            });
        }
        return ruleRow;
    });
    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}

function setChangeDescription(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Description: string) {

    const updatedItemList = state.workflowRuleList.map((ruleRow) => {
        if (ruleRow.rowOrder === selectedItem.rowOrder) {
            return Object.freeze({ ...ruleRow, wfR_Description: wfR_Description, isDirty: true });
        }
        return ruleRow;
    });

    return {
        ...state,
        workflowRuleList: updatedItemList,
        isDirty: true
    };
}


function getOperatorText(ruleOperator) {
    switch (ruleOperator) {
        case RuleOperator.EQ:
            return 'EqualTo';
        case RuleOperator.NE:
            return 'NotEqualTo';
        case RuleOperator.GT:
            return 'GreaterThan';
        case RuleOperator.GE:
            return 'GreaterThanOrEqualTo';
        case RuleOperator.LT:
            return 'LessThan';
        case RuleOperator.LE:
            return 'LessThanOrEqualTo';
        case RuleOperator.IN:
            return 'Contains';
        default:
            return 'unknown';
    }
}

function getActionText(actionOperator: number) {
    switch (actionOperator) {
        case 0:
            return 'Hide Item';
        case 1:
            return 'Enable Item';
        case 2:
            return 'Disable Item';
        default:
            return 'unknown';
    }
}

function updateActionShow(ruleList: WorkflowRuleListData[], rule: WorkflowRuleListData) {

    return ruleList.map((ruleRow) => {
        if (ruleRow === rule) {
            return Object.freeze({ ...ruleRow, isActionShow: !ruleRow.isActionShow });
        } else {
            return Object.freeze({ ...ruleRow });
        }
    });
}

function changeAction(rule: WorkflowRuleListData, ruleAction: number) {
    return Object.freeze({ ...rule, wfR_Action: ruleAction, actionText: getActionText(ruleAction), isDirty: true });
}

export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);

export const getAppIdByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.appId : null);

export const getFileIdByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.fileId : null);

export const getMatterDataByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.matterData : null);

export const getBranchIdByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.branchId : null);

export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.loading : false);
export const getIsDirtyByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.isDirty : false);

export const getRuleListByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.workflowRuleList : null);

export const getIsSaveApplyByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.isSaveApply : false);


export const getSelectedRuleListByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.selectedWorkflowRuleList : null);

export const getExportedDataByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
    workflowRuleState ? workflowRuleState.exportedData : null);

