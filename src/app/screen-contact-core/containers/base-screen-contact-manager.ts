import { ICallbackData } from '../../screen-view-core/models/contact-search-params';
import { Input } from '@angular/core';
import { IScreenDefinition } from '../../screen-view-core/models/screen-definition';
import { ContactScreenItemWrapper, ContactFieldDef } from '../models/interface';
import {
    ContactScreenGridRowChange, RowItemChangeKind,
    ContactScreenRefresh,
    InitContactSearchScreen,
    GetLinkedMattersForContact,
    RemoveContactFromFile,
    GridChangeKind,
    SearchFieldConfigChanged, SearchFieldDiscardChanges, ContactScreenViewChange, SaveContactSearchFields
} from '../actions/core';
import {
    getContactListForCurrentViewByToken,
    getContactScreenPageEventByToken,
    getContactScreenSelectedContactsByToken,
    getContactScreenVisibleSearchFieldsByToken,
    getContactScreenLinkedMatterCountForSelectedContact,
    getContactScreenDefaultSearchFields,
    getContactScreenMappedSearchFields,
    getContactScreenSearchTextByToken, contactSearchIsLoading, contactSearchIsContactsLoading
} from '../reducers';
import { Store } from '@ngrx/store';
// import { getScreenContactSearchTextByToken } from '../index';
import { DeleteContact, ViewChangeKind } from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';
import { getUser } from './../../auth/reducers/index';

export class BaseScreenContactManager {

    @Input() searchParams: ICallbackData;

    constructor(protected store: Store<any>) {

    }

    onChange(token, payload) {
        this.store.dispatch(new InitContactSearchScreen(token, payload));
    }

    onViewChange(token: string, event: any) {
        this.store.dispatch(new ContactScreenViewChange(token, event));
    }

    getVisibleColumnDef(token) {
        return this.store.select(getContactScreenVisibleSearchFieldsByToken(token));
    }

    getCurrentContactList(token) {
        return this.store.select(getContactListForCurrentViewByToken(token));
    }

    getSelectedContacts(token) {
        return this.store.select(getContactScreenSelectedContactsByToken(token));
    }

    getLinkedMatterCountForSelectedContact(token) {
        return this.store.select(getContactScreenLinkedMatterCountForSelectedContact(token));
    }

    getDefaultSearchFields(token) {
        return this.store.select(getContactScreenDefaultSearchFields(token));
    }

    getMappedSearchFields(token) {
        return this.store.select(getContactScreenMappedSearchFields(token));
    }

    deleteContacts(token, contacts: ContactScreenItemWrapper[]) {
        this.store.dispatch(new DeleteContact(token, { contacts }));
    }

    fetchLinkedMatters(token, contact: ContactScreenItemWrapper) {
        this.store.dispatch(new GetLinkedMattersForContact(token, { contact }));
    }

    applySearchFieldChanges(token, fieldDef: ContactFieldDef) {
        this.store.dispatch(new SearchFieldConfigChanged(token, { searchField: fieldDef }));
    }

    discardSearchFieldChanges(token) {
        this.store.dispatch(new SearchFieldDiscardChanges(token, null));
    }

    saveSearchFields(token) {
        this.store.dispatch(new SaveContactSearchFields(token, null));
    }

    getSearchText(token) {
        return this.store.select(getContactScreenSearchTextByToken(token));
    }

    getPageEventByToken(token) {
        return this.store.select(getContactScreenPageEventByToken(token));
    }

    removeContactFromFile(token, matterInfo: MatterInfo, screenDef: IScreenDefinition, contacts: ContactScreenItemWrapper[]) {
        this.store.dispatch(new RemoveContactFromFile(token, {
            appId: matterInfo.AppId.toString(),
            branchId: matterInfo.BranchId.toString(),
            fileId: matterInfo.FileId.toString(),
            roleID: screenDef.contactType.toString(),
            contacts: contacts
        }));
    }

    getIsContactsLoading(token) {
        return this.store.select(contactSearchIsContactsLoading(token));
    }

    getIsLoading(token) {
        return this.store.select(contactSearchIsLoading(token));
    }

    getAuthUser() {
        return this.store.select(getUser);
    }

}
