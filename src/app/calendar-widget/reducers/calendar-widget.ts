import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';

export interface State {
    readonly loading: boolean;
    data: any;

}
const initialState: State = {
    loading: false,
    data: null
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_CALENDAR_WIDGET:
            return { ...state, loading: false };
        case Actions.LOAD_DATA:
            return { ...state, loading: true, };
        case Actions.LOAD_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.data };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loading: false };
        default:
            {
                return state;
            }
    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (matterStore) => matterStore ? matterStore.loading : null);
export const getData = () => createSelector(getView, (matterStore) => matterStore && matterStore.data ? matterStore.data : null);
