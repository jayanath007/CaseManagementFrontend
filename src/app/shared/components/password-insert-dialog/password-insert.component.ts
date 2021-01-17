import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsertPasswordDialog } from '../..';

@Component({
  selector: 'dps-password-insert',
  templateUrl: './password-insert.component.html',
  styleUrls: ['./password-insert.component.scss']
})
export class PasswordInsertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PasswordInsertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InsertPasswordDialog) { }

  colseDialog(): void {
    this.dialogRef.close();
  }
  onEnter() {
    this.dialogRef.close(this.data);
  }
  ngOnInit() {
  }
}
