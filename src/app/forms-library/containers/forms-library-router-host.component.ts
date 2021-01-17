
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormsLibraryManagerComponent } from './forms-library-manager.component';

@Component({
  selector: 'dps-forms-library-router-host.component',
  template: `<dps-forms-library-manager #manager [formsLibraryToken]="data.token" [inputData]="data.input"
            (closePopup)="onClose($event)">
                  <dps-forms-library-layout (formsLibraryClose)="manager.onCloseformsLibrary($event)"
                  [flLoading]="manager.flLoading$ | async"
                  [formsLibrarytree]="manager.formsLibrarytree$ | async"
                  [selectedMenuChildList]="manager.selectedMenuChildList$ | async"
                  [searchText]="manager.searchText$| async"
                  (itemChange)="manager.onItemChange($event)"
                  (searchData)="manager.onSearchText($event)">
                  </dps-forms-library-layout>
            </dps-forms-library-manager>`
})
export class FormsLibraryRouterHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: string, token: string },
    public dialogRef: MatDialogRef<FormsLibraryManagerComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
