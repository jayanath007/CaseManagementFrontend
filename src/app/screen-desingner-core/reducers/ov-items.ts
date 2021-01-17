import { UiComponentType } from '../../screen-view-core/models/screen-contaner-component';

import { LOAD_OV_ITEM, LOAD_OV_ITEM_LIST_FAIL, INIT_OV_ITEM } from '../actions/ov-items';
import { createSelector } from '@ngrx/store';
import * as OvItemsAction from '../actions/ov-items';
import { OvItem } from '../models/application-component';
import { FormView } from './screen-desingner';
import { RowOvItemChangeKind } from '../actions/core';

export interface State {
    readonly [token: string]: OvItemState;
}

export interface OvItemState {
    readonly ovItems: OvItem[];
    readonly ovItemLoading: boolean;
    readonly searchText: string;
    readonly fieldTypeList: Array<{ fieldTypeId: UiComponentType, fieldTypeName: string }>;
}


export const intialState: State = {};

export function reducer(state: State = intialState, action: OvItemsAction.Any): State {
    const temp = {};
    switch (action.type) {


        case (OvItemsAction.INIT_OV_ITEM):
            temp[action.token] = getInitData(state[action.token]);
            return { ...state, ...temp };

        case (OvItemsAction.OV_LIST_SEARCH_TEXT_CHANGE):
            temp[action.token] = ovListFilter(state[action.token], action.payload.text);
            return { ...state, ...temp };

        case (OvItemsAction.OV_LIST_ITEMS_UPDATE):
            temp[action.token] = ovItemsListUpdate(state[action.token], action.payload.ovItem, action.payload.formView);
            return { ...state, ...temp };

        case (OvItemsAction.SCREEN_DESIGNER_UPDATE_OV_ITEM):
            temp[action.token] = ovListUpdate(state[action.token], action.payload);
            return { ...state, ...temp };

        case (OvItemsAction.LOAD_OV_ITEM):
            temp[action.token] = getOvItem(state[action.token]);
            return { ...state, ...temp };

        case (OvItemsAction.LOAD_OV_ITEM_LIST_FAIL):
            temp[action.token] = getOvItemFail(state[action.token]);
            return { ...state, ...temp };

        default:
            return state;
    }
}


export const getOvItemByToken = (token) => createSelector(getViewByToken(token),
    (ovItemState) => {
        if (ovItemState && ovItemState.ovItems) {
            return ovItemState.ovItems;
        }
    });


function ovListFilter(state: OvItemState, searchText: string) {

    if (state.ovItems) {
        const newList = state.ovItems.map((item) => {
            if (item.description && item.description.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                return { ...item, isDisplay: true };
            } else {
                return { ...item, isDisplay: false };
            }
        });
        return { ...state, ovItemLoading: false, searchText: searchText, ovItems: [...newList] };
    } else {
        return state;
    }

}


function ovListUpdate(state: OvItemState, action: {
    kind: RowOvItemChangeKind;
    row: OvItem; value: any;
}) {
    let newOvItemList;
    switch (action.kind) {

        case RowOvItemChangeKind.SelectItem:
            newOvItemList = updateItem(state.ovItems, action.row);
            break;
        case RowOvItemChangeKind.UpdateValue:
            newOvItemList = updateItem(state.ovItems, action.row);
            break;
        case RowOvItemChangeKind.InsertItem:
            newOvItemList = [...state.ovItems, { ...action.row }];
            break;
        case RowOvItemChangeKind.DeleteItemSuccess:
            newOvItemList = state.ovItems.filter((a) => !a.isSelected);
            break;
        default:
            newOvItemList = state.ovItems;
            break;
    }
    return { ...state, ovItemLoading: false, ovItems: [...newOvItemList] };
}

const fieldTypeList = [
    { fieldTypeId: UiComponentType.Text, fieldTypeName: 'Text' },
    { fieldTypeId: UiComponentType.Date, fieldTypeName: 'Date' },
    { fieldTypeId: UiComponentType.YesNo, fieldTypeName: 'YesNo' },
    { fieldTypeId: UiComponentType.Label, fieldTypeName: 'Label' },
    { fieldTypeId: UiComponentType.Combo, fieldTypeName: 'Combo' },
    { fieldTypeId: UiComponentType.Currency, fieldTypeName: 'Currency' },
    { fieldTypeId: UiComponentType.Integer, fieldTypeName: 'Integer' },
    { fieldTypeId: UiComponentType.Time, fieldTypeName: 'Time' }
];

function getInitData(state: OvItemState): Partial<OvItemState> {
    if (!state) {
        return Object.freeze({
            ...state,
            loading: true,
            init: true,
            searchText: '',
            ovItems: [],
            fieldTypeList: fieldTypeList,
        });
    } else {
        return state;
    }
}

