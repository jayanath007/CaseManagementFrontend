import {
    GetFullClientData, UpdateClient, AddClient, ClearClientData, DeleteClient,
    AddUpdateClient, GetScreenLookupData, AddNewNote, PrefillLetterAndContactName,
    ChangeNote, DeleteNote, CancelNoteChanges, UploadDocument, CopyFromCorrespondence,
    ClientTypeComboChanged, PrivateIndividual, GetFullClientDataGridParams, UpdateSelectedMater,
    DeleteDocumentNote,
    ClientLoadDocument,
    CoppyAndOpenMatter,
    SwitchAmlAndClientSave,
    ChangeRiskAssessmentQuation,
    AddUpdateRiskAssessment,
    ClientValidationPopup,
    ChangeMatterPage
} from '../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentBase } from '../../core/lib/component-base';
import { InitScreenEdit, getScreenEditComponentTreeDataByToken } from '../../screen-edit-core';
import {
    getInitDataModel, getIsLoading, getClientModel, getClientSeatchList,
    getClientIndex, getIsModelDirtyByToken, getModeByToken, getShowConflictSearch,
    getTypeChangeControllers, getIsDocumentUploading,
    getPopupClosedToken, getSelectedMatterIdByToken, getIsCrimeTabVisibilityToken,
    getIsProofOfIDUploadToken, getIsProofOfAddressUploadToken, getIsCompanyProof1UploadToken,
    getIsCompanyProof2UploadToken, getMatterPaginationDef, getClientMattersTotal
} from '../reducers/index';
import { getGeneralAllMenueItems } from './../../layout-desktop/reducers/index';
import { InitClientCreation } from '../actions/core';
import { Mode } from '../../core';
import { Client, ClientRiskAssessmentQuestion } from '../models/interfaces';
import { ExitClientSearchPopup } from '../../client-search-core/actions/core';
import { getHomeCurrency } from '../../setting-core';
import { UploadDocumentType } from '../models/enums';
import { getUser } from './../../auth';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../../auth';
import { PaginatorDef } from '../../core/lib/grid-model';

export class BaseClientCreationManager extends ComponentBase {

    public screenEditComponentTreeData$: any;
    public initDataModel$: any;
    public clientModel$: any;
    public isLoading$: any;
    public isDocumentUploading$: any;
    public clientSeatchList$: any;
    public clientIndex$: any;
    public showConflictSearch$: any;
    public isModelDirty$: any;
    public mode$: any;
    public typeChangedControllersModel$: any;
    public popupClosed$: any;
    public homeCurrency$: any;
    public isCrimeTabVisibility$: any;
    public isProofOfIDUpload$: any;
    public isProofOfAddressUpload$: any;
    public isCompanyProof1Upload$: any;
    public isCompanyProof2Upload$: any;
    public menuItem$: any;
    public user$: Observable<User>;
    public matterPaginatorDef$: any;
    public clientMattersTotal$: any;


    public selectedMatterId$: any;

    @Output() closePopup = new EventEmitter();

