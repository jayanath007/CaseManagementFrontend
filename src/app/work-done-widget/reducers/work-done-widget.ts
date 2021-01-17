import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { GridData, FromToDate } from '../models/interfce';
import { dpsNewDate } from '../../utils/javascriptDate';

export interface State {
    readonly loading: boolean;
    data: GridData[];
    fromToDate: FromToDate;

}
const initialState: State = {
    loading: false,
    data: null,
    fromToDate: {
        fromDate: new Date(),
        toDate: new Date(),
    }
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_WORK_DONE_WIDGET:
            return {
                ...state, loading: false,
                fromToDate: { fromDate: dpsNewDate(action.timeOffset), toDate: dpsNewDate(action.timeOffset) }
            };
        case Actions.LOAD_FROM_TO_DATE:
            return { ...state, loading: true, };
        case Actions.LOAD_FROM_TO_DATE_SUCCESS:
            return { ...state, loading: false, fromToDate: action.payload.dates };
        case Actions.LOAD_FROM_TO_DATE_FAIL:
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
export const getIsLoading = () => createSelector(getView, (workDone) => workDone.loading);
export const getData = () => createSelector(getView, (workDone) => workDone.data);
export const fromToDate = () => createSelector(getView, (workDone) => workDone.fromToDate);
