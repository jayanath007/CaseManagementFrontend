
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import { NarrativeGroup, NarrativesInfo, NarrativeItem, NarrativeDataModel } from '../models/interfaces';
import { ViewChangeKind } from '../models/enums';

export interface State {
    readonly [token: string]: BillingNarrativeState;
}

export interface BillingNarrativeState {
    readonly init: boolean;
    readonly loading: boolean;
    // readonly narrativeGroups: NarrativeGroup[];
    readonly narrativeGroupItem: NarrativeItem[];
    readonly narrativeInfo: NarrativesInfo;

    readonly narrativeDataModel: NarrativeDataModel[];


}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_BILLING_NARRATIVE:
            temp[action.token] = getInitViewData(state[action.token], action.payload.inputData);
            return { ...state, ...temp }; // F{ ...updateActiveState(state), ...temp };
        case Actions.GET_NARRATIVE_GROUPS_SUCCESS:
            temp[action.token] = getNarrativeGroups(state[action.token], action.payload.narrativeData);
            return { ...state, ...temp };
        // case Actions.GET_NARRATIVE_ITEMS_SUCCESS:
        //     temp[action.token] = getNarrativeGroupItems(state[action.token], action.payload);
        //     return { ...state, ...temp };
        case Actions.VIEW_CHANGE:
            temp[action.token] = viewChange(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE:
            temp[action.token] = saveNarrtiveInfo(state[action.token]);
            return { ...state, ...temp };
        case Actions.BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS:
            temp[action.token] = saveNarrtiveInfoSuccess(state[action.token], action.response.data);
            return { ...state, ...temp };

        case Actions.SELECT_NARRATIVE_GROUP:
            temp[action.token] = selectNarrativeGroup(state[action.token], action.narrativeGroup);
            return { ...state, ...temp };
        case Actions.SELECT_NARRATIVE_GROUP_ITEM:
            temp[action.token] = selectNarrativeGroupItem(state[action.token], action.narrativeItem);
            return { ...state, ...temp };
        case Actions.DELETE_SELECTED_NARRATIVE_ITEM:
            temp[action.token] = deleteNarrative(state[action.token]);
            return { ...state, ...temp };
        case Actions.DELETE_SELECTED_NARRATIVE_ITEMS_SUCCESS:
            temp[action.token] = deleteNarrativeSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.DELETE_SELECTED_NARRATIVE_ITEMS_FAIL:
            temp[action.token] = deleteNarrativeFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.DELETE_SELECTED_GROUP:
            temp[action.token] = deleteGroup(state[action.token]);
            return { ...state, ...temp };
        case Actions.DELETE_SELECTED_GROUP_SUCCESS:
            temp[action.token] = getNarrativeGroups(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.DELETE_SELECTED_GROUP_FAIL:
            temp[action.token] = deleteGroupFail(state[action.token]);
            return { ...state, ...temp };


        default:
            { return state; }
    }
}
function getInitViewData(state: BillingNarrativeState, inputData: any): Partial<BillingNarrativeState> {
    let matterDetails: any;
    if (inputData && inputData.matterData && inputData.matterData.data) {
        matterDetails = inputData.matterData.data;
    }
    // if (!state) {
    return {
        ...state,
        init: true,
        loading: true,
        narrativeGroupItem: [],
        narrativeDataModel: [],
        narrativeInfo: {
            narrativeGroupId: 0,
            narrativeGroupDescription: null,
            narrativeItemId: 0,
            narrativeItemGroupId: 0,
            narrativeItemDescription: null,
            narrativeItemText: null,
        }


    };

}

