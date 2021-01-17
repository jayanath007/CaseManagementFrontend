
import { catchError, map, mergeMap, filter, take, tap, switchMap } from 'rxjs/operators';
import { Field } from '../../screen-view-core/models/field';
import { File } from '../../core/lib/microsoft-graph';

import { LoadContactGridDataSuccess } from '../../contact-core/actions/core';
import { request } from 'https';
import { merge, combineLatest, of, from, forkJoin } from 'rxjs';
import { Contact } from '../../contact-core/models/interface';
import {
    getContactScreenByToken, getContactScreenHashByToken,
    getIsContactListLoadedForCurrentViewByToken, getIsSearchFieldsLoadedByToken, getContactScreenPageEventByToken,
    getContactScreenSearchTextByToken,
    getContactScreenMatterInfoByToken,
    getContactScreenScreenDefinitionByToken,
    getContactScreenSearchTypeByToken,
    getContactScreenSearchFieldByToken,
    getContactScreenSearchFieldValueByToken,
    getContactScreenDefaultSearchFields,
    getContactScreenMappedSearchFields
} from '../reducers';
import {
    GetSearchFieldsRequest, SearchAllContactsRequest, SearchFileContactsRequest, DeleteContactRequest, MattersForContactRequest,
    RemoveContactFromFileRequest,
    SaveContactSearchFieldsRequest
} from '../models/screen-contact-request';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as ScreenContactCore from '../actions/core';
import { ScreenContactAPIService } from '../services/screen-contact-api.service';
import { ContactScreenItem, ContactSearchType } from '../models/interface';
import {
    ContactScreenGridChange, CONTACT_SCREEN_GRID_CHANGE, DELETE_CONTACT, GetLinkedMattersForContact,
    GetLinkedMattersForContactSuccess, GetLinkedMattersForContactFailed, RemoveContactFromFileFailed,
    ViewChangeKind
} from '../actions/core';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';

@Injectable()
export class ScreenContactEffects {

    private readonly MAX_CONTACT_COUNT = '500';

    constructor(private actions$: Actions, private store: Store<any>, private service: ScreenContactAPIService) { }
    @Effect()
    initNewView$ = this.actions$.pipe(ofType<ScreenContactCore.InitContactSearchScreen>(ScreenContactCore.INIT_CONTACT_SEARCH_SCREEN),
        tap((data) => console.log('$INIT_CONTACT_SEARCH_SCREEN', data)),
        switchMap(action => {
            return [new ScreenContactCore.LoadContactsWithCurrentState(action.token, action.payload)];
        }));
    // .map((action) => {
    //     return new ScreenContactCore.LoadContactScreenDataWithCurrentState(action.token);
    // }
    // );

