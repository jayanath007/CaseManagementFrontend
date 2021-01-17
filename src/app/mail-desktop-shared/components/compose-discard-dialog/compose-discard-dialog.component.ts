import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-compose-discard-dialog',
  templateUrl: './compose-discard-dialog.component.html',
  styleUrls: ['./compose-discard-dialog.component.scss']
})
export class ComposeDiscardDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ComposeDiscardDialogComponent>) { }

  ngOnInit() {
  }
  close(type: string) {
    this.dialogRef.close(type);
  }
}
