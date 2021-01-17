import { Component, OnInit, Inject } from '@angular/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import {
  BundlingExistingManagerComponent,
} from './bundling-existing-manager.component.component';
import { BaseBundlingManager } from '../../bundling-core/containers';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

@Component({
  selector: 'dps-core-bundling-manager',
  template: `<dps-core-bundle-record-layout
                [columnDef]="columnDef"
                [rowData]="getBundledAllItemDataList(data.token)|async"
                [isTreeDirty]="isTreeDirty(data.token)|async"
                [bundleHeaderView]="getBundleHeaderViewModel(data.token)|async"
                (changedCoreBundleId)="onChangedCoreBundleId(data.token, $event)"
                [coreBundleHeader]="getCoreBundleHeader(data.token)|async"
                (close)="dialogRef.close()">
            </dps-core-bundle-record-layout>`
})
export class CoreBundlingManagerComponent extends BaseBundlingManager {

  constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<BundlingExistingManagerComponent>, private dialog: MatDialog) {
    super(store);
  }

  columnDef = [
    createDefultColumnDef('section', { label: 'Section', fxFlex: '120px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('date', { label: 'Date', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('description', { label: 'Description', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('excelFromCoreBundle', {
      label: 'Excl. from Core Bundle',
      fxFlex: '90px', filterAnchor: 'start', filterHidden: true
    })
  ];
  onSelectRow(rowData: PDFBundleHeaderViewModel) {
    if (rowData && rowData.pbH_BundleID) {
      this.loadSaveBundleData(this.data.token, rowData);
      this.dialogRef.close();
    } else {
      this.showMessage('Bundle Id is not valid');
    }
  }

  showMessage(msgText) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Message',
        message: msgText
      },
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
  }
}