    constructor(protected store: Store<any>) {
        super();
    }
    protected initSelectors(myToken: string, inputData: any) {
        this.user$ = this.store.select(getUser);
        this.store.dispatch(new InitScreenEdit('client_creation',
            {
                type: 'Client'
            }));
        this.menuItem$ = this.store.select(getGeneralAllMenueItems);
        this.user$.pipe(take(1)).subscribe(user => {
            if (inputData) {
                if (inputData.matter || inputData.clientId) {
                    this.store.dispatch(new InitClientCreation(myToken, {
                        mode: Mode.EditMode, userBranchId: user.general.userBranchId,
                        caseFileIdentity: inputData.matter ? {
                            fileId: inputData.matter ? inputData.matter.FileId : null,
                            appId: inputData.matter ? inputData.matter.AppId : null,
                            branchId: inputData.matter ? inputData.matter.BranchId : null,
                        } : null
                    }));
                    this.store.dispatch(new GetFullClientData(myToken,
                        {
                            matter: inputData.matter, clientId: inputData.clientId,
                            clientSeatchList: inputData.clientSeatchList, clientIndex: inputData.clientIndex
                        }));
                } else {
                    this.store.dispatch(new InitClientCreation(myToken, {
                        mode: Mode.SearchMode,
                        userBranchId: user.general.userBranchId,
                        caseFileIdentity: null
                    }));
                    this.store.dispatch(new UpdateClient(myToken, { property: 'clientRef', value: inputData.clientReference }));
                    this.store.dispatch(new UpdateClient(myToken, { property: 'clientName', value: inputData.clientName }));
                    this.store.dispatch(new UpdateClient(myToken, { property: 'branchID', value: inputData.branchID }));
                }
            } else {
                this.store.dispatch(new InitClientCreation(myToken, {
                    mode: Mode.SearchMode, userBranchId: user.general.userBranchId,
                    caseFileIdentity: null
                }));
            }
        });

        this.screenEditComponentTreeData$ = this.store.select(getScreenEditComponentTreeDataByToken('client_creation'));
        // getIsLoading
        this.initDataModel$ = this.store.select(getInitDataModel);
        this.isLoading$ = this.store.select(getIsLoading(myToken));
        this.isDocumentUploading$ = this.store.select(getIsDocumentUploading(myToken));
        this.clientModel$ = this.store.select(getClientModel(myToken));
        this.clientIndex$ = this.store.select(getClientIndex(myToken));
        this.clientSeatchList$ = this.store.select(getClientSeatchList(myToken));
        this.showConflictSearch$ = this.store.select(getShowConflictSearch(myToken));
        this.popupClosed$ = this.store.select(getPopupClosedToken(myToken));
        this.isModelDirty$ = this.store.select(getIsModelDirtyByToken(myToken));
        this.mode$ = this.store.select(getModeByToken(myToken));
        this.typeChangedControllersModel$ = this.store.select(getTypeChangeControllers(myToken));
        this.selectedMatterId$ = this.store.select(getSelectedMatterIdByToken(myToken));
        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.isCrimeTabVisibility$ = this.store.select(getIsCrimeTabVisibilityToken(myToken));
        this.isProofOfIDUpload$ = this.store.select(getIsProofOfIDUploadToken(myToken));
        this.isProofOfAddressUpload$ = this.store.select(getIsProofOfAddressUploadToken(myToken));
        this.isCompanyProof1Upload$ = this.store.select(getIsCompanyProof1UploadToken(myToken));
        this.isCompanyProof2Upload$ = this.store.select(getIsCompanyProof2UploadToken(myToken));
        this.matterPaginatorDef$ = this.store.select(getMatterPaginationDef(myToken));
        this.clientMattersTotal$ = this.store.select(getClientMattersTotal(myToken));
    }
    onPopupClosed(event, token) {
        this.closePopup.emit(event);
        this.store.dispatch(new ExitClientSearchPopup(token));
    }
    onPopupCancel(event, token) {
        this.closePopup.emit(event);
        // this.store.dispatch(new ExitClientSearchPopup(token));
    }
    onUpdateSelectedClientData(token, event) {
        this.store.dispatch(new GetFullClientData(token, event));
    }


    onDeleteClient(value, token: string) {
        this.store.dispatch(new DeleteClient(token, { clientId: value }));
        // alert(event);
        //  this.store.dispatch(new GetFullClientData(token, event));
    }

    onGridRowDeleteClick(row, token: string) {
        this.store.dispatch(new DeleteDocumentNote(token, { row: row }));
        // super.onGridRowDeleteClick(this.clientCreationToken, gridObj);
    }


    onGridRowClick(row, token: string) {
        // this.store.dispatch(new ClientLoadDocument(token, { row: row }));
    }

    onDocumentGridRowClick(data, token: string) {
        this.store.dispatch(new ClientLoadDocument(token, { row: data.row }));
    }



    onMaterGridRowClick(token, event) {
        this.store.dispatch(new UpdateSelectedMater(token, { selectedMatterId: event }));
    }


    onConflictSerachClosed(token, clientId) {
        this.store.dispatch(new GetFullClientDataGridParams(token, { clientId: clientId, gridPara: ['ClientEvents'] }));
    }

    clientOpenMatterClick() {

        alert('ssss');

    }

