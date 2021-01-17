import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-password-confirm-dialog',
  templateUrl: './password-confirm-dialog.component.html',
  styleUrls: ['./password-confirm-dialog.component.scss']
})
export class PasswordConfirmDialoagComponent {

  constructor(
    public dialogRef: MatDialogRef<PasswordConfirmDialoagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
