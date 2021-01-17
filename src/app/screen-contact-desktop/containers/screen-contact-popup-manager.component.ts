import { ICallbackData } from '../../screen-view-core/models/contact-search-params';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'dps-screen-contact-popup-manager',
  template: `
    <dps-screen-contact-manager
      [fontSizeClass]="data.input.fontSizeClass"
      [matterDetails]="data.input.matterDetails"
      [screenDefinition]="data.input.screenDefinition"
      [refreshCount]="refreshCount"
      [searchType]="data.input.searchType"
      [newContactPermission]="!data.input.contactLockedPermission"
      [searchParams]="data.input"
      [token]="data.input.token">
       </dps-screen-contact-manager>
    `,
  styles: []
})

export class ScreenContactPopupManagerComponent implements OnInit {
  constructor( @Inject(MAT_DIALOG_DATA) public data: {
    input: ICallbackData,
  }) {

  }
  refreshCount = 1;

  ngOnInit() {
  }
}
