import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { DataRequestModel } from '../models/interfce';
import { TimeRecordedOption } from '../../team-efficiency-core/models/enums';

export interface State {
    readonly loading: boolean;
    data: any;
    rquest: DataRequestModel;
    chartTitle: string;
}
const initialState: State = {
    loading: false,
    data: null,
    rquest: null,
    chartTitle: ''
};


export function reducer(state = initialState, action: Actions.Any): State {
    switch (action.type) {
        case Actions.INIT_TE_TIME_RECORDED_WIDGET:
            return { ...state, loading: false, rquest: setInitialRequst(), chartTitle: 'TIME RECORDED' };
        case Actions.LOAD_DATA:
            return { ...state, loading: true, };
        case Actions.LOAD_DATA_SUCCESS:
            return {
                ...state, loading: false, data: action.payload.data,
                chartTitle: ('TIME RECORDED' + ' - ' + state.rquest.option + ' (YTD)').toUpperCase()
            };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loading: false };
        default:
            {
                return state;
            }
    }
}

function setInitialRequst() {
    return {
        user: '',
        month: -2,
        option: TimeRecordedOption.CHARGEABLE,
        department: NaN
    };
}



export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (teStore) => teStore ? teStore.loading : null);
export const getData = () => createSelector(getView, (teStore) => teStore && teStore.data ? teStore.data : null);
export const getRequestModel = () => createSelector(getView, (teStore) => teStore ? teStore.rquest : null);
export const getChartTitle = () => createSelector(getView, (teStore) => teStore ? teStore.chartTitle : null);
