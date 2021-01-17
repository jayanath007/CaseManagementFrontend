import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'dps-probate-desktop-popup',
  template: `<dps-probate-manager #manager [inputData]="data.inputs"
   [token]="data.token"  >
                <dps-probate-layout
                [token]="data.token"
                [loading]="manager.isLoading$ | async"
                [deceasedInfo]="manager.deceasedInfo$ | async"
                [distributionViewItems]= "manager.distributionViewItems$ | async"
                 [estateOverViews]="manager.estateOverViews$ | async"
                  [residenceNilRateBandData]="manager.residenceNilRateBandData$ | async"
                   [spouseorCivilPatnerData]="manager.spouseorCivilPatnerData$ | async"
                   [inputData]="data.inputs"
                    [transactions]="manager.transactions$ | async"
                     [matterData]="manager.matterData$ | async"
                      [transactionsEditRow]="manager.transactionsEditRow$ | async"
                      [distributionEditRow]="manager.distributionEditRow$ | async"
                      [selectedRow]="manager.selectedRow$ | async"
                      [ihtFormsData]="manager.ihtFormsData$ | async"
                      [selectedIhtRow]="manager.selectedIhtRow$ | async"
                      (selectedRowClick)="manager.onSelectedRowClick($event)"
                     (rnrbDataUpdate) = "manager.onRnrbDataUpdate($event)"
                     (submitSaveData)="manager.onSubmitSaveData($event)"
                     (edittransactionClick)="manager.onEdittransactionClick($event)"
                     (spouseCivilUpdate)="manager.onspouseCivilUpdate($event)"
                     (editDistributionClick)="manager.onEditDistributionClick($event)"
                     (deleteRow)="manager.onDeleteRow($event)"
                      (deleteProbateRow)="manager.onDeleteProbateRow($event)"
                      (clear)="manager.onClear()"
                      (generateForm)="manager.onGenerateForm($event)"
                      (generateAccounts)="manager.onGenerateAccounts($event)"
                      (openIntForm)="manager.onOpenIntForm($event)"
                     

                (closePopup)="closePopup($event)"></dps-probate-layout>
            </dps-probate-manager>`,

})
export class ProbateDesktopPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: string, inputs: any },
    public dialogRef: MatDialogRef<ProbateDesktopPopupComponent>, private dialog: MatDialog) { }

  ngOnInit() {
  }

  closePopup(event) {
    this.dialogRef.close();
  }

}


