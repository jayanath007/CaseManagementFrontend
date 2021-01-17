
import { map, filter, take, switchMap, share, tap } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AddNoteInPutData } from '../../core/lib/addNote';
import { InforDialogComponent } from '../../shared/components/infor-dialog/infor-dialog.component';
import { InforDialogData, InforDialogResult } from '../../shared/models/dialog';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';





import { AddNoteService } from '../../add-note-core/services/add-note.service';
import { Store } from '@ngrx/store';



@Component({
  selector: 'dps-add-note-popup',
  template: `
  <dps-add-note-manager [inputData]="data.input" [token]="data.token" (closePopup)="onClose($event)" #manager>
  <mat-progress-bar *ngIf="!isEnable$ | async"  mode="indeterminate"></mat-progress-bar>
  <dps-add-note-layout *ngIf="isEnable$ | async" [AddNoteSuccessInfo]="manager.addNoteSuccessInfo$ | async"
  [token]="data.token"
  [isShowTimeAndCost]="manager.isShowTimeAndCost$ | async" [homeCurrency]="manager.homeCurrency$ | async"
  [fileUploadDisable]="manager.fileUploadDisable$ | async" [isDiaryTypeDisable]="manager.isDiaryTypeDisable$ | async"
  [feeEarnerList]="manager.feeEarnerList$ | async"
  [sendForSignatureToList]="manager.sendForSignatureToList$ | async"
  [folderList]="manager.folderList$ | async"
  [diaryTypeList]="manager.diaryTypeList$ | async"
  [actionTypeList]="manager.actionTypeList$ | async"
  [userGradeList]="manager.userGradeList$ | async"
  [addNodeHeaderText]="manager.addNodeHeaderText$ | async"
  [note]="manager.note$ | async"
  [itemDataList]="manager.itemDataList$ | async"
  [password]="manager.password$ | async"
  [uncharged]="manager.uncharged$ | async"
  [dateDone]="manager.dateDone$ | async"
  [rate]="manager.rate$ | async"
  [unit]="manager.unit$ | async"
  [fileNoteValue]="manager.fileNoteValue$ | async"
  [extraRate]="manager.extraRate$ | async"
  [extraUnit]="manager.extraUnit$ | async"
  [extraValue]="manager.extraValue$ | async"
  [extraTimeType]="manager.extraTimeType$ | async"
  [addNoteValidation]="manager.addNoteValidation$ | async"
  [loading]="manager.loading$ | async"
  [itemsLoading]="manager.itemsLoading$ | async"
  [isDirty]="manager.isDirty$ | async"
  [multipleFileList]="manager.multipleFileList$ | async"
  [isEdit]="manager.isEdit$ | async"
  [sendForSignature]="manager.sendForSignature$ | async"
  [timeUseFeeEarnerRatesValueDisable]="manager.timeUseFeeEarnerRatesValueDisable$ | async"
  [dpsSignDetails]="(manager.user$|async)?.general?.signature"
  [companyCode]="(manager.user$ | async)?.general?.companyCode"
  [timeZone]="(manager.user$ | async)?.userTimeZone?.info.alias"
  [classType]="manager.classType$|async"
  [attTypeList]="manager.attTypeList$|async"
  [section51]="manager.section51$|async"
  [isBulkEntry]="manager.isBulkEntry$|async"
  [noOfEntryBy]="manager.noOfEntryBy$|async"
  [pageLoadType]="manager.eBillingType$ | async"
  [worktypeList]="manager.workTypeListData$ | async"
  [activitiList]="manager.activitiListData$ | async"
  [phaseList]="manager.phaseListData$ | async"
  [phaseWiseTaskList]="manager.taskListData$ | async"
  [isTelephoneAdv]="manager.isTelephoneAdv$|async"
  [matterData]="manager.inputData?.matterData"
  [selectedLinkMatters]="manager.selectedLinkMatters$|async"
  [isBilled]="manager.isBilled$|async"
  [retrySignature]=""
  [viewingInlineAttachement]="manager.viewingInlineAttachement$|async"
  [civilClassList]="manager.civilClassList$|async"
  [civilLevelList]="manager.civilLevelList$|async"
  [civilCourtList]="manager.civilCourtList$|async"
  (changeWorkType)="manager.updateWorkType($event)"
  (changePhase)="manager.updatePhase($event)"
  (changeTask)="manager.updateTask($event)"
  (changeActivity)="manager.updateActivity($event)"
  (close)="manager.onClose(manager.myToken, $event)"
  (changeFileData)="manager.onFileUpladed(manager.myToken, $event)"
  (updateSelectedFolder) ="manager.onFolderChanged(manager.myToken, $event)"
  (updateSelectedAction) ="manager.onActionChanged(manager.myToken, $event)"
  (updateSelectedFeeErner) ="manager.onFeeEarnerChanged(manager.myToken, $event)"
  (addNoteSubmit)="manager.onAddNoteSubmit($event)"
  (updateSelectedType) ="manager.onDiaryTypeChange(manager.myToken, $event)"
  (upateSelectedDate) ="manager.onDateDoneChange(manager.myToken, $event)"
  (updateSelectedUserGrade) ="manager.onUpdateSelectedUserGrade(manager.myToken, $event)"
  (updateNote) ="manager.onChangeNote(manager.myToken, $event)"
  (updatePassword) ="manager.onUpdatePassword(manager.myToken, $event)"
  (updateFolderOnAttachment) ="manager.onUpdateFolderOnAttachment(manager.myToken, $event)"
  (updateNoteOnAttachment) ="manager.onUpdateNoteOnAttachment(manager.myToken, $event)"
  (updateIsAttcheOnAttachment) ="manager.onUpdateIsAttcheOnAttachment(manager.myToken, $event)"
  (updateIsUnchargeOnAttachment) ="manager.onUpdateIsUnchargeOnAttachment(manager.myToken, $event)"
  (updateChangeUncharged) ="manager.onUpdateUncharged(manager.myToken, $event)"
  (updateRate) ="manager.onUpdateRate(manager.myToken, $event)"
  (updateUnit) ="manager.onUpdateUnit(manager.myToken, $event)"
  (updateExtraRate) ="manager.onUpdateExtraRate(manager.myToken, $event)"
  (updateExtraUnit) ="manager.onUpdateExtraUnit(manager.myToken, $event)"
  (updateSelectedExtraTime) ="manager.onUpdateSelectedExtraTime(manager.myToken, $event)"
  (openAttachment)="manager.onOpenAttachment(manager.myToken,$event)"
  (sendForSignatureChange)="manager.onSendForSignatureChange($event)"
  (sendForSignatureToChange)="manager.onSendForSignatureToChange($event)"
  (changeClassType)="manager.onChangeClassType($event)"
  (changeAttType)="manager.onChangeWorkType($event)"
  (changeSection51)="manager.onChangeSection51($event)"
  (changeIsBulkEntry)="manager.onChangeIsBulkEntry($event)"
  (changeNumOfEntries)="manager.onChangeNumOfEntries($event)"
  (changeTelephoneAdv)="manager.onChangeTelephoneAdv($event)"
  (openEmailAttachment)="manager.onOpenEmailAttachment($event)"
  (downlodeEmailAttachment)="manager.onDownlodeEmailAttachment($event)"
  (changeCivilClass)="manager.onChangeCivilClass($event)"
  (changeCivilLevel)="manager.onChangeCivilLevel($event)"
  (changeCivilCourt)="manager.onChangeCivilCourt($event)"
 
   ></dps-add-note-layout>
  </dps-add-note-manager>
  `,
  styles: []

})
export class AddNotePopupComponent implements OnInit, OnDestroy {

  isEnable$;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: AddNoteInPutData, token: string },
    public dialogRef: MatDialogRef<AddNotePopupComponent>, private dialog: MatDialog,
    private addNoteService: AddNoteService, private store: Store<any>) { }

  ngOnInit() {
    this.isEnable$ = this.addNoteService.getIsTimeRecordingEnabled(this.data.input.matterData.MatterReferenceNo).pipe(
      filter((value) => value !== null),
      take(1),
      switchMap((result) => {
        if (result) {
          return of(true);
        } else {
          const dialogData: InforDialogData = {
            content: {
              title: 'Add Note',
              message: 'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.'
            },
            data: { messageType: 'warning' }
          };
          this.dialogRef.updateSize('400px', '0px');
          console.log('dialogData', dialogData);
          // popup dialog
          const dialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '400px',
            disableClose: true,
            hasBackdrop: false,
            panelClass: 'dps-notification'
          });
          return dialogRef.afterClosed().pipe(map<InforDialogResult, boolean>(dialogResult => {
            return false;
          }));
        }
      }), tap((result) => result === false ? this.dialogRef.close() : null), share());
  }

  ngOnDestroy(): void {

  }

  onClose(info) {
    this.dialogRef.close(info);
  }

}
