import { forEach } from '@angular/router/src/utils/collection';

import { LookupList, SelectedLookupViewModel } from '../../core/lib/screen-edit';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import { LookupViewModel } from '../../core';
import { UpdateCol } from '../models/interfaces';
import { DeleteScreenLookupSuccess } from '../actions/core';


export interface State {
    readonly [token: string]: ScreenLookupState;
}

export interface ScreenLookupState {
    readonly loading: boolean;
    readonly isDirty: boolean;
    readonly newRowId: number;
    readonly screenLookupList: LookupViewModel;
    readonly prevscreenLookupList: LookupViewModel;
    readonly selectedLookupViewModel: SelectedLookupViewModel;
    readonly selectedscreenLookupList: LookupList[];
    // readonly recentlySelectedItem: WorkflowRuleListData;
    readonly lookupTypeTag: string;

}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.INIT_SCREEN_LOOKUP:
            temp[action.token] = getInitViewData(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.INIT_SCREEN_LOOKUP_SUCCESS:
            temp[action.token] = getInitViewDataSuccess(state[action.token], action.payload.screenLookupList);
            return { ...state, ...temp };
        case Actions.INIT_SCREEN_LOOKUP_FAIL:
            temp[action.token] = getInitViewDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_LOOKUP:
            temp[action.token] = saveData(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_LOOKUP_SUCCESS:
            temp[action.token] = saveDataSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.SAVE_LOOKUP_FAIL:
            temp[action.token] = saveDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_LOOKUP_ITEM:
            temp[action.token] = setChangeLookupItems(state[action.token],
                action.payload.rowId, action.payload.changeValue, action.payload.changeCol);
            return { ...state, ...temp };
        case Actions.ADD_NEW_LOOKUP_SUCCESS:
            temp[action.token] = AddNewLookupSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.DELETE_SCREEN_LOOKUP:
            temp[action.token] = deleteScreenLookup(state[action.token], action.payload.lookupId);
            return { ...state, ...temp };
        case Actions.UPDATE_DESCRIPTION:
            temp[action.token] = updateDescription(state[action.token], action.payload.lookupTypeDescription);
            return { ...state, ...temp };
        case Actions.CANCEL_CHANGES:
            temp[action.token] = cancelChanges(state[action.token]);
            return { ...state, ...temp };
        // case Actions.DELETE_SCREEN_LOOKUP_SUCCESS:
        //     temp[action.token] = deleteScreenLookupSucces(state[action.token], action.payload.lookupId);
        //     return { ...state, ...temp };
        case Actions.DELETE_SCREEN_LOOKUP_FAIL:
            temp[action.token] = deleteScreenLookupFail(state[action.token], action.payload.lookupId);
            return { ...state, ...temp };
        case Actions.EXIT_CLIENT_LOOKUP_POPUP:
            temp[action.token] = null;
            return { ...state, ...temp };

        default:
            {
                return state;
            }
    }
}

function getInitViewData(state: ScreenLookupState, inputData) {
    return {
        ...state,
        init: true,
        // isDirty: false,
        loading: true,
        // isSaveApply: false,
        lookupTypeTag: inputData.lookupTypeTag,
        newRowId: -1
        //  fileId: inputData.fileId,
        // branchId: inputData.branchId,
        //  matterData: inputData,
        // recentlySelectedItem: null,
        //   selectedWorkflowRuleList: []
    };
}

function getInitViewDataSuccess(state: ScreenLookupState, responce: LookupViewModel) {

    // const newRuleList = updateEntireRuleListProperties(payload.workflowRuleList.data);
    return {
        ...state,
        loading: false,
        screenLookupList: responce,
        prevscreenLookupList: responce,
        //   maxRuleID: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_ID').wfR_ID : null,
        //   maxRowOrder: newRuleList.length > 0 ? _.maxBy(newRuleList, 'rowOrder').rowOrder : 0,
        //  maxPosition: newRuleList.length > 0 ? _.maxBy(newRuleList, 'wfR_Position').wfR_Position : 0,
    };
}

