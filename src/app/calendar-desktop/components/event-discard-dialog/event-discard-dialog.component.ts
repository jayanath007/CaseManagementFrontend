import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-event-discard-dialog',
  templateUrl: './event-discard-dialog.component.html',
  styleUrls: ['./event-discard-dialog.component.scss']
})
export class EventDiscardDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string, public dialogRef: MatDialogRef<EventDiscardDialogComponent>) { }

  ngOnInit() {
  }
  close(type: string) {
    this.dialogRef.close(type);
  }

}
