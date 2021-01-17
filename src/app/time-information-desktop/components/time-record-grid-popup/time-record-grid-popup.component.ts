import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TimeRecordGridInput } from '../../../time-information-core/models/interfaces';
import { TimeInformationModel } from './../../../time-information-core/models/interfaces';

@Component({
  selector: 'dps-time-record-grid-popup',
  templateUrl: './time-record-grid-popup.component.html',
  styleUrls: ['./time-record-grid-popup.component.scss']
})
export class TimeRecordGridPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TimeRecordGridInput, public dialogRef: MatDialogRef<TimeRecordGridPopupComponent>) { }


  onClose(row: TimeInformationModel) {
    this.dialogRef.close(row);
  }


}



