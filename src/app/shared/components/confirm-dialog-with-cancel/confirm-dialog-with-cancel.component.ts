import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ConfirmDialogWithCancelResultKind, ConfirmDialogWithCancelResult } from '../../models/dialog';

@Component({
  selector: 'dps-confirm-dialog-with-cancel',
  templateUrl: './confirm-dialog-with-cancel.component.html',
  styleUrls: ['./confirm-dialog-with-cancel.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmDialogComponentWithCancel implements OnInit {

  ConfirmDialogWithCancelResultKind = ConfirmDialogWithCancelResultKind;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialogComponentWithCancel>) { }

  ngOnInit() {
  }

  onAction(kind: ConfirmDialogWithCancelResultKind) {
    const result: ConfirmDialogWithCancelResult = {kind: kind, data: this.data.data };
    this.dialogRef.close(result);
  }

}
