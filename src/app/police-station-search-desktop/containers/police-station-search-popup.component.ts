import { Component, OnInit, Inject } from '@angular/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PoliceStationList } from '../../core/lib/police-station';

@Component({
  selector: 'dps-police-station-search-popup',
  template: `<dps-general-popup-manager #generalPopupManager
  [token]="data.token"
  [searchText]="data.searchText"
  [sitePath]="sitePath"
  [isFrontEndFilter]="true"
  [colDefs]="columnDef">

   <dps-general-popup [generalPopupManager]=generalPopupManager
         [popupTitle] = "popupTitle"
         [columnDef] = "columnDef"
         [hideSearchBox]="false"
         [hidePaginator]="true">
         <dps-police-station-grid-fix-row
              [columnDef]="generalPopupManager.columnDef$|async"
              [generalPopupRowData]="generalPopupManager.generalPopupDataList$ | async"
              (selectedRow)="onSelectedRow($event)">
         </dps-police-station-grid-fix-row>
  </dps-general-popup>
</dps-general-popup-manager>`
})
export class PoliceStationSearchPopupComponent implements OnInit {
  sitePath = '/CrimeTime/GetPoliceStationLookupData';
  popupTitle = 'Crime Lookups';
  columnDef = [
    createDefultColumnDef('code', { label: 'Police Station ID', fxFlex: '110px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('name', { label: 'Police Station Name', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
  ];
  constructor(public dialogRef: MatDialogRef<PoliceStationSearchPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string, searchText: string, }) {
  }

  ngOnInit() {
  }

  onClose(event) {
    this.dialogRef.close(event);
  }

  onSelectedRow(row: PoliceStationList) {
    this.dialogRef.close(row);
  }

}



