import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';

export interface ActionWidgetState {
    readonly loadingBMData: boolean;
}

const initialState: ActionWidgetState = {
    loadingBMData: false
};

export function reducer(state = initialState, action: Actions.Any): ActionWidgetState {
    return state;
}

export const getView = (state: ActionWidgetState) => state;
export const getIsBMDataLoading = () => createSelector(getView, actionsState => actionsState.loadingBMData);
