import {
    CHANGE_SAFE_BOX_TYPE, ChangeSafeBoxType, EXPAND_SAFE_BOX_EXPLORER, ExpandSafeBoxExplorer,
    ITEM_COPY, ItemCopy, ItemCutSuccess, RemoveCopyFrom,
} from '../actions/core';
import { createSelector } from '@ngrx/store';
import { CUT_OR_COPY_ITEMS, CutOrCopyItems } from '../../drive-core';
import { CUT_OR_COPY_TEMPLATES, CutOrCopyTemplates } from '../actions/template-directory';
import { SafeBoxType } from '../../core';

export interface State {
    readonly copyFrom: SafeBoxType;
    readonly selectedSafeBoxtype: SafeBoxType;
}
const initialState: State = {
    selectedSafeBoxtype: SafeBoxType.Drive,
    copyFrom: null,
};

export function reducer(state = initialState, action: ChangeSafeBoxType | ExpandSafeBoxExplorer |
    ItemCopy | ItemCutSuccess | CutOrCopyItems | CutOrCopyTemplates | RemoveCopyFrom): State {
    switch (action.type) {

        case CHANGE_SAFE_BOX_TYPE:
            return { ...state, selectedSafeBoxtype: action.payload };
        case EXPAND_SAFE_BOX_EXPLORER:
            return { ...state, selectedSafeBoxtype: SafeBoxType.Blob };
        case ITEM_COPY:
            return { ...state, copyFrom: SafeBoxType.Blob };
        case CUT_OR_COPY_ITEMS:
            return { ...state, copyFrom: SafeBoxType.Drive };
        case CUT_OR_COPY_TEMPLATES:
            return { ...state, copyFrom: SafeBoxType.Template };
        case CUT_OR_COPY_TEMPLATES:
            return { ...state, copyFrom: null };
        default:
            {
                return state;
            }

    }
}

export const getState = (state: State) => state;
export const getSelectedSafeBoxtype = createSelector(getState,
    (state) => {
        return state ? state.selectedSafeBoxtype : null;
    });
export const getCopyFrom = createSelector(getState,
    (state) => {
        return state ? state.copyFrom : null;
    });
