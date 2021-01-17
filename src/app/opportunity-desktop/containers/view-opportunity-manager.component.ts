import { OpportunityGridDataViewModel } from './../../opportunity-core/models/interfaces';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-view-opportunity-manager',
  template: `<dps-opportunity-manager #manager [opportunityToken]="'dpsOpportunityToken'" [isPopup]="true"
                 [oppertunityId]="this.data.input.oppertunityId">
                  <dps-view-opportunity-popup-layout
                  [gridItem]="manager.editItem$ | async"
                  [departmentList]="manager.departmentList$ | async"
                  [feeEarnerList]="manager.feeEarnerList$ | async"
                  [introducerList]="manager.introducerList$ | async"
                  [statusList]="manager.statusList$|async"
                  [closePopup]="manager.closePopup$|async"
                  [historyColumDef]="manager.historyColumDef"
                  [historyData]="manager.historyData$|async"
                  [salTitle]="manager.salTitle$|async"
                  (popupClosed)="onClose()"
                  (conflictRun)="manager.onConflictRun($event)"
                  (qouteRun)="manager.onQouteRun($event)"
                  (openLogFile)="manager.onOpenLogFile($event)"
                  [isLoading]="manager.isLoading$ | async"
                  (closeOpportunitty)="manager.onCloseOpportunitty($event)"
                  (createCaseFile)="manager.onCreateCaseFile($event)"
                  (openMatter)="manager.onOpenMatter($event)"
                  (openClientSearch)="manager.onClientSearch()"
                  (saveEditOpertunity)="manager.onSaveEditOpertunity($event)"
                  (changeDepartment)="manager.onChangeDepartment($event)"
                  >
                  </dps-view-opportunity-popup-layout>
              </dps-opportunity-manager>`
})
export class ViewOpportunityManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: { oppertunityId: number }, token: string },
    public dialogRef: MatDialogRef<ViewOpportunityManagerComponent>) { }

  ngOnInit() {

  }
  onClose() {
    this.dialogRef.close();
  }
}


