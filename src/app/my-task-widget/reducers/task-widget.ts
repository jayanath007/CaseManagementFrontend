import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { TimeZoneInformation } from '../../core/lib/microsoft-graph';
import { GridData } from '../models/interfce';

export interface State {
    readonly loading: boolean;
    data: GridData[];

}
const initialState: State = {
    loading: false,
    data: null
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_MY_TASK_WIDGET:
            return { ...state, loading: false };
        case Actions.LOAD_DATA:
            return { ...state, loading: true, };
        case Actions.LOAD_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.dataObj ? action.payload.dataObj.data : null };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loading: false };
        default:
            {
                return state;
            }
    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (task) => task.loading);
export const getData = () => createSelector(getView, (task) => task.data);
