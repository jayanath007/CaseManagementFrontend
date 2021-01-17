import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Component, OnInit, Inject } from '@angular/core';
@Component({
    selector: 'dps-chaser-popup',
    template: `
        <dps-chaser-content-manager #chaserManager [chaserToken]="data.token" [inputData]="data.input"
        (closePopup)="onClose($event)">
        <dps-chaser-main (chaserSend)="chaserManager.onchaserSend(chaserManager.chaserToken,$event,data.input)"
        (updateSelectedMatterChange)="chaserManager.onMatterDataChange(chaserManager.chaserToken,$event)"
        [fileNo]="chaserManager.fileNo$ | async"
        [menueItems]="chaserManager.menuItems"
        [error]="chaserManager.error$ | async"
        [feeEarnerList]="chaserManager.feeEarnerList$ | async"
        (updateSelectedFeeEarner)="chaserManager.onFeeEarnerChanged(chaserManager.chaserToken,$event)"
        [folderList]="chaserManager.folderList$ | async"
        (updateSelectedFolder)="chaserManager.onFolderChanged(chaserManager.chaserToken,$event)"
        [timeTypeList]="chaserManager.timeTypeList$ | async"
        (updateSelectedTimeType)="chaserManager.onTimeTypeChanged(chaserManager.chaserToken,$event)"
        [fileNoteData]="chaserManager.fileNote$ | async"
        (updateSelectedFileNote)="chaserManager.onFileNoteChanged(chaserManager.chaserToken,$event)"
        [openCasefileData]="chaserManager.openFiles$ | async"
        [loadingMatterList]="chaserManager.loadingMatterList$ | async"
        [unitValue]="chaserManager.unitvalue$ | async"
        (updateSelectedUnitValue)="chaserManager.onUnitValueChanged(chaserManager.chaserToken,$event)"
        (updateSelectedOpenFile)="chaserManager.onOpenFileChanged(chaserManager.chaserToken,$event)"
        (chaserPopupClosed)="chaserManager.onchaserPopupClosed(chaserManager.chaserToken,$event)"
        [chaserDataLoading]="chaserManager.chaserDataLoading$ | async"
        [typeValueDisable]="chaserManager.typeValueDisable$ | async"
        [selectedMatterInfo]="chaserManager.SelectedMatterInfo$ | async"
        [contactMapResponce]="chaserManager.contactMapResponce$ | async"
        [isTimeRecordingEnabled]="chaserManager.isTimeRecordingEnabled$ | async"
        (updateClearData)="chaserManager.onSearchClear(chaserManager.chaserToken,$event)"
        [pageLoadType]="chaserManager.eBillingType$ | async"
        [worktypeList]="chaserManager.workTypeListData$ | async"
        [activitiList]="chaserManager.activitiListData$ | async"
        [phaseList]="chaserManager.phaseListData$ | async"
        [phaseWiseTaskList]="chaserManager.taskListData$ | async"
        [classType]="chaserManager.classType$|async"
        [attTypeList]="chaserManager.attTypeList$|async"
        [section51]="chaserManager.section51$|async"
        [isBulkEntry]="chaserManager.isBulkEntry$|async"
        [noOfEntryBy]="chaserManager.noOfEntryBy$|async"
        [uncharged]="chaserManager.uncharged$ | async"
        [homeCurrency]="chaserManager.homeCurrency$ | async"
        [precedentUnitValue]="chaserManager.precedentUnitValue$ | async"
        [precedentRate]="chaserManager.precedentRate$ | async"
        [precedentValueTotal]="chaserManager.precedentValueTotal$ | async"
        [isMailSending]="chaserManager.isMailSending$ | async"
        [civilClassList]="chaserManager.civilClassList$|async"
        [civilLevelList]="chaserManager.civilLevelList$|async"
        [sentItemIds]="chaserManager.sentItemIds$ | async"
        [subjectPrefixLoading]="chaserManager.subjectPrefixLoading$ | async"
        (updatePrecedentRateValue)="chaserManager.onPrecedentChangeRate(chaserManager.chaserToken,$event)"
        (updatePrecedentUnit)="chaserManager.onUpdatePrecedentUnit(chaserManager.chaserToken,$event)"
        (changeWorkType)="chaserManager.updateWorkType(chaserManager.chaserToken,$event)"
        (changePhase)="chaserManager.updatePhase(chaserManager.chaserToken,$event)"
        (changeTask)="chaserManager.updateTask(chaserManager.chaserToken,$event)"
        (changeActivity)="chaserManager.updateActivity(chaserManager.chaserToken,$event)"
        (matterLinkOutputData)="chaserManager.onMatterLinkOutputData(chaserManager.chaserToken,$event)"
        (changeClassType)="chaserManager.onChangeClassType(chaserManager.chaserToken,$event)"
        (changeAttType)="chaserManager.onChangeCrimeWorkType(chaserManager.chaserToken,$event)"
        (changeSection51)="chaserManager.onChangeSection51(chaserManager.chaserToken,$event)"
        (changeIsBulkEntry)="chaserManager.onChangeIsBulkEntry(chaserManager.chaserToken,$event)"
        (changeNumOfEntries)="chaserManager.onChangeNumOfEntries(chaserManager.chaserToken,$event)"
        (updateChangeUncharged) ="chaserManager.onUpdateUncharged(chaserManager.chaserToken, $event)"
        (changeCivilClass)="chaserManager.onChangeCivilClass(chaserManager.chaserToken, $event)"
        (changeCivilLevel)="chaserManager.onChangeCivilLevel(chaserManager.chaserToken, $event)"
        (loadMatterList)="chaserManager.onloadMatterList(chaserManager.chaserToken,chaserManager.inputData.toRecipients)"
        ></dps-chaser-main>
        </dps-chaser-content-manager>
    `,
    // (loadContactRole)="chaserManager.onloadContactRole(chaserManager.chaserToken)"
    styles: []
})
export class ChaserPopupComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<ChaserPopupComponent>) { }
    ngOnInit() {

    }
    onClose(event) {
        this.dialogRef.close(event);
    }
}
