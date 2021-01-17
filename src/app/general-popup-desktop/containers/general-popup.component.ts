
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';


@Component({
    selector: 'dps-general-popup',
    template: `
      <dps-general-popup-layout
      [paginatorDef] = "generalPopupManager.paginatorDef$ | async"
      [generalPopupList] = "generalPopupManager.generalPopupDataList$ | async"
      [totalItems]="generalPopupManager.totalItems$ | async"
      [popupTitle] = "popupTitle"
      [columnDef] = "generalPopupManager.columnDef$|async"
      [searchText]="generalPopupManager.searchText$ | async"
      [isLoading]="generalPopupManager.isLoading$ | async"
      [isFrontEndFilter]="generalPopupManager.isFrontEndFilter$ | async "
      [hideSearchBox]="hideSearchBox"
      [hidePaginator]="hidePaginator"
      (selectedRow)= "generalPopupManager.selectedRow($event)"
      (updateSearchText)= "generalPopupManager.onUpdateSearchText($event)"
      (changePage)= "generalPopupManager.onChangePage($event)"
      (toggleShorting)="generalPopupManager.onToggleSorting($event)">
      <ng-content></ng-content>
      </dps-general-popup-layout>
    `,
    styles: []
})

export class GeneralPopupComponent implements OnInit {

    @Input() generalPopupManager;
    @Input() sitePath: any;
    @Input() isFrontEndFilter: boolean;
    @Input() popupTitle;
    @Input() columnDef: any;
    @Input() columnsForGeneralPopup;
    @Output() selectedRow = new EventEmitter<any>();
    @Input() hideSearchBox: boolean;
    @Input() hidePaginator: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { token: string, searchText: string },
        public dialogRef: MatDialogRef<GeneralPopupComponent>, private dialog: MatDialog) { }

    ngOnInit() {

    }


}
