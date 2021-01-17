import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MsgPopupHostComponent } from '../../../msg-popup-layout/containers/msg-popup-host.component';
import { MsgViewerInput } from '../../models/msg-viewer-Input';

@Component({
  selector: 'dps-msg-viewer-popup',
  templateUrl: './msg-viewer-popup.component.html',
  styleUrls: ['./msg-viewer-popup.component.scss']
})
export class MsgViewerPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: MsgViewerInput }, public dialogRef: MatDialogRef<MsgPopupHostComponent>) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }
}
