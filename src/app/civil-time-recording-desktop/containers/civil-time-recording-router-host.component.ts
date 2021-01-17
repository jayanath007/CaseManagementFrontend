import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { CivilTimeRecordingManagerComponent } from './civil-time-recording-manager.component';
import { CivilTimeRecordingModuleInput } from '..';

@Component({
  selector: 'dps-civil-time-recording-router-host',
  template: `<dps-civil-time-recording-manager [token]="data.token" [moduleInput]="data.input" #manager>
                <dps-civil-time-recording-main-layout 
                [isLoading]="manager.isLoadin$|async"
                [feeEarnerList]="manager.feeEarnerList$|async"
                [viewData]="manager.viewData$|async"
                [modelData]="manager.modelData$|async"
                [classData]="manager.classData$|async"
                [homeCurrency]="manager.homeCurrency$|async"
                (closePopup)="onClose()"
                (selectItemForEdit)="manager.onSelectItemForEdit($event)"
                (changeTimeRecordModel)="manager.onChangeTimeRecordModel($event)"
                (userAction)="manager.onUserAction($event)"
                (changePage)="manager.onChangePage($event)"
                >
                </dps-civil-time-recording-main-layout>
            </dps-civil-time-recording-manager>`
})
export class CivilTimeRecordingRouterHostComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: CivilTimeRecordingModuleInput, token: string },
    public dialogRef: MatDialogRef<CivilTimeRecordingManagerComponent>) { }



  onClose() {
    this.dialogRef.close();
  }

}


