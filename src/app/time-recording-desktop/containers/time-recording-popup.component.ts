
import { switchMap, take, filter, tap, share, map } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TimeRecordInputData } from '../../time-recording-core/models/interfaces';
import { TimeRecordingService } from '../../time-recording-core/services/time_recording_service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { InforDialogData, InforDialogComponent, InforDialogResult } from '../../shared';






@Component({
  selector: 'dps-time-recording-popup',
  template: `
  <dps-time-recording-manager [inputData]="data.input" [token]="data.token" (closePopup)="onClose($event)"  #manager>
  <mat-progress-bar *ngIf="!isEnable$ | async"  mode="indeterminate"></mat-progress-bar>
  <dps-time-recording-layout *ngIf="isEnable$ | async"  [isLoading]="manager.isLoading$ | async"
           [error] = "manager.error$ | async"
           [feeEarnerList] = "manager.feeEarnerList$ | async"
           [matterReferenceNo]="manager.matterReferenceNo$ | async"
           [clientMatterData]="manager.clientMatterData$ | async"
           [detailList]="manager.detailList$ | async"
           [isTimerStart]="manager.isTimerStart$ | async"
           [date]=" manager.date$| async"
           [bodyText]="manager.bodyText$ | async"
           [mpu]="manager.mpu$ | async"
           [unit]=" manager.unit$| async"
           [hourlyRate]="manager.hourlyRate$ | async"
           [amount]="manager.amount$ | async"
           [isUncharge]="manager.isUncharge$ | async"
           [saved]="manager.saved$ | async"
           [isDirty]="manager.isDirty$ | async"
           [editData]="manager.editData$|async"
           [pageLoadType]="manager.eBillingType$|async"
           [worktypeList]="manager.workTypeListData$|async"
           [precedentHRateList]="manager.precedentHRateListData$|async"
           [activitiList]="manager.activitiListData$|async"
           [phaseList]="manager.phaseListData$|async"
           [phaseWiseTaskList]="manager.taskListData$|async"
           [selectDetail]="manager.selectDetail$|async"
           [isMinimizePopup]="manager.isMinimizePopup$|async"
           [selectedPhRate]="manager.selectedPhRate$ | async"
           [canMinimize]="data.input.canMinimize"
           [selectedJobTitle]="manager.selectedJobTitle$|async"
           [diaryFileDetails]="manager.diaryFileDetails$|async"
           (changeUnit)="manager.onChangeUnit($event)"
           (changeRate)="manager.onChangeRate($event)"
           (updateSelectedFeeEarner)="manager.onChangeFeeEarner($event)"
           (changeUncharge)="manager.onChangeUncharge($event)"
           (upateSelectedDate)="manager.onUpateSelectedDate($event)"
           (upateSelectedDetails)="manager.onUpateSelectedDetails($event)"
           (updateNote)="manager.updateNote($event)"
           (changeWorkType)="manager.updateWorkType($event)"
           (changePhase)="manager.updatePhase($event)"
           (changeTask)="manager.updateTask($event)"
           (changeActivity)="manager.updateActivity($event)"
           (submit)="manager.onSubmit()"
           (saveData)="manager.onSave()"
           (close)="manager.close($event)"
           (changeMatter)="manager.onMatterSearch($event)"
           [timeValue]="manager.timeValue$|async"
           [isActiveToken]="manager.isActiveToken$|async"
           [timeRecordingView]="manager.timeRecordingView$|async"
           (stopStartClock)="manager.onStopStartClock($event)"
           (deleteTimeRecording)="manager.onDeleteTimeRecording($event)"
           (phRateChange)="manager.onPHRateChange($event)">
</dps-time-recording-layout>
</dps-time-recording-manager>
  `,
  styles: []
})

export class TimeRecordingPopupComponent implements OnInit {
  isEnable$;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: TimeRecordInputData, token: string },
    public dialogRef: MatDialogRef<TimeRecordingPopupComponent>, private timerecordingService: TimeRecordingService
    , private dialog: MatDialog) { }

  ngOnInit() {
    if (!this.data.input.matterReferenceNo) {
      this.isEnable$ = of(true);
    } else {
      this.isEnable$ = this.timerecordingService.getIsTimeRecordingEnabled(this.data.input.matterReferenceNo).pipe(
        filter((value) => value !== null),
        take(1),
        switchMap((result) => {
          if (result) {
            return of(true);
          } else {
            const dialogData: InforDialogData = {
              content: {
                title: 'Time Record',
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
  }

  onClose(event) {
    this.dialogRef.close(event);
  }


}
