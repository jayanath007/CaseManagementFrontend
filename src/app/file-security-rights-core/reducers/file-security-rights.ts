import { UserWithRights } from '../models/interface';
import * as Actions from '../actions/core';
export interface State {
    isLoading: boolean;
    usersWithRights: UserWithRights[];
    originalModale: UserWithRights[];
}
const initialState: State = {
    isLoading: true,
    usersWithRights: [],
    originalModale: [],
};
export function reducer(state: State = initialState, action: Actions.Any): State {
    switch (action.type) {

        case Actions.GET_USERS_WITH_FILE_SECURITY_RIGHT:
            return { ...state, isLoading: true };
        case Actions.GET_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS:
            return { ...state, isLoading: false, usersWithRights: action.payload, originalModale: action.payload };
        case Actions.GET_USERS_WITH_FILE_SECURITY_RIGHT_FAIL:
            return { ...state, isLoading: false, usersWithRights: [], originalModale: [] };
        case Actions.HASE_RIGHTS_CHANGE:
            return {
                ...state, isLoading: false,
                usersWithRights: state.usersWithRights.map((value, index) =>
                    index === action.payload.index ? { ...value, hasRights: action.payload.value } : value)
            };
        default:
            { return state; }
    }
}

export const getIsLoading = (state: State) => {
    return state.isLoading;
};
export const getUsers = (state: State) => {
    return state.usersWithRights;
};
export const getOriginalUsers = (state: State) => {
    return state.originalModale;
};