    @Effect()
    loadData$ = this.actions$.pipe(ofType<ScreenContactCore.LoadContactsWithCurrentState>
        (ScreenContactCore.LOAD_CONTACTS_WITH_CURRENT_STATE),
        tap((data) => console.log('LOAD_CONTACTS_WITH_CURRENT_STATE')),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getIsSearchFieldsLoadedByToken(action.token)),
                this.store.select(getIsContactListLoadedForCurrentViewByToken
                    (action.token, action.payload.searchType, action.payload.searchField, action.payload.searchKeyword)),
                (fieldsLoaded, contactsLoaded) => ({ fieldsLoaded, contactsLoaded })
            ).pipe(
                take(1),
                filter((result) => !result.fieldsLoaded || !result.contactsLoaded),
                mergeMap((result) => {
                    if (!result.fieldsLoaded) {
                        // load fields and contacts
                        return [
                            new ScreenContactCore.GetContactSearchFields(action.token, action.payload),
                            new ScreenContactCore.SearchContacts(action.token, action.payload)
                        ];
                    } else {
                        return [
                            new ScreenContactCore.SearchContacts(action.token, action.payload)
                        ];
                    }
                }));
        }));

    @Effect()
    getContactSearchFields$ = this.actions$.pipe(ofType<ScreenContactCore.GetContactSearchFields>
        (ScreenContactCore.GET_CONTACT_SEARCH_FIELDS),
        tap((action) => console.log('GET_CONTACT_SEARCH_FIELDS')),
        switchMap((action) => {
            const getSearchFieldsReq = new GetSearchFieldsRequest(
                action.payload.screenDefinition.screenDefinitionDto.sD_AppID.toString(),
                action.payload.screenDefinition.screenNumber.toString());
            return this.service.getContactSearchFields(getSearchFieldsReq).pipe(
                map(response => new ScreenContactCore.GetContactFieldsSuccess(
                    action.token,
                    { defaultFields: response.defaultContactFields, mappedFields: response.mappedContactFields })),
                catchError((error) => of(new ScreenContactCore.GetContactFieldsFailed(
                    action.token,
                    action.payload
                ))));
        }));

    @Effect()
    searchContacts$ = this.actions$.pipe(ofType<ScreenContactCore.SearchContacts>(ScreenContactCore.SEARCH_CONTACTS),
        tap(action => console.log('SEARCH_CONTACTS')),
        filter(action => action.payload.searchType !== ContactSearchType.CONFIGURE),
        tap(action => console.log(action.payload.searchType)),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getContactScreenPageEventByToken(action.token)),
                (pageEvent) => ({ pageEvent })
            ).pipe(
                switchMap<any, any>((info) => {
                    switch (action.payload.searchType) {
                        case ContactSearchType.All:
                            return [new ScreenContactCore.SearchAllContacts(action.token, {
                                contactTypeId: action.payload.screenDefinition.contactType.toString(),
                                count: this.MAX_CONTACT_COUNT,
                                searchField: '',
                                searchFieldValue: '',
                                searchKeyword: action.payload.searchKeyword
                            })];
                        case ContactSearchType.FILE:
                            return [new ScreenContactCore.SearchContactsOnFile(action.token, {
                                appId: action.payload.matterDetails.AppId.toString(),
                                fileId: action.payload.matterDetails.FileId.toString(),
                                branchId: action.payload.matterDetails.BranchId.toString(),
                                contactTypeId: action.payload.screenDefinition.contactType.toString(),
                                screenId: action.payload.screenDefinition.screenNumber.toString(),
                                count: this.MAX_CONTACT_COUNT,
                                searchKeyword: action.payload.searchKeyword
                            })];
                        case ContactSearchType.FIELD:
                            return [new ScreenContactCore.SearchAllContacts(action.token, {
                                contactTypeId: action.payload.screenDefinition.contactType.toString(),
                                count: this.MAX_CONTACT_COUNT,
                                searchField: action.payload.searchField,
                                searchFieldValue: action.payload.searchFieldValue,
                                searchKeyword: action.payload.searchKeyword
                            })];
                    }
                }),
                take(1));
        }));

    @Effect()
    searchAllContacts$ = this.actions$.pipe(ofType<ScreenContactCore.SearchAllContacts>(ScreenContactCore.SEARCH_ALL_CONTACTS),
        tap(action => console.log('SEARCH_ALL_CONTACTS')),
        switchMap(action => {
            let searchText = action.payload.searchFieldValue;
            if (action.payload.searchKeyword && action.payload.searchKeyword.trim().length > 0) {
                searchText = action.payload.searchKeyword;
            }
            const searchAllContactsReq = new SearchAllContactsRequest(
                action.payload.contactTypeId,
                action.payload.count,
                action.payload.searchField,
                searchText
            );
            return this.service.searchAllContacts(searchAllContactsReq).pipe(
                map(response => new ScreenContactCore.SearchAllContactsSuccess(
                    action.token,
                    { contactList: response.contactViewModels }
                )),
                catchError(error => of(new ScreenContactCore.SearchAllContactsFailed(
                    action.token,
                    action.payload
                ))));
        }));

    @Effect()
    searchContactsOnFile$ = this.actions$.pipe(ofType<ScreenContactCore.SearchContactsOnFile>(ScreenContactCore.SEARCH_CONTACTS_ON_FILE),
        tap(action => console.log('SEARCH_CONTACTS_ON_FILE')),
        switchMap(action => {
            const searchFileContactsReq = new SearchFileContactsRequest(
                action.payload.appId,
                action.payload.branchId,
                action.payload.contactTypeId,
                action.payload.count,
                action.payload.fileId,
                action.payload.screenId,
                action.payload.searchKeyword
            );
            return this.service.searchContactsOnFile(searchFileContactsReq).pipe(
                map(response => new ScreenContactCore.SearchContactsOnFileSuccess(
                    action.token,
                    { contactList: response.contactViewModels }
                )),
                catchError(error => of(new ScreenContactCore.SearchContactsOnFileFailed(
                    action.token,
                    action.payload
                ))));
        }));

    @Effect()
    deleteContact$ = this.actions$.pipe(ofType<ScreenContactCore.DeleteContact>(ScreenContactCore.DELETE_CONTACT),
        tap(action => console.log('DELETE_CONTACT')),
        switchMap(action => {
            const deleteContactReq = new DeleteContactRequest(action.payload.contacts);
            return this.service.deleteContact(deleteContactReq).pipe(
                map(response => new ScreenContactCore.DeleteContactSuccess(
                    action.token,
                    { contacts: action.payload.contacts }
                )),
                catchError(error => of(new ScreenContactCore.DeleteContactFailed(
                    action.token,
                    action.payload
                ))));
        }));


    @Effect()
    linkedMatterCount$ = this.actions$.pipe(ofType<ScreenContactCore.GetLinkedMattersForContact>(ScreenContactCore.GET_MATTER_COUNT_FOR_CONTACT),
        tap(action => console.log('GET_MATTER_COUNT_FOR_CONTACT')),
        switchMap(action => {
            const mattersForContactReq = new MattersForContactRequest(action.payload.contact.contactId.toString());
            return this.service.getMattersForContact(mattersForContactReq).pipe(
                map(response => new ScreenContactCore.GetLinkedMattersForContactSuccess(
                    action.token,
                    { contact: action.payload.contact, matterList: response.data }
                )),
                catchError(error => of(new ScreenContactCore.GetLinkedMattersForContactFailed(
                    action.token,
                    action.payload
                ))));
        }));


    @Effect()
    removeFromFile$ = this.actions$.pipe(ofType<ScreenContactCore.RemoveContactFromFile>(ScreenContactCore.REMOVE_CONTACT_FROM_FILE),
        tap(action => console.log('EFFECT: REMOVE_CONTACT_FROM_FILE')),
        switchMap(action => {
            const removeContactReq = new RemoveContactFromFileRequest(
                action.payload.appId,
                action.payload.branchId,
                action.payload.fileId,
                action.payload.roleID,
                action.payload.contacts);
            return this.service.removeContactFromFile(removeContactReq).pipe(
                map(response => new ScreenContactCore.RemoveContactFromFileSuccess(
                    action.token,
                    { contacts: action.payload.contacts }
                )),
                catchError(error => of(new ScreenContactCore.RemoveContactFromFileFailed(
                    action.token,
                    action.payload
                ))));
        }));


    @Effect()
    searchTextChange$ = this.actions$.pipe(ofType<ScreenContactCore.ContactScreenViewChange>(ScreenContactCore.CONTACT_SCREEN_VIEW_CHANGE),
        tap((data) => console.log('CONTACT_SCREEN_VIEW_CHANGE SEARCH TEXT')),
        filter(action => action.payload.kind === ViewChangeKind.SearchText),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getContactScreenMatterInfoByToken(action.token)),
                this.store.select(getContactScreenScreenDefinitionByToken(action.token)),
                this.store.select(getContactScreenSearchTypeByToken(action.token)),
                this.store.select(getContactScreenSearchFieldByToken(action.token)),
                this.store.select(getContactScreenSearchFieldValueByToken(action.token)),
                this.store.select(getContactScreenSearchTextByToken(action.token)),
                (matter, screenDef, searchType, searchField, searchFieldValue, searchText) => ({
                    matter, screenDef,
                    searchType, searchField, searchFieldValue, searchText
                })
            ).pipe(
                take(1),
                mergeMap<any, any>(result => {
                    switch (result.searchType) {
                        case ContactSearchType.FILE:
                            return [new ScreenContactCore.SearchContactsOnFile(action.token, {
                                appId: result.matter.AppId.toString(),
                                fileId: result.matter.FileId.toString(),
                                branchId: result.matter.BranchId.toString(),
                                contactTypeId: result.screenDef.contactType.toString(),
                                screenId: result.screenDef.screenNumber.toString(),
                                count: this.MAX_CONTACT_COUNT,
                                searchKeyword: result.searchText
                            })];
                        case ContactSearchType.All:
                        case ContactSearchType.FIELD:
                            return [new ScreenContactCore.SearchAllContacts(action.token, {
                                contactTypeId: result.screenDef.contactType.toString(),
                                count: this.MAX_CONTACT_COUNT,
                                searchField: result.searchField,
                                searchFieldValue: result.searchFieldValue,
                                searchKeyword: result.searchText
                            })];
                    }
                }));
        }));

    @Effect()
    saveSearchFields$ = this.actions$.pipe(ofType<ScreenContactCore.SaveContactSearchFields>
        (ScreenContactCore.SAVE_CONTACT_SEARCH_FIELDS),
        tap((data) => console.log('SAVE_CONTACT_SEARCH_FIELDS')),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getContactScreenMatterInfoByToken(action.token)),
                this.store.select(getContactScreenScreenDefinitionByToken(action.token)),
                this.store.select(getContactScreenDefaultSearchFields(action.token)),
                this.store.select(getContactScreenMappedSearchFields(action.token)),
                (matter, screenDef, defaultfields, mappedFields) => ({ matter, screenDef, defaultfields, mappedFields })
            ).pipe(
                take(1),
                mergeMap((result) => {
                    const defaultFields = result.defaultfields.map(field => {
                        return { ...field, showSearch: field.checked };
                    });
                    const mappedFields = result.mappedFields.map(field => {
                        return { ...field, showSearch: field.checked };
                    });
                    const saveSearchFieldReq = new SaveContactSearchFieldsRequest(
                        result.screenDef.screenDefinitionDto.sD_AppID.toString(),
                        result.screenDef.screenNumber.toString(),
                        defaultFields,
                        mappedFields
                    );
                    return this.service.saveContactSearchFields(saveSearchFieldReq).pipe(
                        map(response => new ScreenContactCore.SaveContactSearchFieldsSuccess(
                            action.token,
                            { defaultFields: defaultFields, mappedFields: mappedFields }
                        )),
                        catchError(error => of(new ScreenContactCore.SaveContactSearchFieldsFailed(
                            action.token,
                            action.payload
                        ))));
                }));
        }));
}






