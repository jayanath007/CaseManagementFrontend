import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
    selector: 'dps-client-creation-router-host',
    template: `
    <dps-client-creation-manager #clientCreationManager [clientCreationToken]="data.token" [inputData]="data.input"
    (closePopup)="onClose($event)">
    <dps-client-creation-main-layout
    [user]="clientCreationManager.user$|async"
    [metaData]="(clientCreationManager.screenEditComponentTreeData$ | async)"
    [isLoading]="(clientCreationManager.isLoading$ | async)"
    [isDocumentUploading]="(clientCreationManager.isDocumentUploading$ | async)"
    [mode]="(clientCreationManager.mode$ | async)"
    [isModelDirty]="(clientCreationManager.isModelDirty$ | async)"
    [initDataModel]="(clientCreationManager.initDataModel$| async)"
    [clientModelData]="(clientCreationManager.clientModel$ | async)"
    [clientSeatchList]="clientCreationManager.clientSeatchList$| async"
    [clientIndex]="clientCreationManager.clientIndex$ | async"
    [showConflictSearch]="clientCreationManager.showConflictSearch$ | async"
    [onpopupClosed]="clientCreationManager.popupClosed$ | async"
    [typeChangedControllersModel]="clientCreationManager.typeChangedControllersModel$ | async"
    [homeCurrency]="clientCreationManager.homeCurrency$ | async"
    [isCrimeTabVisibility]="clientCreationManager.isCrimeTabVisibility$ | async"
    [isProofOfIDUpload]="clientCreationManager.isProofOfIDUpload$ | async"
    [isProofOfAddressUpload]="clientCreationManager.isProofOfAddressUpload$ | async"
    [isCompanyProof1Upload]="clientCreationManager.isCompanyProof1Upload$ | async"
    [isCompanyProof2Upload]="clientCreationManager.isCompanyProof2Upload$ | async"
    [menuItem]="clientCreationManager.menuItem$|async"
    [matterPaginatorDef]="clientCreationManager.matterPaginatorDef$|async"
    [clientMattersTotal]="clientCreationManager.clientMattersTotal$|async"
    (lookupUpdateData)="clientCreationManager.lookupUpdateData($event)"
    (valueChangedData)="clientCreationManager.onValueChanged($event)"
    (clientAdd)="clientCreationManager.onClientAdd(data.token)"
    (clientSave)="clientCreationManager.onClientSave($event)"
    (clientOk)="clientCreationManager.onClientOk(data.token)"
    (gridRowClick)="clientCreationManager.onGridRowClick($event,data.token)"
    (documentGridRowClick)="clientCreationManager.onDocumentGridRowClick($event,data.token)"
    (gridRowDeleteClick)="clientCreationManager.onGridRowDeleteClick($event,data.token)"
    (popupClosed)="clientCreationManager.onPopupClosed($event, data.token)"
    (popupCancel)="clientCreationManager.onPopupCancel($event,data.token)"
    (clientClearClick)="clientCreationManager.onClientClear(data.token)"
    (lastNameChanged)="clientCreationManager.onLastNameChange()"
    (aMLSaveData)="clientCreationManager.onAMLSaveData($event,data.token)"
    (copyFromCorrespondence)="clientCreationManager.onCopyFromCorrespondence()"
    (privateIndividualValueChanged)="clientCreationManager.onPrivateIndividualValueChanged($event)"
    (deleteClient)="clientCreationManager.onDeleteClient($event,data.token)"
    (addNewNote)="clientCreationManager.onAddNewNote($event,data.token)"
    (updateSelectedClientData)="clientCreationManager.onUpdateSelectedlientData($event)"
    (clientTypeChangeValue)="clientCreationManager.onClientTypeChange($event)"
    (changeNote)="clientCreationManager.onChangeNote($event, data.token)"
    (deleteNote)="clientCreationManager.onDeleteNote($event,data.token)"
    (cancelChanges)="clientCreationManager.onCancelChanges(data.token)"
    (conflictSerachClosed)="clientCreationManager.onConflictSerachClosed(data.token,$event)"
    (coppyAndOpenMatter)="clientCreationManager.onCoppyAndOpenMatter(data.token,$event)"
    (materGridRowClick)="clientCreationManager.onMaterGridRowClick(data.token,$event)"
    (uploadDocument)="clientCreationManager.onUploadDoc($event,data.token)"
    (changeRiskAssessmentQuation)="clientCreationManager.onChangeRiskAssessmentQuation(data.token, $event)"
    (sumbimtRiskAsse)="clientCreationManager.onSumbimtRiskAsse(data.token)"
    (matterGridPageChange)="clientCreationManager.onMatterGridPageChange($event,data.token)">
    </dps-client-creation-main-layout>
    </dps-client-creation-manager>
    `,
    styles: []
})
export class ClientCreationRouterHostComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<ClientCreationRouterHostComponent>) { }

    ngOnInit() {

    }
    onClose(event) {
        this.dialogRef.close(event);
    }
}

