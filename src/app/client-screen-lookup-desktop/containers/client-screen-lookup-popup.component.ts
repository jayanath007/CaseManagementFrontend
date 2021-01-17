import { LookupInputData } from '../../client-screen-lookup-core/models/interfaces';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-client-screen-lookup-popup',
  template: `<dps-client-screen-lookup-manager  [inputData]="data.input" [token]="data.token" #clientLookupPopupManager
   (closePopup)="onClose($event)">
  <dps-client-screen-lookup-layout
  [columnDef] = "clientLookupPopupManager.columnsForScreenLookup.columnDef"
  [screenLookupList] = "clientLookupPopupManager.screenLookupList$ | async"
  [loading] = "clientLookupPopupManager.isLoading$ | async"
  (onAddNewLookupClick) = "clientLookupPopupManager.onAddNewLookupClick($event)"
  (onSaveScreenLookupClick) = "clientLookupPopupManager.onSaveLookupClick($event)"
  (lookupItemChange) = "clientLookupPopupManager.onLookupItemChangeClick($event)"
  (onDeleteScreenLookupClick) = "clientLookupPopupManager.onDeleteScreenLookupClick($event)"
  (onChangeDescription) = "clientLookupPopupManager.onChangeDescriptionClick($event)"
  (onCancelChangeClick) = "clientLookupPopupManager.onCancelChangeClick()"
  (onLookupClose) = "clientLookupPopupManager.onCloseLookupClick()"
  (closePopup) = "clientLookupPopupManager.onClosePopupClick()"
  ></dps-client-screen-lookup-layout>
  </dps-client-screen-lookup-manager>`,
  styles: []

})
export class ClientScreenLookupPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: LookupInputData, token: string },
    public dialogRef: MatDialogRef<ClientScreenLookupPopupComponent>) { }

  ngOnInit() {
  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}
