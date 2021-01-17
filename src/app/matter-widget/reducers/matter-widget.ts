import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { MatterSearchGridData } from '../../matter-search-core';

export interface State {
    readonly loading: boolean;
    data: MatterSearchGridData[];

}
const initialState: State = {
    loading: false,
    data: null
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_MATTER_WIDGET:
            return { ...state, loading: false };
        case Actions.LOAD_DATA:
            return { ...state, loading: true, };
        case Actions.LOAD_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.dataObject ? action.payload.dataObject.data : null };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loading: false };
        case Actions.UPDATE_A_MATTER:
            let updatedData = [];
            if (state.data && state.data.length > 0) {
                updatedData = state.data.map(i => {
                    if (i.matterReferenceNo === action.matter.matterRef) {
                        return {
                            ...i,
                            appID: action.matter.appId,
                            fileID: +action.matter.fileID,
                            app_Code: action.matter.appCode,
                            branchID: action.matter.branchID,
                            feeEarner: action.matter.matterFeeEarner,
                            clientName: action.matter.clientName,
                            matterDetails: action.matter.matterDetails,
                            matterReferenceNo: action.matter.matterRef,
                            rateCategory: action.matter.matterRateCategory,
                            ufnValue: action.matter.crimeUFN,
                            eBilling: action.matter.eBilling,
                            isPlotMatter: action.matter.isPlotMatter,
                            isPlotMasterMatter: action.matter.isPlotMasterMatter,
                        };
                    }
                    return i;
                });
            }

            return { ...state, data: updatedData };
        default:
            {
                return state;
            }
    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (matterStore) => matterStore ? matterStore.loading : null);
export const getData = () => createSelector(getView, (matterStore) => matterStore && matterStore.data ? matterStore.data : null);
