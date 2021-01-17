import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmDialogData, ConfirmDialogResultKind, ConfirmDialogResult } from '../../models/dialog';

@Component({
  selector: 'dps-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  ConfirmDialogResultKind = ConfirmDialogResultKind;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }

  onAction(kind: ConfirmDialogResultKind) {
    const result: ConfirmDialogResult = { kind: kind, data: this.data.data };
    this.dialogRef.close(result);
  }

  onClose() {
    // this.onClose();
  }

}
