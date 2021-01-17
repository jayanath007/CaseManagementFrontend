import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
// import { BaseCrimeManagementManager } from '../../crime-management-core/containers/base-crime-management-manager';
import { CrimeManagementInitials } from '../../core/lib/crime-managment';


@Component({
  selector: 'dps-crime-management-boostrap',
  template: `<dps-crime-management-manager #crimeManagementManager
                [inputData]="inputData"
                [token]="token"
                [isPopup]="true"
  >
   <dps-crime-management-layout
   (menuButtonClick)="crimeManagementManager.onMenuButtonClick(token,$event)" >
   </dps-crime-management-layout>
  </dps-crime-management-manager>`,
  styles: []
})

export class CrimeManagementBoostrapComponent implements OnInit {

  constructor(store: Store<any>) {

  }
  inputData: CrimeManagementInitials;
  token: string;

  ngOnInit() {

  }

}
