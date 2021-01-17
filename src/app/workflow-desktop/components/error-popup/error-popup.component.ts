import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent implements OnInit {

  errorMessage: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { errorMessage: string },
    public dialogRef: MatDialogRef<ErrorPopupComponent>
  ) { }

  ngOnInit() {
    this.errorMessage = this.data.errorMessage;
  }

  onOk() {
    this.dialogRef.close();
  }

}