function getInitViewDataFail(state: ScreenLookupState) {
    return {
        ...state,
        loading: false,
        workflowRuleList: []
    };
}


function saveData(state: ScreenLookupState) {
    return {
        ...state,
        loading: true
    };
}

function saveDataSuccess(state: ScreenLookupState, payload) {
    // const newRuleList = updateEntireRuleListProperties(payload.workflowRuleList.data);
    return {
        ...state,
        loading: false,
        isSaveApply: true,
        isDirty: false,
        screenLookupList: state.screenLookupList,

    };
}

function saveDataFail(state: ScreenLookupState) {
    return {
        ...state,
        loading: false
    };
}
function cancelChanges(state: ScreenLookupState) {
    return {
        ...state,

        screenLookupList: state.prevscreenLookupList,

    };
}

function deleteScreenLookup(state: ScreenLookupState, lookupId: number) {
    return {
        ...state,
        screenLookupList: {
            ...state.screenLookupList,
            lookupViewModels: state.screenLookupList.lookupViewModels.map(val => {
                if (val.luP_ID === lookupId) {
                    return Object.freeze({
                        ...val, isDelete: true,
                    });
                } else {
                    return val;
                }
            }
            )
        }
    };
}

function deleteScreenLookupFail(state: ScreenLookupState, lookupId: number) {
    return {
        ...state,
        screenLookupList: {
            ...state.screenLookupList,
            lookupViewModels: state.screenLookupList.lookupViewModels.map(val => {
                if (val.luP_ID === lookupId) {
                    return Object.freeze({
                        ...val,
                        isDelete: false,
                    });
                } else {
                    return val;
                }
            })
        }
    };

}


function updateDescription(state: ScreenLookupState, lookupTypeDescription: string) {
    // return {
    //     ...state,
    //     luT_Description: lookupTypeDescription,
    return {
        ...state,
        screenLookupList: {
            ...state.screenLookupList,
            luT_Description: lookupTypeDescription,

        }
    };
}


function AddNewLookupSuccess(state: ScreenLookupState) {
    //  const selectedItems: WorkflowRuleListData[] = [];
    return {
        ...state,
        //  maxRuleID: state.maxRuleID ? state.maxRuleID + 1 : null,
        //  maxPosition: state.maxPosition + 1,
        //  maxRowOrder: state.maxRowOrder + 1,
        isDirty: true,
        // ...state.screenLookupList
        // lookupViewModels: {
        //     lookupViewModels: state.screenLookupList.lookupViewModels
        //         .concat(CreateRowItem(state.screenLookupList.lookupViewModels, state.newRowId)),
        // },
        newRowId: state.newRowId - 1,
        screenLookupList: {
            ...state.screenLookupList,
            lookupViewModels: state.screenLookupList.lookupViewModels
                .concat(CreateRowItem(state.screenLookupList.luT_ID, state.newRowId))

        }
        // selectedWorkflowRuleList: selectedItems.concat([CreateRowItem(state)]),
        // recentlySelectedItem: CreateRowItem(state)
    };
}

function CreateRowItem(luT_ID: number, newRowId) {

    return {
        luP_Code: '',
        luP_Description: '',
        luP_Hidden: false,
        luP_ID: newRowId,
        luP_LUTID: luT_ID,
        luP_LookupID: 0,
        luP_VariantValue: '',
        lookupType_LUT_ID: 0
    };


    // if (state.appId) {

}







