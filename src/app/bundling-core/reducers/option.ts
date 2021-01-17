import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { BundleOption } from '../models/interface';
import { OptionPageNoLoaction } from '../models/enum';

export interface State {
    readonly [token: string]: BundlingOptionState;
}

export interface BundlingOptionState {
    readonly loading: boolean;
    readonly options: BundleOption;
    readonly pageNoLocation: { key: number, value: OptionPageNoLoaction }[];
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.OPEN_OPTION_POPUP:
            return {
                ...state,
                ...{
                    [action.token]: {
                        loading: false,
                        options: initialOptions(),
                        pageNoLocation: [{ key: 0, value: OptionPageNoLoaction.none },
                        { key: 1, value: OptionPageNoLoaction.topMiddle },
                        { key: 2, value: OptionPageNoLoaction.topRight },
                        { key: 3, value: OptionPageNoLoaction.bottomMiddle },
                        { key: 4, value: OptionPageNoLoaction.bottomRight }
                        ]
                    }
                }
            };
        case Actions.CHANGE_OPTION:
            const tempOption = {};
            tempOption[action.payload.key] = action.payload.value;
            temp[action.token] = {
                ...state[action.token],
                options: { ...state[action.token].options, ...tempOption }
            };
            return { ...state, ...temp };
        case Actions.CHANGE_IS_CORE_BUNDLE:
            temp[action.token] = {
                ...state[action.token],
                options: { ...state[action.token].options, preserveExitPage: true }
            };
            return { ...state, ...temp };
        case Actions.CHANGE_PRESERVE_EXISTING_PAGINATOR:
            temp[action.token] = {
                ...state[action.token],
                options: {
                    ...state[action.token].options,
                    preserveExitPage: action.iSPreserveExistingPaginator.checked
                }
            };
            return { ...state, ...temp };
    }
    return state;
}

function initialOptions(): BundleOption {
    return {
        name: 'Bundling',
        createIndexPage: true,
        showDocDate: true,
        separateEmail: false,
        preserveExitPage: false,
        restartPageNoAtSection: true,
        pageNumberLocation: 4,
        includeTitlePage: false,
        coverPage: null,
        stopMergeIfError: false
    };
}
export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getOptionLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : true);
export const getBundlePageNoLocationByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.pageNoLocation : '');
export const getBundleOptionsByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.options : null);
