import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-app-settings-overlay',
  template: `<dps-app-settings-manager (close)="onClose()" [inputData]="data.input" [token]="data.token"></dps-app-settings-manager>`,
  styles: []
})
export class AppSettingsOverlayComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<AppSettingsOverlayComponent>) { }
  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }
}
