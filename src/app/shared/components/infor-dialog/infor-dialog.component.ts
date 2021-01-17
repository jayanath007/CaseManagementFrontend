import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InforDialogData, InforDialogResultKind, InforDialogResult } from '../../models/dialog';

@Component({
  selector: 'dps-infor-dialog',
  templateUrl: './infor-dialog.component.html',
  styleUrls: ['./infor-dialog.component.scss']
})
export class InforDialogComponent implements OnInit {

  InforDialogResultKind = InforDialogResultKind;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<InforDialogComponent>) { }
  ngOnInit() {
    const elements = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let index = 0; index < elements.length; index++) {
      const element = elements.item(index);
      if (element.firstElementChild.classList['value'] === 'cdk-overlay-pane dps-notification dps-tenet-validation-fail-panel') {
        element['style'].zIndex = 10000;
      }
    }
  }

  onAction(kind: InforDialogResultKind) {
    const result: InforDialogResult = { kind: kind, data: this.data.data };
    this.dialogRef.close(result);
  }

  onClose() {
    this.dialogRef.close(null);
  }

}
