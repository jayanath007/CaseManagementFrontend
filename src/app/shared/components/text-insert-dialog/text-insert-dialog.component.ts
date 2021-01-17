import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TextInsertDialogInput } from '../..';

@Component({
  selector: 'dps-text-insert-dialog',
  templateUrl: './text-insert-dialog.component.html',
  styleUrls: ['./text-insert-dialog.component.scss']
})
export class TextInsertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<TextInsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextInsertDialogInput) {
  }


  colseDialog(type): void {
    if (!this.data.allowEmpty && !this.data.text && type === 'ok') {
      return;
    } else if (type === 'cancel') {
      this.data.text = '';
    }
    if (this.data.textArea) {
      this.dialogRef.close(this.data);
    } else {
      this.dialogRef.close(this.data.text);
    }

  }


  onClose() {

    this.dialogRef.close(null);
  }

}
