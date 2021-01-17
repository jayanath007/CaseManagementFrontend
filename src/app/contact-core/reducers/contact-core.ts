import { PageEvent } from '@angular/material';
// import { ItemFilterState } from './../../mail-core/reducers/items';
import { ContactRequest } from '../models/contact-core-request';

import {
    INIT_CONTACT_CORE,
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import {
    Contact, ContactResponse, ContactItemWrapper, ContactListItem

} from '../models/interface';

import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';

export interface ContactGridView { [hash: string]: ContactViewState; }

export interface ContactState {
    ContactData: ContactGridView;
    matterInfo: MatterInfo;
    readonly searchText: string;
    readonly pageEvent: PageEvent;
}

export interface ContactViewState {
    data: ContactItemWrapper[];
    total: number;
    loading: boolean;
}

export interface State {
    views: {
        [token: string]: ContactState;
    };
}

function initView(state: ContactState, matterInfo: MatterInfo): Partial<ContactState> {
    if (!state) {
        return { searchText: '', ContactData: {}, pageEvent: { pageSize: 10, pageIndex: 1, length: 0 }, matterInfo: matterInfo };
    }
    return state;
}

function viewChange(state: ContactState, action: Actions.ContactViewChange): Partial<ContactState> {

     // const ContactData = ContactListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                //  ContactData: ContactData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
                // ContactData: ContactData,
            };
        default: {
            return state;
        }
    }
}
function rowChange(state: ContactState, action: Actions.ContactGridRowChange,
    row: ContactItemWrapper, token: string): Partial<ContactState> {

    const ContactData = ContactListItemsChange(state, action.payload.value, row, token);

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:
            return {
                ...state,
                ContactData: ContactData
            };
        default: {
            return state;
        }
    }
}

function ContactListItemCollapsedALL(state: ContactState, token: string)
    : ContactGridView {
    const hash = createViewhash(state);
    const filesData = state.ContactData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        return Object.freeze({ ...file, isExpand: false });
    }));
    tmp[hash] = { data: newfilesData, total: state.ContactData[hash].total, loading: false };
    return tmp;
}


function ContactListItemsChange(state: ContactState, newValue: number, row: ContactItemWrapper, token: string)
    : ContactGridView {
    const hash = createViewhash(state);
    const filesData = state.ContactData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { data: newfilesData, total: state.ContactData[hash].total, loading: false };
    return tmp;
}


const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any): State {

    const tmp = {};
    switch (action.type) {

        case Actions.INIT_CONTACT_CORE:
            tmp[action.token] = initView(state.views[action.token], action.matterInfo);
            console.log('reducer' + Actions.INIT_CONTACT_CORE);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CONTACT_CORE_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CONTACT_CORE_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CONTACT_CORE_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = ContactLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CONTACT_CORE_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ ContactData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CONTACT_CORE_GRID_ROW_CHANGE:

            tmp[action.token] = rowChange(state.views[action.token], action, action.payload.row, action.token);
            return { ...state, views: { ...state.views, ...tmp } };

        default:
            { return state; }
    }
}

function preLoadData(state: ContactState, request: ContactRequest) {
    const newContactListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { data: [], total: null, loading: true };
        return accu;
    }, { ...state.ContactData });
    return { ...state, ContactData: newContactListData, };
}

// tslint:disable-next-line:max-line-length
function ContactLoadSuccess(state: ContactState, response: ContactResponse, request: ContactRequest): Partial<ContactState> {
    const newContactListData = [{ request, response }].reduce((accu, item) => {
        const data: ContactItemWrapper[] = item.response.Data.Data.map((_item) => ({ data: _item, isExpand: false }));
        accu[item.request.hash] = { data: data, loading: false, total: item.response.Data.Total };
        return accu;
    }, { ...state.ContactData });
    return { ...state, ContactData: newContactListData, };
}

function createViewhash(state: ContactState) {
    const hash = state.searchText + '/' + state.pageEvent.pageSize + '/' + state.pageEvent.pageIndex;
    console.log('hash', hash);
    return hash;
}

export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getContactListByToken = (token) => createSelector(getViewByToken(token),
    (fileState) => {
        return fileState.ContactData;
    }
);
export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);

export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => state.searchText);
export const getContactPageEventByToken = (token) => createSelector(getViewByToken(token), (state) => state.pageEvent);
export const getContactGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        return state.ContactData[hash];
    });

export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),
    getContactListByToken(token), (hash, gridViews) => gridViews && gridViews[hash] !== undefined);




