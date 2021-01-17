import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-mls-popup-manager',
  template: `<dps-mls-popup-layout
              [matterInfo]="data.input"
              (close)="closePopup()"
              >
              </dps-mls-popup-layout>`
})
export class MlsPopupManagerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<MlsPopupManagerComponent>) { }


  closePopup() {
    this.dialogRef.close(event);
  }

}
