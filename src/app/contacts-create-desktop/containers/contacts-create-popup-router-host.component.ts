import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { CaseContact } from '../../case-contact-core/models/interface';
import { ContactCreateInputData } from '../../contacts-create-core';
import { BaseContacCreateManager } from '../../contacts-create-core/containers/base-contacts-create-manager.component';

@Component({
  selector: 'dps-contacts-create-router-host',
  template: `<dps-contacts-create-manager
  #contactCreationPopupManager
      [contactCreationToken]="data.token"
      [inputData]="data.input"
      [isPopup]="true"
      (closePopup)="onClose($event)">
      <dps-contact-create-popup-layout
      [isLoading]="contactCreationPopupManager.isLoading$|async"
      [selectedContact]="contactCreationPopupManager.selectedContact$|async"
      [contactSearchKey]="contactCreationPopupManager.contactSearchKey$|async"
      [showSearchTab]="contactCreationPopupManager.showSearchTab$|async"
      [selectedTab]="contactCreationPopupManager.selectedTab$|async"
      [token]="contactCreationPopupManager.token"
      [otherContactCol]="contactCreationPopupManager.otherContactCol$|async"
      [mode]="contactCreationPopupManager.mode$|async"
      [types]="contactCreationPopupManager.types$|async"
      [matterData]="contactCreationPopupManager.matterData$|async"
      (searchTextChanged)="contactCreationPopupManager.onSearchTextChanged($event)"
      (changeSelectedTab)="contactCreationPopupManager.onChangeSelectedTab($event)"
      (selectContact)="onSelectContactPopup($event)"
      (changeDetails)="contactCreationPopupManager.onChangeDetails($event)"
      (close)="onClose(null)"
      >
      </dps-contact-create-popup-layout>
  </dps-contacts-create-manager>
  `,
  styles: []
})
export class ContactsCreatePopUpRouterHostComponent extends BaseContacCreateManager implements OnInit {
  constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: ContactCreateInputData, token: string },
    public dialogRef: MatDialogRef<ContactsCreatePopUpRouterHostComponent>) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.data.token, true, this.data.input);
  }

  onSelectContactPopup(data: { contactInfo: CaseContact, close: boolean }) {
    if (data.close) {
      this.onClose(data.contactInfo);
    }
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}

