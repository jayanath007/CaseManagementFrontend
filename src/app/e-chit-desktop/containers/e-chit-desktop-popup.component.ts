import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { EChitPopupInput } from '../../e-chit-core/models/interfaces';

@Component({
  selector: 'dps-e-chit-desktop-popup',
  template: ` <dps-e-chit-desktop-manager
   [inputData]="data.input" [token]="data.token" #manager>

  <dps-e-chit-layout
  [loading]="manager.loading$ | async"
  [formDataModel]="manager.formDataModel$ | async"
  [sapullerVatCode]="manager.vatCode$ | async"
  [model]="manager.model$ | async"
  [eChitType] ="manager.eChitType$ | async"
  [matterDetailsName]  ="manager.matterDetailsName$ | async"
  [eChitOpenType]  ="manager.eChitOpenType$ | async"
  [isSavingData]  ="manager.isSavingData$ | async"
  [matterDisplyName]="manager.resoleModuleName('matter_search')|async"
  [disbTotal]  ="manager.disbTotal$ | async"
  [feeTotal]  ="manager.feeTotal$ | async"
  [disburcementValu]  ="manager.disburcementValu$ | async"
  [selectedDisbuType]  ="manager.selectedDisbuType$ | async"
  [selectedWorkType]  ="manager.selectedWorkType$ | async"
  [incDisbuBreakDown]  ="manager.incDisbuBreakDown$ | async"
  [supplierDocEnables] ="manager.supplierDocEnables$ | async"
  [isClose] ="manager.close$ | async"
  [matterRefData]="manager.matterRefData$ | async"
  [toMatterRefData]="manager.toMatterRefData$ | async"
  [classType]="manager.classType$|async"
  [attTypeList]="manager.attTypeList$|async"
  [inputData]="manager.inputData$|async"
  (changeExtraEChitPopupInput)="manager.onChangeExtraEChitPopupInput($event)"
  (save)="manager.onSave($event)"
  (changeEChitType)="manager.onChangeEChitType($event)"
  (getMatterBalances)="manager.onGetMatterBalances($event)"
  (addAttachment)="manager.onAddAttachment($event)"
  (getSupplierVatCode)="manager.onGetSupplierVatCode($event)"
  (changeClassType)="manager.changeClassType($event)"
  (changeWorkType)="manager.changeWorkType($event)"

  (onEChitMatterSearchPopupOpen)="manager.onEChitMatterSearchPopupOpen($event)"
  (onEChitToMatterSearchPopupOpen)="manager.onEChitToMatterSearchPopupOpen($event)"
   (changeDisbTypes)="manager.onChangeDisbTypes($event)"
    (changeDisbValue)="manager.onChangeDisbValue($event)"
  (close)="manager.close($event)">

  </dps-e-chit-layout>

  </dps-e-chit-desktop-manager>
`,
  styles: []
})


export class EChitDesktopPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: EChitPopupInput, token: string },
    public dialogRef: MatDialogRef<EChitDesktopPopupComponent>, private dialog: MatDialog) { }

  ngOnInit() {

  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}
