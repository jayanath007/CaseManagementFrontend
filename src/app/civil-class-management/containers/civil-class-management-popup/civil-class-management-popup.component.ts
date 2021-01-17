import { Observable } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as action from '../../actions/core';
import { CivilClassObj, CivilManagementModuleInput } from '../../model/interfaces';
import * as selector from '../../reducers';
import { getFeeEarnerList, FeeEarnerInfo } from '../../../shared-data';

@Component({
  selector: 'dps-civil-class-management-popup',
  template: `<dps-civil-class-management-layout
            [isLoading]="isLoadin$|async"
            [classList]="classList$|async"
            [openRowIndex]="openRowIndex$|async"
            (closePopup)="closePopup()"
            >
            </dps-civil-class-management-layout>`
})
export class CivilClassManagementPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: CivilManagementModuleInput, token: string },
    public dialogRef: MatDialogRef<CivilClassManagementPopupComponent>, protected store: Store<any>) { }

  token: string;

  isLoadin$: Observable<boolean>;
  classList$: Observable<CivilClassObj[]>;
  openRowIndex$: Observable<number>;

  ngOnInit() {
    this.token = this.data.token;
    this.store.dispatch(new action.InitCivilManagement(this.token, {
      inputData: this.data.input
    }));

    this.isLoadin$ = this.store.select(selector.getIsLoading(this.token));
    this.classList$ = this.store.select(selector.getClassList(this.token));
    this.openRowIndex$ = this.store.select(selector.getopenRowIndex(this.token));
  }

  closePopup() {
    this.dialogRef.close();
  }

}