function setChangeLookupItems(state: ScreenLookupState, rowId, changeValue, changeCol: UpdateCol) {
    return {
        ...state,
        screenLookupList: {
            ...state.screenLookupList,
            lookupViewModels: state.screenLookupList.lookupViewModels.map(val => {
                if (val.luP_ID === rowId) {
                    return Object.freeze({
                        ...val,
                        isDirty: true,
                        luP_Code: UpdateCol.DISPLAYNAME === changeCol ? changeValue : val.luP_Code,
                        luP_Description: UpdateCol.DESCRIPTION === changeCol ? changeValue : val.luP_Description,
                        luP_Hidden: UpdateCol.HIDE === changeCol ? changeValue : val.luP_Hidden,
                    });
                } else {
                    return val;
                }
            })
        }

    };


    // const updatedItemList = state.workflowRuleList.map((ruleRow) => {
    //     if (ruleRow.rowOrder === selectedItem.rowOrder) {
    //         return Object.freeze({ ...ruleRow, wfR_Operator: ruleOperator, operatorText: getOperatorText(ruleOperator), isDirty: true });
    //     }
    //     return ruleRow;
    // });

    // return {
    //     ...state,
    //     workflowRuleList: updatedItemList,
    //     isDirty: true
    // };
}
// function getActionText(changeCol: UpdateCol) {
//     switch (changeCol) {
//         case UpdateCol.DISPLAYNAME:
//             return ;
//         case UpdateCol.DESCRIPTION:
//             return 'Enable Item';
//         case UpdateCol.HIDE:
//             return 'Disable Item';
//         default:
//             return 'unknown';
//     }
// }


// function setChangeAction(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, action: number) {

//     const updatedItemList = state.workflowRuleList.map((ruleRow) => {
//         if (ruleRow.rowOrder === selectedItem.rowOrder) {
//             return Object.freeze({ ...ruleRow, wfR_Action: action, actionText: getActionText(action), isDirty: true });
//         }
//         return ruleRow;
//     });

//     return {
//         ...state,
//         workflowRuleList: updatedItemList,
//         isDirty: true
//     };
// }

// function setChangeTestVarNo(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Test: string) {

//     const updatedItemList = state.workflowRuleList.map((ruleRow) => {
//         if (ruleRow.rowOrder === selectedItem.rowOrder) {
//             return Object.freeze({ ...ruleRow, wfR_Test: wfR_Test, isDirty: true });
//         }
//         return ruleRow;
//     });

//     return {
//         ...state,
//         workflowRuleList: updatedItemList,
//         isDirty: true
//     };
// }

// function setChangeCriteria(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Control: string) {

//     const updatedItemList = state.workflowRuleList.map((ruleRow) => {
//         if (ruleRow.rowOrder === selectedItem.rowOrder) {
//             return Object.freeze({ ...ruleRow, wfR_Control: wfR_Control, isDirty: true });
//         }
//         return ruleRow;
//     });

//     return {
//         ...state,
//         workflowRuleList: updatedItemList,
//         isDirty: true
//     };
// }

// function setChangeItem(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Command: string) {

//     const updatedItemList = state.workflowRuleList.map((ruleRow) => {
//         if (ruleRow.rowOrder === selectedItem.rowOrder) {
//             return Object.freeze({ ...ruleRow, wfR_Command: wfR_Command, isDirty: true });
//         }
//         return ruleRow;
//     });

//     return {
//         ...state,
//         workflowRuleList: updatedItemList,
//         isDirty: true
//     };
// }

// function setSelectItem(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, payload) {
//     const updatedItemList = state.workflowRuleList.map((ruleRow) => {
//         if (ruleRow.rowOrder === selectedItem.rowOrder) {
//             return Object.freeze({
//                 ...ruleRow,
//                 wfR_Command: payload.wfR_Command,
//                 wfR_Description: payload.wfR_Description,
//                 wfR_CommandNodeID: payload.wfR_CommandNodeID,
//                 isDirty: true
//             });
//         }
//         return ruleRow;
//     });
//     return {
//         ...state,
//         workflowRuleList: updatedItemList,
//         isDirty: true
//     };
// }

// function setChangeDescription(state: WorkflowRuleState, selectedItem: WorkflowRuleListData, wfR_Description: string) {

//     const updatedItemList = state.workflowRuleList.map((ruleRow) => {
//         if (ruleRow.rowOrder === selectedItem.rowOrder) {
//             return Object.freeze({ ...ruleRow, wfR_Description: wfR_Description, isDirty: true });
//         }
//         return ruleRow;
//     });

