import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { CDS7CloseInfo } from '../../cds7-report-info-core/models/cds7-report-info';

@Component({
  selector: 'dps-cds7-report-info-popup',
  template: `<dps-cds7-report-info-popup-manager #manager [token]="data.token" [input]="data.input">
              <dps-cds7-report-info-content
              [isLoading]="manager.isLoading$|async"
              [informationModel]="manager.informationModel$|async"
              [locationLookupList]="manager.locationLookupList$|async"
              [caseTypes]="manager.caseTypes$|async"
              (close)="onClose()"
              (changeModel)="manager.onChangeModel($event)"
              (save)="manager.onSave(dialogRef)"
              >

              </dps-cds7-report-info-content>
            </dps-cds7-report-info-popup-manager>`

})
export class Cds7ReportInfoPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: CrimeClassIdentityViewModel, token: string },
    public dialogRef: MatDialogRef<Cds7ReportInfoPopupComponent>) { }

  ngOnInit() {

  }

  onClose() {
    this.dialogRef.close({ action: CDS7CloseInfo.ExitByUser, data: null });
  }

}