function getNarrativeGroups(state: BillingNarrativeState, narrativeGroups: NarrativeDataModel[]): Partial<BillingNarrativeState> {
    // const newList = Object.freeze(narrativeGroups.map((a) => {
    //     if(a.narrativeGroupId){
    //     }
    //     return a.selected === true;
    // }));
    const selectGroup = narrativeGroups[0] ? narrativeGroups[0] : null;
    let selectNarativeItem = null;
    if (!selectGroup) {
        return {
            ...state,
            loading: false
        };
    } else if (selectGroup.narrativeItems && selectGroup.narrativeItems.length > 0) {
        selectNarativeItem = selectGroup.narrativeItems[selectGroup.narrativeItems.length - 1];
    }
    return {
        ...state,
        loading: false,
        narrativeDataModel: narrativeGroups,
        narrativeGroupItem: selectGroup.narrativeItems,
        narrativeInfo: {
            ...state.narrativeInfo,
            narrativeGroupId: selectGroup.narrativeGroupId,
            narrativeGroupDescription: selectGroup.narrativeGroupName,

            narrativeItemId: selectNarativeItem ? selectNarativeItem.narrativeItemId : 0,
            narrativeItemGroupId: selectGroup.narrativeGroupId,
            narrativeItemDescription: selectNarativeItem ? selectNarativeItem.narrativeItemDescription : null,
            narrativeItemText: selectNarativeItem ? selectNarativeItem.narrativeItemText : null,

        }

    };
}

function saveNarrtiveInfo(state: BillingNarrativeState): Partial<BillingNarrativeState> {
    return {
        ...state,
        loading: true,
    };
}

function deleteNarrative(state: BillingNarrativeState): Partial<BillingNarrativeState> {
    return {
        ...state,
        loading: true,
    };
}

function deleteNarrativeFail(state: BillingNarrativeState): Partial<BillingNarrativeState> {
    return {
        ...state,
        loading: false,
    };
}


function deleteNarrativeSuccess(state: BillingNarrativeState, responceItem: NarrativeItem[]): Partial<BillingNarrativeState> {
    let narativeItem = null;
    let narrativeModel = null;
    let narrativeInfo = null;
    if (responceItem && responceItem.length > 0) {

        narativeItem = responceItem;
        narrativeModel = state.narrativeDataModel.map(i => {
            if (i.narrativeGroupId === narativeItem.narrativeGroupId) {
                return { ...i, narrativeItems: narativeItem };
            } else {
                return i;
            }
        });
        narrativeInfo = {
            ...state.narrativeInfo,
            narrativeItemId: narativeItem[narativeItem.length - 1].narrativeItemId,
            narrativeItemGroupId: narativeItem[narativeItem.length - 1].narrativeGroupId,
            narrativeItemDescription: narativeItem[narativeItem.length - 1].narrativeItemDescription,
            narrativeItemText: narativeItem[narativeItem.length - 1].narrativeItemText,

        };

    } else {
        narativeItem = [];
        narrativeModel = state.narrativeDataModel.map(i => {
            if (i.narrativeGroupId === state.narrativeInfo.narrativeGroupId) {
                return { ...i, narrativeItems: [] };
            } else {
                return i;
            }
        });
        narrativeInfo = {
            ...state.narrativeInfo,
            narrativeItemId: 0,
            narrativeItemDescription: null,
            narrativeItemText: null,

        };

    }

    return {
        ...state,
        loading: false,
        narrativeGroupItem: narativeItem ? narativeItem : [],
        narrativeDataModel: narrativeModel ? narrativeModel : state.narrativeDataModel,
        narrativeInfo: narrativeInfo,

    };
}

function deleteGroup(state: BillingNarrativeState): Partial<BillingNarrativeState> {
    return {
        ...state,
        loading: true,
    };
}

function deleteGroupFail(state: BillingNarrativeState): Partial<BillingNarrativeState> {
    return {
        ...state,
        loading: false,
    };
}



function saveNarrtiveInfoSuccess(state: BillingNarrativeState, narrativeGroupItem: NarrativeDataModel): Partial<BillingNarrativeState> {
    let newGroup: any;
    let newItem: any;
    if (state.narrativeDataModel.find(a => a.narrativeGroupId === narrativeGroupItem.narrativeGroupId)) {
        newItem = narrativeGroupItem.narrativeItems;

    } else {

        newGroup = narrativeGroupItem;

    }
    return {
        ...state,
        loading: false,
        narrativeGroupItem: newItem ? newItem : narrativeGroupItem.narrativeItems,
        narrativeDataModel: newGroup ? state.narrativeDataModel.concat(newGroup) : state.narrativeDataModel.map(i => {
            if (i.narrativeGroupId === narrativeGroupItem.narrativeGroupId) {
                return { ...i, narrativeItems: newItem };
            } else {
                return i;
            }
        }),
        narrativeInfo: {
            ...state.narrativeInfo,
            narrativeGroupId: narrativeGroupItem.narrativeGroupId,
            narrativeGroupDescription: narrativeGroupItem.narrativeGroupName,
            narrativeItemId: narrativeGroupItem.narrativeItems[narrativeGroupItem.narrativeItems.length - 1].narrativeItemId,
            narrativeItemGroupId: narrativeGroupItem.narrativeItems[narrativeGroupItem.narrativeItems.length - 1].narrativeGroupId,
            narrativeItemDescription: narrativeGroupItem.narrativeItems[narrativeGroupItem.narrativeItems.length - 1].narrativeItemDescription,
            narrativeItemText: narrativeGroupItem.narrativeItems[narrativeGroupItem.narrativeItems.length - 1].narrativeItemText,

        }

    };
}