    onValueChanged(token, event: { controllerType: string, model: string, value }) {
        this.store.dispatch(new UpdateClient(token, { property: event.model, value: event.value }));
    }
    onLastNameChange(token) {
        this.store.dispatch(new PrefillLetterAndContactName(token, null));
    }
    onCopyFromCorrespondence(token) {
        this.store.dispatch(new CopyFromCorrespondence(token, null));
    }
    onPrivateIndividualValueChanged(token, event: { controllerType: string, model: string, value }) {
        this.store.dispatch(new PrivateIndividual(token, { property: event.model, value: event.value }));
    }
    onClientAdd(token) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new AddClient(token, { timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }
    onClientSave(token, event: any) {
        this.store.dispatch(new AddUpdateClient(token, { clientModel: event.data, withClose: event.close }));
        // this.store.dispatch(new SwitchAmlAndClientSave(token, { clientModel: event.data, withClose: event.close, onlyAml: false }));
    }
    onClientOk(token) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new AddClient(token, { timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }
    onClientClear(token) {
        this.store.dispatch(new ClearClientData(token));
    }
    onClientDelete(token, event: Client) {
        //  this.store.dispatch(new DeleteClient(token,
        //   { appID: event., ClientRef: event.cl, fileID: event.fileID, branchID: event.branchID }));
    }
    onLookupUpdateData(token, lookupType) {
        this.store.dispatch(new GetScreenLookupData(token, lookupType));
    }
    onPageChange(token, event) {
        //  this.store.dispatch(new RelatedDocumentsGridPageEventChange(token, { pageEvent: event }));
    }
    onMattereSave(token, eventabc: Client) {
        // this.store.dispatch(new AddUpdateClient(token, eventabc));
    }
    onGetLeadUFN(token, event: { fileID: number, branchID: number }) {
        // this.store.dispatch(new GetLeadUFN(token, event));
    }
    onCloserProcessing(token, event) {
        //     this.store.dispatch(new GetCloserProcessing(token, { matterRef: event }));
    }
    onWriteOffNegativeWip(token, event) {
        //   this.store.dispatch(new WriteOffNegativeWip(token, { matterRef: event }));
    }
    onChengeIsCompletionNegWOEnabled(token, event) {
        //  this.store.dispatch(new ChengeIsCompletionNegWOEnabled(token, event));
    }
    onUpdateCompletionFields(token, event) {
        //    this.store.dispatch(new UpdateCompletionFields(token, event));
    }
    onGetLAMatterTypesAvailable(token, event) {
        //    this.store.dispatch(new GetLAMatterTypesAvailable(token, event));
    }
    onUpdateSelectedlientData(token, event) {
        this.store.dispatch(new GetFullClientData(token, event));
    }
    onClientTypeChange(token, code) {
        this.store.dispatch(new ClientTypeComboChanged(token, code));
    }
    // Note
    onAddNewNote(noteBy, token) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new AddNewNote(token, { noteBy, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }
    onChangeNote(event: { kind: string, row: number; value: any }, token: string) {
        this.store.dispatch(new ChangeNote(token, event));
    }
    onDeleteNote(row: number, token: string) {
        this.store.dispatch(new DeleteNote(token, { row: row }));
    }
    onCancelChanges(token: string) {
        this.store.dispatch(new CancelNoteChanges(token));
    }

    onCoppyAndOpenMatter(token: string, eventData: { clientId: number, matterId: number }) {
        this.store.dispatch(new CoppyAndOpenMatter(token, eventData));
    }

    onUploadDoc(data: {
        file: File, note: string, clientId: number, clientRef: string,
        uploadDocumentType: UploadDocumentType
    }, token: string) {
        this.store.dispatch(new UploadDocument(token,
            {
                file: data.file, note: data.note, clientId: data.clientId,
                clientRef: data.clientRef,
                uploadDocumentType: data.uploadDocumentType
            }));
    }
    onAMLSaveData(token, event) {
        // cooment becase of validation form
        // this.store.dispatch(new AMLCheckForClient(token, {
        //     clientModel: event.data,
        //     isAMLShow: event.isAMLShow,
        //     gridPara: ['ClientEvents'],
        //     withClose: event.close,
        //     addUpdateClientResult: null,
        //     isAMLNeedToCheck: true
        // }));
        // this.store.dispatch(new ClientValidationPopup(token, { clientModel: event.data, withClose: event.close }));
        this.store.dispatch(new SwitchAmlAndClientSave(token, { clientModel: event.data, withClose: event.close, onlyAml: true }));
    }

    onChangeRiskAssessmentQuation(token: string, item: ClientRiskAssessmentQuestion) {
        this.store.dispatch(new ChangeRiskAssessmentQuation(token, item));
    }

    onSumbimtRiskAsse(token: string) {
        this.store.dispatch(new AddUpdateRiskAssessment(token));
    }


    onMatterGridPageChange(paginatorDef: PaginatorDef, token: string) {
        this.store.dispatch(new ChangeMatterPage(token, paginatorDef));
    }

}
