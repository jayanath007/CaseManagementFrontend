import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CCInvestigationInfoInput } from '../../core/lib/crime-managment';

@Component({
  selector: 'dps-crime-class-information-investigation-popup',
  template: `<dps-crime-information-investigation-manager [input]="data.input" [token]="data.token" #CCinfomanager>
                <dps-cc-information-investigation-layout
                    [isLoading]="CCinfomanager.isLoading$|async"
                    [controlProperty]="CCinfomanager.controlerProperty$|async"
                    [infomationModel]="CCinfomanager.infomationModel$|async"
                    [stageReachedList]="CCinfomanager.stageReachedList$|async"
                    [matterTypeList]="CCinfomanager.matterTypeList$|async"
                    [outComeCode]="CCinfomanager.outComeCode$|async"
                    [homeCurrency]="CCinfomanager.homeCurrency$|async"
                    [summeryData]="CCinfomanager.summeryData$|async"
                    [total]="CCinfomanager.total$|async"
                    [isRecursive]="CCinfomanager.isRecursive$|async"
                    [ufnValue]="CCinfomanager.ufnValue$|async"
                    [policeSLookupList]="CCinfomanager.policeSLookupList$|async"
                    (changeModel)="CCinfomanager.onChangeUserInput($event)"
                    (save)="CCinfomanager.onSave()"
                    (close)="closePopup()"
                    (closeReopenClass)="CCinfomanager.onCloseReopenClass($event)"
                    (btnAdvoAssiClick)="CCinfomanager.onBtnAdvoAssiClick()"
                    >
                </dps-cc-information-investigation-layout>
            </dps-crime-information-investigation-manager>`,
})
export class CrimeClassInvestigationPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: CCInvestigationInfoInput, token: string },
    public dialogRef: MatDialogRef<CrimeClassInvestigationPopupComponent>) { }

  closePopup() {
    this.dialogRef.close();
  }

}