function selectNarrativeGroup(state: BillingNarrativeState, narrativeGroupItem: NarrativeDataModel): Partial<BillingNarrativeState> {
    let selectNarativeItem = null;
    if (narrativeGroupItem.narrativeItems && narrativeGroupItem.narrativeItems.length > 0) {
        selectNarativeItem = narrativeGroupItem.narrativeItems[narrativeGroupItem.narrativeItems.length - 1];

    }

    return {
        ...state,
        narrativeGroupItem: narrativeGroupItem.narrativeItems,
        narrativeInfo: {
            ...state.narrativeInfo,
            narrativeGroupId: narrativeGroupItem.narrativeGroupId,
            narrativeGroupDescription: narrativeGroupItem.narrativeGroupName,
            narrativeItemId: selectNarativeItem ? selectNarativeItem.narrativeItemId : 0,
            narrativeItemGroupId: selectNarativeItem ? selectNarativeItem.narrativeGroupId : 0,
            narrativeItemDescription: selectNarativeItem ? selectNarativeItem.narrativeItemDescription : null,
            narrativeItemText: selectNarativeItem ? selectNarativeItem.narrativeItemText : null,
        },

    };
}

function selectNarrativeGroupItem(state: BillingNarrativeState, item: NarrativeItem): Partial<BillingNarrativeState> {
    return {
        ...state,
        narrativeInfo: {
            ...state.narrativeInfo,
            narrativeItemId: item.narrativeItemId,
            narrativeItemDescription: item.narrativeItemDescription,
            narrativeItemText: item.narrativeItemText,
            narrativeItemGroupId: item.narrativeGroupId
        },

    };
}



function viewChange(state: BillingNarrativeState, changeValue): Partial<BillingNarrativeState> {
    switch (changeValue.kind) {

        case ViewChangeKind.ChangeGroup:
            return {
                ...state,
                narrativeInfo: {
                    ...state.narrativeInfo,
                    narrativeItemGroupId: 0,
                    narrativeGroupId: 0,
                    narrativeItemId: 0,
                    narrativeGroupDescription: changeValue.value

                },

            };
        case ViewChangeKind.ChangeItem:
            return {
                ...state,
                narrativeInfo: {
                    ...state.narrativeInfo,
                    narrativeItemDescription: changeValue.value
                },


            };
        case ViewChangeKind.ChangeNarrativeText:
            return {
                ...state,
                narrativeInfo: {
                    ...state.narrativeInfo,
                    narrativeItemText: changeValue.value
                },
            };
        case ViewChangeKind.AddCurrentNarrativeText:
            return {
                ...state,
                narrativeInfo: {
                    ...state.narrativeInfo,
                    narrativeItemGroupId: 0,
                    narrativeItemDescription: null,
                    narrativeItemId: 0,
                    // narrativeItemText:
                },
            };
        case ViewChangeKind.AddNewNarrativeText:
            return {
                ...state,
                narrativeInfo: {
                    ...state.narrativeInfo,
                    narrativeItemGroupId: 0,
                    narrativeItemDescription: null,
                    narrativeItemText: null,
                    narrativeItemId: 0,

                },
            };

        default: {
            return state;
        }
    }
}


export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => {
    return views[token];
});
export const getStateIsLoadingByToken = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.loading : false);
export const getNarrativeDataModelByToken = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.narrativeDataModel : null);
export const getNarrativeGroupsItemsByToken = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.narrativeGroupItem : null);
export const getNarrativeInfoByToken = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.narrativeInfo : null);

