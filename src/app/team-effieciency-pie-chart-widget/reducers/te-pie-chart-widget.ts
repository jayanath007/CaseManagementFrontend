import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { Message } from '../../core/lib/microsoft-graph';
import { DataRequestModel, AdgedDebChartData } from '../models/interfce';
// import { TimeRecordedOption } from '../../team-efficiency-core/models/enums';

export interface State {
    data: AdgedDebChartData;
    rquest: DataRequestModel;
    chartTitle: string;
}
const initialState: State = {
    data: null,
    rquest: null,
    chartTitle: ''
};


export function reducer(state = initialState, action: Actions.Any): State {
    switch (action.type) {
        case Actions.INIT_TE_PIECHART_WIDGET:
            return { ...state, data: { isLoading: false, data: [] }, rquest: setInitialRequst(), chartTitle: 'AGED DEBTORS' };
        case Actions.LOAD_DATA:
            return { ...state, data: { isLoading: true, data: [] }, };
        case Actions.LOAD_DATA_SUCCESS:
            return {
                ...state, data: { isLoading: false, data: action.payload.data },
                chartTitle: ('AGED DEBTORS' + ' - (YTD)').toUpperCase()
            };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, data: { isLoading: false, data: state.data.data } };
        default:
            {
                return state;
            }
    }
}

function setInitialRequst() {
    return {
        users: '',
        month: -2,
        department: NaN
    };
}


export const getView = (state: State) => state;
export const getData = () => createSelector(getView, (teStore) => teStore && teStore.data ? teStore.data : null);
export const getRequestModel = () => createSelector(getView, (teStore) => teStore ? teStore.rquest : null);
export const getChartTitle = () => createSelector(getView, (teStore) => teStore ? teStore.chartTitle : null);