function setAllItemData(state: OvItemState, payload): Partial<OvItemState> {
    return Object.freeze({
        ...state, allItemData: payload.AllOvItems
    });
}
function updateItem(ovItemList: OvItem[], item: OvItem) {
    return ovItemList.map((ovItem) => {
        if (ovItem.varNo === item.varNo) {
            return { ...item };
        } else {
            return ovItem;
        }
    });
}

const getOvItem = (state: OvItemState): Partial<OvItemState> => {
    return Object.freeze({ ...state, ovItemLoading: true });
};

const ovItemSort = function (a: OvItem, b: OvItem) {

    const x1 = a.onScreen;
    const x2 = b.onScreen;

    const y1 = a.sequence;
    const y2 = b.sequence;

    const z1 = a.varNo;
    const z2 = b.varNo;

    if (x1 < x2) {
        return 1;
    }
    if (x1 > x2) {
        return -1;
    }
    if (y1 < y2) {
        return -1;
    }
    if (y1 > y2) {
        return 1;
    }
    if (z1 < z2) {
        return -1;
    }
    if (z1 > z2) {
        return 1;
    }

    return 0;
};

function getFieldTipeNameById(id: number): string {
    let type;
    switch (id) {
        case 0: {
            type = 'Text';
            break;
        }
        case 1: {
            type = 'Date';
            break;
        }
        case 2: {
            type = 'YesNo';
            break;
        }
        case 3: {
            type = 'Label';
            break;
        }
        case 4: {
            type = 'Combo';
            break;
        }
        case 5: {
            type = 'Currency';
            break;
        }
        case 6: {
            type = 'Integer';
            break;
        }
        case 7: {
            type = 'Line';
            break;
        }
        case 8: {
            type = 'Time';
            break;
        }
    }
    return type;

}

function ovItemsListUpdate(state: OvItemState, ovItems: OvItem[], formView: FormView): Partial<OvItemState> {

    const newList = Object.freeze(ovItems.map((ovItem) => {
        const creenContaner = formView.screenContanerComponentList.filter(x => x.varNo === ovItem.screenComponentDto.avD_VarNo)[0];
        if (creenContaner) {
            ovItem.onScreen = true;
            ovItem.sequence = creenContaner.sequence;

            ovItem.description = creenContaner.contanerLable.value.toString();
            ovItem.fieldType = creenContaner.uiComponentType;
            ovItem.screenComponentDto.avD_Type = creenContaner.screenComponentDto.avD_Type;
            if (getFieldTipeNameById(creenContaner.uiComponentType)) {
                ovItem.fieldTypeText = getFieldTipeNameById(creenContaner.uiComponentType);
                ovItem.screenComponentDto.avD_TypeText = getFieldTipeNameById(creenContaner.uiComponentType);
            }
            ovItem.screenComponentDto.avD_Text = creenContaner.screenComponentDto.avD_Text;

        } else {
            ovItem.onScreen = false;
            ovItem.sequence = 0;
        }
        ovItem.screenComponentDto.sC_AppID = formView.screenDefinition.screenDefinitionDto.sD_AppID;
        ovItem.screenComponentDto.sD_ContactType = formView.screenDefinition.screenDefinitionDto.sD_ContactType;
        ovItem.screenComponentDto.sC_ScreenNo = formView.screenDefinition.screenDefinitionDto.sD_Number;
        return ovItem;
    }));

    return { ...state, ovItemLoading: false, ovItems: [...newList] };
}


const getOvItemFail = (state: OvItemState): Partial<OvItemState> => {
    return Object.freeze({ ...state, ovItemLoading: false });
};
const getView = (state: State) => {
    return state;
};
export const getViewByToken = (token) => createSelector(getView, (views) => {
    return views[token];
});


export const getSortedOvItemByToken = (token) => createSelector(getViewByToken(token),
    (ovItemState) => {
        return (ovItemState && ovItemState.ovItems) ? ovItemState.ovItems.filter((item) => item.isDisplay).sort(ovItemSort) : null;
    });

export const getSearchtextToken = (token) => createSelector(getViewByToken(token),
    (ovItemState) => {
        return ovItemState.searchText;
    });



export const getSelectedOvItemByToken = (token) => createSelector(getViewByToken(token),
    (ovItemState) => {
        if (ovItemState && ovItemState.ovItems) {
            return ovItemState.ovItems.filter(p => p.isSelected === true);
        }
    });

export const getisOvItemLoadingByToken = (token) => createSelector(getViewByToken(token), (ovItemState) =>
    ovItemState ? (ovItemState.ovItemLoading && ovItemState.ovItemLoading === true) : null);



