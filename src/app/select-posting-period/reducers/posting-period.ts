import { PosingPeriod } from './../../setting-core/models/interface';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';

export interface State {
    readonly [token: string]: PostingPeriodState;
}

export interface PostingPeriodState {
    readonly init: boolean;
    readonly dataLoading: boolean;
    readonly PostingPeriodList: PosingPeriod[];
    readonly selectedPostingPeriod: PosingPeriod;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_POSTING_PERIOD:
            temp[action.token] = setInitData(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_POSTING_PERIOD:
            temp[action.token] = getPostingPeriod(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_POSTING_PERIOD_SUCCESS:
            temp[action.token] = setPostingPeriodList(state[action.token], action.payload.posingPeriodList);
            return { ...state, ...temp };
        case Actions.GET_POSTING_PERIOD_FAIL:
            temp[action.token] = getPostingPeriodFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SET_SELECTED_POSTING_PERIOD:
            temp[action.token] = setSelectedPostingPeriod(state[action.token], action.payload.selectedPeriod);
            return { ...state, ...temp };
        default:
            { return state; }
    }
}
function setInitData(state: PostingPeriodState): Partial<PostingPeriodState> {
    if (!state) {
        return {
            ...state,
            init: true,
            dataLoading: false,
            PostingPeriodList: null,
            selectedPostingPeriod: null,
        };
    }
    return state;
}
function getPostingPeriod(state: PostingPeriodState): Partial<PostingPeriodState> {
    return Object.freeze({
        ...state,
        dataLoading: true,
    });
}
function setPostingPeriodList(state: PostingPeriodState, postingPeriodList: PosingPeriod[]): Partial<PostingPeriodState> {
    return Object.freeze({
        ...state,
        dataLoading: false,
        PostingPeriodList: postingPeriodList
    });
}
function getPostingPeriodFail(state: PostingPeriodState): Partial<PostingPeriodState> {
    return Object.freeze({
        ...state
        , dataLoading: false
    });
}
function setSelectedPostingPeriod(state: PostingPeriodState, selectedItem: PosingPeriod): Partial<PostingPeriodState> {
    return Object.freeze({
        ...state,
        selectedPostingPeriod: selectedItem
    });
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);

export const getPostingPeriodLoadingByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.dataLoading : null);
export const getPostingPeriodListByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.PostingPeriodList : []);
export const getSelectedPostingPeriodByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedPostingPeriod : null);
