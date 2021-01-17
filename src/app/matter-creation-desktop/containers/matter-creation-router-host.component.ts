
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InputData } from '../../matter-creation-core';


@Component({
    selector: 'dps-matter-creation-router-host',
    template: `
        <dps-matter-creation-manager #matterCreationManager
         [matterCreationToken]="data.token" [inputData]="data.input"
        (closePopup)="onClose($event)">
        <dps-matter-creation-main-layout
        [matterCreationToken]="data.token"
        [timeOffset]="(matterCreationManager.user$ | async).general.dateTimeOffset"
        [metaData]="(matterCreationManager.screenEditComponentTreeData$ | async)"
        [matterModelData]="(matterCreationManager.matterModel$ | async)"
        [branchIDList]="(matterCreationManager.branchList$| async)"
        [feeEarnerList]="(matterCreationManager.feeEarnerList$| async)"
        [supervisorList]="(matterCreationManager.supervisorList$| async)"
        [appCodeList]="(matterCreationManager.appCodeList$| async)"
        [matterDepartmentList]="(matterCreationManager.matterDepartmentList$| async)"
        [matterRateCategoryList]="(matterCreationManager.rateCategoryList$| async)"
        [trusAccNoList]="(matterCreationManager.trusAccNoList$| async)"
        [matterInterestSchemeList]="(matterCreationManager.matterInterestSchemeList$| async)"
        [matterIntroductionList]="(matterCreationManager.introductionList$| async)"
        [relatedDocumentsPageEvent]="(matterCreationManager.relatedDocumentsPageEvent$| async)"
        [documentRegistriesGridData]="(matterCreationManager.documentRegistriesGridData$| async)"
        [laMatterTypesList]="(matterCreationManager.laMatterTypesList$| async)"
        [matterType1List]="(matterCreationManager.matterType1List$| async)"
        [matterType2List]="(matterCreationManager.matterType2List$| async)"
        [lscDate]="matterCreationManager.lscDate$| async"
        [isInit]="matterCreationManager.isInit$| async"
        [mode]="matterCreationManager.mode$| async"
        [isModelDirty]="matterCreationManager.isModelDirty$| async"
        [closeMatterCreation]="matterCreationManager.closeMatterCreation$| async"
        [showConflictSearch]="matterCreationManager.showConflictSearch$| async"
        [caseStageLevelList]="(matterCreationManager.caseStageLevelList$| async)"
        [stageReachedList]="(matterCreationManager.stageReachedList$| async)"
        [creditControlStageList]="(matterCreationManager.creditControlStageList$| async)"
        [sundryProfitCostList]="(matterCreationManager.sundryProfitList$| async)"
        [defaultDDABankList]="(matterCreationManager.ddaBankList$| async)"
        [outcomeList]="(matterCreationManager.outcomeList$| async)"
        [criteriaList]="(matterCreationManager.criteriaList$| async)"
        [isLoading]="matterCreationManager.isLoading$| async"
        [matterIndex]="matterCreationManager.matterIndex$| async"
        [closerProcessing]="matterCreationManager.closerProcessing$| async"
        [matterSeatchList]="matterCreationManager.matterSeatchList$| async"
        [originalModel]="matterCreationManager.originalModel$| async"
        [feeEarnerIsUser]="matterCreationManager.feeEarnerIsUser$| async"
        [authUser]="matterCreationManager.user$|async"
        [confirmBeforeOpenCase]="matterCreationManager.confirmBeforeOpenCase$|async"
        (updateSelectedMatterData)="matterCreationManager.onUpdateSelectedMatterData($event)"
        [useFileSecurity]="matterCreationManager.useFileSecurity$ | async"
        [menuItem]="matterCreationManager.menuItem$|async"
        (valueChangedData)="matterCreationManager.onValueChanged($event)"
        (updateClient1)="matterCreationManager.onUpdateClient1($event)"
        (updateClient2)="matterCreationManager.onUpdateClient2($event)"
        (addMatter)="matterCreationManager.onMattereAdd()"
        (clearMatter)="matterCreationManager.onMattereClear()"
        (deleteMatter)="matterCreationManager.onMattereDelete($event)"
        (saveMatter)="matterCreationManager.onMattereSave($event)"
        (getLeadUFN)="matterCreationManager.onGetLeadUFN($event)"
        (gotoOpenCase)="matterCreationManager.onGotoOpenCase($event)"
        (getFileIsLocked)="matterCreationManager.onGetFileIsLocked($event)"
        (getLegalAidCombosList)="matterCreationManager.onGetLegalAidCombosList($event)"
        (onCloserProcessing)="matterCreationManager.onCloserProcessing($event)"
        (writeOffNegativeWip)="matterCreationManager.onWriteOffNegativeWip($event)"
        (getLAMatterTypesAvailable)="matterCreationManager.onGetLAMatterTypesAvailable($event)"
        (checkOutstandingUndertakings)="matterCreationManager.onCheckOutstandingUndertakings($event)"
        (chengeIsCompletionNegWOEnabled)="matterCreationManager.onChengeIsCompletionNegWOEnabled($event)"
        (updateCompletionFields)="matterCreationManager.onUpdateCompletionFields($event)"
        (popupClosed)="matterCreationManager.onPopupClosed($event)"
        (pageChange)="matterCreationManager.onPageChange(data.token,$event)"
        (addClient)="matterCreationManager.addClient($event)"
        (removeClient)="matterCreationManager.onRemoveClient($event)"
        (promoteClient)="matterCreationManager.onPromoteClient($event)">
        </dps-matter-creation-main-layout>
        </dps-matter-creation-manager>
    `,
    styles: []
})

export class MaterCreationRouterHostComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: InputData, token: string },
        public dialogRef: MatDialogRef<MaterCreationRouterHostComponent>) { }

    ngOnInit() {

    }
    onClose(event) {
        this.dialogRef.close(event);
    }
}
