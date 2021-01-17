import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatterSearchGridData } from '../../core/lib/matter';
import { MatterLinkedType } from '../../matter-linked-core/models/enum';
// import { BillingGuidePopupInput } from '../../billing-guide-core/models/interfaces';

@Component({
  selector: 'dps-matter-linked-desktop-popup',
  template: `<dps-matter-linked-desktop-manager (closePopup)="onClose($event)"
  [token]="data.token"
  [matterRef]="data.matterRef"
  [openFrom]="data.openFrom"
  [matterData]="data.matterData"
  [screenId]="data.screenId"
  [diaryIds]="data.diaryIds"
   #manager>
  <dps-matter-linked-layout
  [matterData]="data.matterData"
   [gridData]="manager.gridData$ | async"
   [isPopup]="true"
   [title]="data.title"
   [isLoading]="manager.isLoading$ | async"
   [coloumnDef]="manager.coloumnDef$ | async"
   [selectedMatterData] = "manager.selectedMatter$ | async"
   [multiSelectItem] = "manager.multiSelectItem$ | async"
   [plotRange]= "manager.plotRange$ | async"
   [plotSyncSuccessInfo]="manager.plotSyncSuccessInfo$ | async"
   [onlySelectMatter]="manager.onlySelectMatter"
   [openFrom]="data.openFrom"
  (selectedMatter)="manager.onSelectedMatter($event)"
  (onCreateLinkedMatter)="manager.createLinkedMatter($event)"
  (onOpenLinkedMatter)="manager.openLinkedMatter($event)"
  (closePopup)="manager.close($event)"
  (selectAllMatter) = "manager.onSelectAllMatter($event)"
  (multiSelectMatter) = "manager.onMultiSelectMatter($event)"
  (savePlotSaleScreenData)="manager.onSavePlotSaleScreenData()"
  (changePlotRange)="manager.onChangePlotRange($event)"
  (saveDiaryChaser)="onClose($event)">
  </dps-matter-linked-layout>
  </dps-matter-linked-desktop-manager>`,
  styles: []
})

export class MatterLinkedDesktopPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    matterRef: string,
    openFrom: MatterLinkedType,
    token: string,
    matterData: MatterSearchGridData,
    screenId: any,
    diaryIds: any,
    title: string,
  },
    public dialogRef: MatDialogRef<MatterLinkedDesktopPopupComponent>, private dialog: MatDialog) { }

  ngOnInit() {

  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}
