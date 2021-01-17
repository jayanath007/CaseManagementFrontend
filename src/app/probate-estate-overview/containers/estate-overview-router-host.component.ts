
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EstateOverviewManagerComponent } from './estate-overview-manager.component';
@Component({
  selector: 'dps-estate-overview-router-host.component',
  template: `<dps-estate-overview-manager #manager [estateOverviewToken]="data.token" [inputData]="data.input"
             (closePopup)="onClose($event)">
                  <dps-add-edit-estate-layout (estateOverviewClose)="manager.onCloseEstateOverview($event)"
                  [loading]="manager.loading$ | async"
                  [isDirty]="manager.isDirty$ | async"
                  [matterData]="manager.matterData$ | async"
                  [formControllersArray]="manager.formControllers$ | async"
                  [formControllersByCategory]="manager.formControllersByCategory$ | async"
                  [formType]="manager.formType$ | async"
                  [mode]="manager.mode$ | async"
                  [dropDownCategory]="manager.dropDownCategory$ | async"
                  [selectedCategoty]="manager.selectedCategory$ | async"
                  [dataModel]="manager.dataModel$ | async"
                  [gridDataModel]="manager.gridDataModel$ | async"
                  [contactDetails]="manager.contactDetails$ | async"
                  [getSelectedRow]="manager.getSelectedRowId$ | async"
                  [liabilityAsset]="manager.liabilityAsset$ | async"
                  [exemptionAsset]="manager.exemptionAsset$ | async"
                  [dealtBySellText]="manager.dealtBySellText$ | async"
                  [legacyPercentage]="manager.legacyPercentage$ | async"
                  (setSelectedCategoty)="manager.onSetSelectedCategoty($event)"
                  (inputValueChange)="manager.onValueChanged($event)"
                  (masterValueChange)="manager.onMasterValueChange($event)"
                  (paymentGridUpdate)="manager.onPaymentGridUpdate($event)"
                  (saveData)="manager.onSaveData($event)"
                  (removeContact)="manager.onRemoveContact($event)"
                  (updateContactData)="manager.onUpdatedContact($event)"
                  (removeContactData)="manager.onRemoveContact($event)"
                  (updateGridData)="manager.onUpdateGridData($event)"
                  (gridItemSelect)="manager.onGridItemSelect($event)"
                  (deleteGridItem)="manager.onDeleteGridItem($event)"
                  >
                  </dps-add-edit-estate-layout>
              </dps-estate-overview-manager>`
})
export class EstateOverviewRouterHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: string, token: string },
    public dialogRef: MatDialogRef<EstateOverviewManagerComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