//     return {
//         ...state,
//         workflowRuleList: updatedItemList,
//         isDirty: true
//     };
// }


// function getOperatorText(ruleOperator) {
//     switch (ruleOperator) {
//         case RuleOperator.EQ:
//             return 'EqualTo';
//         case RuleOperator.NE:
//             return 'NotEqualTo';
//         case RuleOperator.GT:
//             return 'GreaterThan';
//         case RuleOperator.GE:
//             return 'GreaterThanOrEqualTo';
//         case RuleOperator.LT:
//             return 'LessThan';
//         case RuleOperator.LE:
//             return 'LessThanOrEqualTo';
//         case RuleOperator.IN:
//             return 'Contains';
//         default:
//             return 'unknown';
//     }
// }



// function updateActionShow(ruleList: WorkflowRuleListData[], rule: WorkflowRuleListData) {

//     return ruleList.map((ruleRow) => {
//         if (ruleRow === rule) {
//             return Object.freeze({ ...ruleRow, isActionShow: !ruleRow.isActionShow });
//         } else {
//             return Object.freeze({ ...ruleRow });
//         }
//     });
// }

// function changeAction(rule: WorkflowRuleListData, ruleAction: number) {
//     return Object.freeze({ ...rule, wfR_Action: ruleAction, actionText: getActionText(ruleAction), isDirty: true });
// }

export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);

export const getScreenLookupTypeTagByToken = (token) => createSelector(getViewByToken(token), (screenLookupState) =>
    screenLookupState ? screenLookupState.lookupTypeTag : null);

export const getScreenLookupListByToken = (token) => createSelector(getViewByToken(token), (screenLookupState) => {
    // return screenLookupState ? screenLookupState.screenLookupList : null;
    if (screenLookupState && screenLookupState.screenLookupList) {

        const newList = screenLookupState.screenLookupList.lookupViewModels.filter(f => f.isDelete !== true);
        const post: LookupViewModel = {
            luT_Description: screenLookupState.screenLookupList.luT_Description,
            luT_ID: screenLookupState.screenLookupList.luT_ID,
            luT_Type: screenLookupState.screenLookupList.luT_Type,
            luT_VariantLabel: screenLookupState.screenLookupList.luT_VariantLabel,
            lookupViewModels: newList
        };
        return post;

    } else {
        return null;
    }





    // return screenLookupState ? screenLookupState.screenLookupList : null;
});

export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token), (screenLookupState) =>
    screenLookupState ? screenLookupState.loading : false);

export const getDirtyListByToke = (token) => createSelector(getViewByToken(token), (screenLookupState) => {
    if (screenLookupState) {
        // ...screenLookupState
        const newList = screenLookupState.screenLookupList.lookupViewModels.filter(f => f.isDirty).map(r => {
            // if (r.isDirty) {
            if (r.luP_ID < 0) {
                return Object.freeze({ ...r, luP_ID: -1 });
            } else {
                return r;
            }
            // }
        });
        const post: LookupViewModel = {
            luT_Description: screenLookupState.screenLookupList.luT_Description,
            luT_ID: screenLookupState.screenLookupList.luT_ID,
            luT_Type: screenLookupState.screenLookupList.luT_Type,
            luT_VariantLabel: screenLookupState.screenLookupList.luT_VariantLabel,
            lookupViewModels: newList.filter(r => r.luP_Code !== null)
        };
        return post;

    } else {
        return null;
    }
}
);

// export const getFileIdByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.fileId : null);

// export const getMatterDataByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.matterData : null);

// export const getBranchIdByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.branchId : null);


// export const getIsDirtyByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.isDirty : false);



// export const getIsSaveApplyByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.isSaveApply : false);


// export const getSelectedRuleListByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.selectedWorkflowRuleList : null);

// export const getExportedDataByToken = (token) => createSelector(getViewByToken(token), (workflowRuleState) =>
//     workflowRuleState ? workflowRuleState.exportedData : null);

