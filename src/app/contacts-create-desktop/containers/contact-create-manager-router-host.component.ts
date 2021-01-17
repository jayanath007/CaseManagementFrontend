import { Component, OnInit } from '@angular/core';
import { OpenFrom } from './../../contacts-create-core/models/enum';
import { ContactCreateInputData } from './../../contacts-create-core/models/interfaces';

@Component({
    selector: 'dps-contact-create-manager-router-host',
    template: `<dps-contacts-create-manager #contactCreationManager
        [contactCreationToken]="token"
        [inputData]="inputData"
        [isPopup]="false"
        >
        <dps-contacts-create-main-layout
             [isLoading]="contactCreationManager.isLoading$|async"
             [selectedContact]="contactCreationManager.selectedContact$|async"
             [contactSearchKey]="contactCreationManager.contactSearchKey$|async"
             [showSearchTab]="contactCreationManager.showSearchTab$|async"
             [selectedTab]="contactCreationManager.selectedTab$|async"
             [token]="contactCreationManager.token"
             [otherContactCol]="contactCreationManager.otherContactCol$|async"
             [mode]="contactCreationManager.mode$|async"
             [types]="contactCreationManager.types$|async"
             (searchTextChanged)="contactCreationManager.onSearchTextChanged($event)"
             (changeSelectedTab)="contactCreationManager.onChangeSelectedTab($event)"
             (selectContact)="contactCreationManager.onSelectContact($event)"
             (changeDetails)="contactCreationManager.onChangeDetails($event)"
             >
        </dps-contacts-create-main-layout>
    </dps-contacts-create-manager>
    `,
    styles: []
})

export class ContactCreateRouterHostComponent implements OnInit {
    token = 'ContactCreate';
    inputData: ContactCreateInputData = {
        openfrom: OpenFrom.MainView
    };
    constructor() {
    }

    ngOnInit() {

    }
}
