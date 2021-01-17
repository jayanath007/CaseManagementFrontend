
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { CurrentActivitySum } from '../../team-efficiency-core/models/interfaces';

export interface State {
    readonly loading: boolean;
    readonly data: CurrentActivitySum[];
}

const initialState: State = {
    loading: false,
    data: null
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_TEAN_WIDGET: {
            return { ...state, loading: false };
        }
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET: {
            return { ...state, loading: true };
        }
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_SUCCESS: {
            return { ...state, loading: false,  data: action.eventYearSummery};
        }
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_FAIL: {
            return { ...state, loading: false };
        } default: {
            return state;
        }
    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (team) => team.loading);
export const getData = () => createSelector(getView, (team) => team.data);


