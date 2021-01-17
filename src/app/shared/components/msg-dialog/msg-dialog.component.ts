import { timer ,  Subscription } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-message-dialog',
  templateUrl: './msg-dialog.component.html',
  styleUrls: ['./msg-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  mouseOver: boolean;
  colosePopup: Subscription;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MessageDialogComponent>) { }
  ngOnInit() {
    this.dialogRef.updatePosition({ top: '0px', right: '0px' });
    this.colosePopup = timer(3000).subscribe(x => {
      this.onClose();
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onMouseOver() {
    this.colosePopup.unsubscribe();
  }

  onMouseLeave() {
    this.colosePopup = timer(3000).subscribe(x => {
      this.onClose();
    });
  }

}
