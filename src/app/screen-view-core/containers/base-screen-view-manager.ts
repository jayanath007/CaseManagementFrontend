import {
    getMatterDetailsByToken, getContactSearchContactDirty, getContactSearchContactsOnFile, getContactSearchEnableSaving,
    getContactSearchCurrentContactId, getContactSearchScreenControlValuesisDirty, getContactSearchDsiableSearchButtonsStatus
} from '../reducers';
import {
    FormViewChange, ViewChangeKind, InitScreenView,
    IsFormDataLoading, InitScreenViewPopup, InitialDatainforUpdateLoading,
    SetCurrentContactId, RefreshContactOnFlag, SetNewVarValues, ClearFormData, SetContactDirtyState, SetEnableContactSaving,
    SetContactsOnFile,
    SetScreenControlValuesDirtyState,
    ScreenTabLogicUpdate,
    SetDisableSearchButtons,
    ScreenViewUploadAtachment,

} from '../actions/core';
import { Store } from '@ngrx/store';
import {
    getCurentFormViewDataByToken, getScreenViewStateByToken,
    getScreenViewStatus, getMainState, getInitialInfor, getLoadForm,
} from '..';
import { ScreenViewInitials } from '../../core/lib/screen-view';
import { ShowUserScreen, IVarValue } from '../../workflow-core';
import { UnlinkContact, ResetContactList } from '../../screen-contact-core/actions/core';
import { getUser } from './../../auth/reducers/index';

export class BaseScreenViewManager {


    public curentFormView$: any;
    public screenViewState$: any;
    public screenContanerComponentList$: any;
    public screenDefinition$: any;
    public screenViewStatus$: any;
    public mainStateData$: any;
    public initialInforData$: any;
    public formviewData$: any;
    public matterDetails$: any;
    public contactDirty$: any;
    public contactsOnFile$: any;
    public enableSaving$: any;
    public currentContactId$: any;
    public screenControlValuesisDirty$: any;
    public disableSearchButtons$: any;
    // public removeCurrentContact$: any;

    constructor(protected store: Store<any>) {

    }

    OnInit(token, payload: ScreenViewInitials) {
        this.store.dispatch(new InitScreenView(token, payload));
    }

    onInitScreenViewPopup(token) {
        this.store.dispatch(new InitScreenViewPopup(token));
        this.initSelectors(token);
    }

    onFormViewChange(token: string, value: { kind: ViewChangeKind.GoToNext, value: ShowUserScreen }) {
        this.store.dispatch(new FormViewChange(token, value));
    }

    onFormDataLoading(token: string, value: boolean) {
        this.store.dispatch(new IsFormDataLoading(token, { value }));
    }

    onUpdateTabLogic(token: string, value: boolean) {
        this.store.dispatch(new ScreenTabLogicUpdate(token, { value }));
    }


    onSetCurrentContactId(token: string, contactId: number) {
        this.store.dispatch(new SetCurrentContactId(token, { contactId: contactId }));
    }

    onRefreshContactOnFlag(token: string) {
        this.store.dispatch(new RefreshContactOnFlag(token, null));
    }

    onNewVarValues(token: string, event: { varValues: IVarValue[], focusContainerName: string }) {
        this.store.dispatch(new SetNewVarValues(token, {
            varValues: event.varValues,
            focusContainerName: event.focusContainerName
        }));
    }

    onClearFormData(token: string) {
        this.store.dispatch(new ClearFormData(token, null));
    }

    onContactDirty(token: string, isDirty: boolean) {
        this.store.dispatch(new SetContactDirtyState(token, { isDirty }));
    }

    onScreenControlValuesDirty(token: string, isDirty: boolean) {
        this.store.dispatch(new SetScreenControlValuesDirtyState(token, { isDirty }));
    }

    onEnableSaving(token: string, enableSaving: boolean) {
        this.store.dispatch(new SetEnableContactSaving(token, { enableSaving }));
    }

    onIncrementContactsOnFile(token: string) {
        this.store.dispatch(new SetContactsOnFile(token, { increment: true }));
    }

    onDecrementContactsOnFile(token: string) {
        this.store.dispatch(new SetContactsOnFile(token, { increment: false }));
    }

    onUnlinkContact(token: string, contactId) {
        this.store.dispatch(new UnlinkContact(token, { contactId }));
    }

    onResetContactList(token: string) {
        this.store.dispatch(new ResetContactList(token, null));
    }

    onDisableSearchButtons(token: string, disableSearchButtons: boolean) {
        this.store.dispatch(new SetDisableSearchButtons(token, { disableSearchButtons }));
    }

    onAtachmentUpload(token: string, event: any) {
        this.store.dispatch(new ScreenViewUploadAtachment(token, event));
    }

    protected initSelectors(token: string) {
        this.screenViewState$ = this.store.select(getScreenViewStateByToken(token));
        this.curentFormView$ = this.store.select(getCurentFormViewDataByToken(token));
        this.screenViewStatus$ = this.store.select(getScreenViewStatus(token));
        this.mainStateData$ = this.store.select(getMainState(token));
        this.initialInforData$ = this.store.select(getInitialInfor(token));
        this.formviewData$ = this.store.select(getLoadForm(token));
        this.matterDetails$ = this.store.select(getMatterDetailsByToken(token));
        this.contactDirty$ = this.store.select(getContactSearchContactDirty(token));
        this.contactsOnFile$ = this.store.select(getContactSearchContactsOnFile(token));
        this.currentContactId$ = this.store.select(getContactSearchCurrentContactId(token));
        this.enableSaving$ = this.store.select(getContactSearchEnableSaving(token));
        this.screenControlValuesisDirty$ = this.store.select(getContactSearchScreenControlValuesisDirty(token));
        this.disableSearchButtons$ = this.store.select(getContactSearchDsiableSearchButtonsStatus(token));
        // this.removeCurrentContact$ = this.store.select(getContactSearchRemoveCurrentContact(token));
        // this.screenContanerComponentList$ = this.store.select(getCurentFormScreenContanerComponentList(token));
        // this.screenDefinition$ = this.store.select(getCurentFormScreenDefinition(token));
    }


}
