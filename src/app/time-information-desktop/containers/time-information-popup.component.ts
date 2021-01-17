import { map, filter, take, switchMap, share, tap } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { TimeInformationInputData } from '../../core/lib/crime-managment';
import { TimeInformationService } from '../../time-information-core/services/time-information-service';
import { of } from 'rxjs';
import { InforDialogData, InforDialogComponent, InforDialogResult } from '../../shared';




@Component({
  selector: 'dps-time-information-popup.component',
  template: `<dps-time-information-manager [inputData]="data.input" [token]="data.token" (closePopup)="onClose()" #manager>
  <mat-progress-bar *ngIf="!isEnable$ | async"  mode="indeterminate"></mat-progress-bar>
  <dps-time-information-layout *ngIf="isEnable$ | async"
                       [isLoading]="manager.isLoading$|async"
                       [isloadingTimeRecords]="manager.isloadingTimeRecords$|async"
                       [feeEarnerList]="manager.feeEarnerList$|async"
                       [model]="manager.model$|async"
                       [formViewModel]="manager.formViewModel$|async"
                       [gradeList]="manager.gradeList$|async"
                       [gridColumnDef]="manager.gridColumnDef$|async"
                       [isEditMode]="manager.isEditMode$ |async"
                       [timeRecordsGridData]="manager.timeRecordsGridData$|async"
                       [attTypesList]="manager.attTypesList$|async"
                       [isUpdateRateFiles]="manager.isUpdateRateFiles$|async"
                       [settings]="manager.settings$|async"
                       [classList]="manager.classList$|async"
                       [matter]="manager.matter$|async"
                       [policeSLookupList]="manager.policeSLookupList$|async"
                       (modelChange)="manager.onModelChange($event)"
                       (parentModelChange)="manager.onParentModelChange($event)"
                       (rateCalculation)="manager.onRateCalculation($event)"
                       (closePopup)="onClose()"
                       (selectGridItem)="manager.onSelectGridItem($event)"
                       (attTypeListChange)="manager.onAttTypeListChange($event)"
                       (clickAction)="manager.onClickAction($event)"
                       (exceedLimit)="manager.onExceedLimit()"
                       (openLookup)="manager.openLookup($event)"
                       (removeAttendee)="manager.onRemoveAttendee($event)"
                       (classChange)="manager.onClassChange($event)"
                       (changeFeeEarner)="manager.onChangeFeeEarner($event)"
                       >
                  </dps-time-information-layout>
             </dps-time-information-manager>`
})
export class TimeInformationPopupComponent implements OnInit {
  isEnable$;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: TimeInformationInputData, token: string },
    public dialogRef: MatDialogRef<TimeInformationPopupComponent>, private timerecordingService: TimeInformationService
    , private dialog: MatDialog) { }

  ngOnInit() {
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

  onClose() {
    this.dialogRef.close();
  }

}
