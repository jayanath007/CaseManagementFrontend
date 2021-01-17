import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
@Component({
    selector: 'dps-supplier-popup',
    template: `
    <dps-general-popup-manager #generalPopupManager
     [token]="data.token"
     [searchText]="data.searchText"
     [sitePath]="sitePath"
     [isFrontEndFilter]="false"
     [colDefs]="columnDef">

      <dps-general-popup [generalPopupManager]=generalPopupManager
            [popupTitle] = "popupTitle"
            [columnDef] = "columnDef"
            [hideSearchBox]="false"
            [hidePaginator]="false">
               <dps-supplier-popup-grid-fix-row
               [columnDef]="columnDef"
               (doubleSelectedRow)="onDoubleSelectedRow($event)"
               [generalPopupRowData]="generalPopupManager.generalPopupDataList$ | async">
               </dps-supplier-popup-grid-fix-row>
     </dps-general-popup>
  </dps-general-popup-manager>

`,
    styles: []

})
export class SupplierPopupComponent implements OnInit {
    sitePath = '/EChit/GetSuppliersP';
    popupTitle = 'Supplier';


    columnDef = [
        createDefultColumnDef('SupplierRef', { label: 'Supplier Ref', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('SupplierName', { label: 'Supplier Name', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('Category', { label: 'Category', fxFlex: '200px', filterAnchor: 'start', filterHidden: true }),
    ];

    constructor(public dialogRef: MatDialogRef<SupplierPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { token: string, searchText: string, }) {
    }

    ngOnInit() {
    }

    onClose(event) {
        this.dialogRef.close(event);
    }

    onDoubleSelectedRow(event) {
        this.dialogRef.close(event);
    }
}
