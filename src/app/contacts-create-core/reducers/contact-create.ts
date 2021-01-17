import { createSelector } from '@ngrx/store';
import * as Action from '../actions/core';
import { OpenFrom, TabIndex, Mode } from '../models/enum';
import { ContactViewModel, ContactType } from '../models/interfaces';
import { ColumnDef } from './../../core/lib/grid-model';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import { ContactCreateInputData } from './../models/interfaces';
import { MatterInfo } from '../../core';

export interface State {
    readonly [token: string]: ContactSearchState;
}

export interface ContactSearchState {
    readonly loading: boolean;
    readonly isPopup: boolean;
    readonly openFrom: OpenFrom;
    readonly selectedContact: ContactViewModel;
    readonly contactSearchKey: string;
    readonly isShowSearchTab: true;
    readonly selectTabIndex: TabIndex;
    readonly otherContactColumnDef: ColumnDef[];
    readonly mode: Mode;
    readonly types: ContactType[];
    readonly matterData: MatterInfo;
}

const initialState: State = {

};

export function reducer(state: State = initialState, action: Action.Any): State {
    const temp = {};
    switch (action.type) {
        case Action.INIT_CONTACT_CREATION:
            temp[action.token] = intitState(state[action.token], action.payload);
            return {
                ...state, ...temp
            };
        case Action.CHENGE_SEARCH_TEXT:
            temp[action.token] = {
                ...state[action.token],
                contactSearchKey: action.payload.searchText,
                isShowSearchTab: true,
                selectTabIndex: TabIndex.SearchResult
            };
            return {
                ...state, ...temp
            };
        case Action.CHANGE_TAB:
            temp[action.token] = {
                ...state[action.token],
                selectTabIndex: action.payload.selectTabIndex
            };
            return {
                ...state, ...temp
            };
        case Action.CHANGE_CONTACT:
            temp[action.token] = {
                ...state[action.token],
                selectTabIndex: TabIndex.Details,
                isShowSearchTab: !action.payload.closeSearch,
                loading: true
            };
            return {
                ...state, ...temp
            };
        case Action.CHANGE_CONTACT_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                selectedContact: action.payload.details,
                loading: false,
                mode: Mode.Edit
            };
            return {
                ...state, ...temp
            };
        case Action.CHANGE_CONTACT:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return {
                ...state, ...temp
            };
        case Action.CHANGE_DETAILS:
            const contact: ContactViewModel = JSON.parse(JSON.stringify(state[action.token].selectedContact));
            contact[action.payload.type] = action.payload.value;
            contact[action.payload.section] = true;
            temp[action.token] = {
                ...state[action.token],
                selectedContact: contact
            };
            return { ...state, ...temp };
        case Action.GET_CONTACT_TYPE:
            temp[action.token] = {
                ...state[action.token],
                loading: true
            };
            return { ...state, ...temp };
        case Action.GET_CONTACT_TYPE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                types: action.payload.types,
                loading: false
            };
            return { ...state, ...temp };
        case Action.GET_CONTACT_TYPE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return { ...state, ...temp };
        default:
            return state;
    }
}

function intitState(state: ContactSearchState, payload: { inputData: ContactCreateInputData, isPopup: boolean }) {
    if (!state) {
        return {
            openFrom: payload.inputData.openfrom,
            loading: false,
            selectedContact: new ContactViewModel(),
            contactSearchKey: '',
            isShowSearchTab: true,
            selectTabIndex: 0, // selectTabIndex: TabIndex.Details,
            isPopup: payload.isPopup,
            otherContactColumnDef:
                [
                    createDefultColumnDef('icon', { label: '', fxFlex: '2', filterAnchor: 'end', filterHidden: true }),
                    createDefultColumnDef('Name', { label: 'Name', fxFlex: '', filterAnchor: 'start', filterHidden: true }, FieldType.Text),
                    createDefultColumnDef('Telephone', { label: 'Telephone', fxFlex: '10', filterAnchor: 'start', filterHidden: true },
                        FieldType.Text),
                    createDefultColumnDef('Email', { label: 'Email', fxFlex: '12', filterAnchor: 'start', filterHidden: true },
                        FieldType.Text)
                ],
            mode: Mode.New,
            matterData: payload.inputData.matterInfo
        };
    } else {
        return state;
    }

}

const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (state) => state[token]);
export const getIsLoading = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : true);
export const getSelectedContact = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectedContact : null);
export const getContactSearchKeyByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.contactSearchKey : null);
export const getIsShowSearchTabByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.isShowSearchTab : false);
export const getSelectedTabIndexByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.selectTabIndex : 0);
export const getOtherContactColuByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.otherContactColumnDef : []);
export const getModeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.mode : []);
export const getContactTypeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.types : []);
export const getMatterData = (token) => createSelector(getStateByToken(token), (state) => state ? state.matterData : null);
