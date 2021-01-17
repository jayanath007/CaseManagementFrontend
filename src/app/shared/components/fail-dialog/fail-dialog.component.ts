import { ExceptionDialogData, FailDialogData } from '../../models/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'dps-fail-dialog',
  templateUrl: './fail-dialog.component.html',
  styleUrls: ['./fail-dialog.component.scss']
})
export class FailDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: FailDialogData,
   public dialogRef: MatDialogRef<FailDialogComponent>) { }

  displayedColumns = ['title', 'message'];

  ngOnInit() {
  }

  onAction() {
    this.dialogRef.close();
  }

}
