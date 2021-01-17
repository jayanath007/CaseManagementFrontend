import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConflictSearchService } from '../../conflict-search-core/services/conflict-search-service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { InforDialogData, InforDialogComponent, InforDialogResult } from '../../shared';
import { ConflictSearchPopupInput } from '../../conflict-search-core/models/interfaces';
@Component({
  selector: 'dps-conflict-search-popup',
  template: `
  <dps-conflict-search-manager [inputData]="data.input"
   [token]="data.token" (closePopup)="onClose($event)"  #manager>
  <dps-conflict-search-layout  [isLoading]="manager.isLoading$ | async"
           [searchModel]="manager.searchModel$ | async"
           [clientMatterList]="manager.clientMatterList$ | async"
           [conflictSearchList]="manager.conflictSearchList$ | async"
           [searchState]="manager.searchState$ | async"
           [client]="manager.client$ | async"
           [conflictSearchPageEvent]="manager.conflictSearchPageEvent$ | async"
           [conflictCheckType]="manager.conflictCheckType$ | async"
           [clientMatterPageEvent]="manager.clientMatterPageEvent$ | async"
           [saveType]="manager.saveType$ | async"
           [loadingData]="manager.loadingData$ | async"
           [clientMatterLoading]="manager.clientMatterLoading$ | async"
           [isExit]="manager.isExit$ | async"
           [openFrom]="data.input.openFrom"
           [popupCommonPara]="manager.popupCommonPara$ | async"
           [companyList]="manager.companyList$ | async"
           (companyListOut)="manager.onCompanyListOut($event)"
           (opportunityConflictSearch)="manager.onOpportunityConflictSearch($event)"
           (opportunityConflictSearchSave)="manager.onOpportunityConflictSearchSave($event)"
           (search)="manager.onSearch($event)"
           (save)="manager.onSave($event)"
           (searchNew)="manager.onClear($event)"
           (rowClick)="manager.onRowClick($event)"
           (conflictSearchPageChange)="manager.onConflictSearchPageChange($event)"
           (clientMatterhPageChange)="manager.onClientMatterGridPageChange($event)"
           (close)="manager.close($event)"
           >
</dps-conflict-search-layout>
</dps-conflict-search-manager>
  `,
  styles: []
})


export class ConflictSearchPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: ConflictSearchPopupInput, token: string },
    public dialogRef: MatDialogRef<ConflictSearchPopupComponent>,
    private timerecordingService: ConflictSearchService
    , private dialog: MatDialog) { }

  ngOnInit() {

  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}
