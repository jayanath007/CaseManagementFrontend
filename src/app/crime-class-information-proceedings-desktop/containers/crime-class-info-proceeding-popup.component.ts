import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CrimeProceedingClassInfoInput } from '../../core/lib/crime-managment';

@Component({
  selector: 'dps-crime-class-info-proceeding-popup',
  template: `<dps-crime-class-proceeding-manager #manager [token]="data.token" [input]="data.input">
                  <dps-crime-class-info-popup-layout
                  [isLoading]="manager.isLoading$|async"
                  [infomationModel]="manager.infomationModel$|async"
                  [stageReachedList]="manager.stageReachedList$|async"
                  [matterTypeList]="manager.matterTypeList$|async"
                  [caseTypes]="manager.caseTypes$|async"
                  [outComeCode]="manager.outComeCode$|async"
                  [controlProperty]="manager.controlProperty$|async"
                  [ufnValue]="data.input.ufnValue"
                  [homeCurrency]="manager.homeCurrency$|async"
                  [summeryData]="manager.summeryData$|async"
                  [leadUfnTotalSummary]="manager.leadUfnTotalSummary$|async"
                  (changeModel)="manager.onChangeUserInput($event)"
                  (closePopup)="onClosePopup()"
                  (save)="manager.onSave()"
                  (openLocationSearch)="manager.onOpenLocationSearch($event)"
                  (closeReopenClass)="manager.onCloseReopenClass($event)"
                  >
                  </dps-crime-class-info-popup-layout>
            </dps-crime-class-proceeding-manager>`
})
export class CrimeClassInfoProceedingPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: CrimeProceedingClassInfoInput, token: string },
    public dialogRef: MatDialogRef<CrimeClassInfoProceedingPopupComponent>) { }

  @Output() close = new EventEmitter();

  ngOnInit() {
  }

  onClosePopup() {
    this.dialogRef.close();
  }

}
