import { BaseEChitAuthorisationsManager } from './../../e-chit-authorisations-core/containers/base-e-chit-authorisations-manager';
import { FileDataViewModel } from '../../e-chit-authorisations-core/models/interfaces';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResultKind } from '../../shared';
import { MatDialog } from '@angular/material';
import { PropertyNameList } from '../../e-chit-authorisations-core/models/enums';
import { BaseBankSearchManagerManager } from '../../bank-search-core/containers/base-bank-search-manager';

@Component({
  selector: 'dps-bank-search-manager',
  template: '<ng-content></ng-content>',
})
export class BankSearchManagerComponent extends BaseBankSearchManagerManager implements OnInit {
  @Input() inputData;
  @Input() authorisationsToken;

  constructor(store: Store<any>, private dialog: MatDialog) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.authorisationsToken, this.inputData);
  }
  onClosePopup(info) {
    this.onCloseAuthorisationsPopup(this.authorisationsToken, info);
  }
  onControllersValueChange(event) {
    if (event.propertyName === PropertyNameList.Reject) {
      this.displayConfirmationMSG(event);
    } else {
      this.onControllerChanges(this.authorisationsToken, event);
    }
  }
  onSelectedRowItem(row) {
    this.onSelectedRow(this.authorisationsToken, row);
  }
  onChangePage(paginatorDef: PaginatorDef) {
    this.changePage(this.authorisationsToken, paginatorDef);
  }
  onViewReport(dataModel: FileDataViewModel) {
    const valArray = dataModel.fileName.split('.');
    let extension = null;
    if (valArray.length > 0) {
      extension = valArray[valArray.length - 1];
    }
    if (extension && extension === 'msg') {
      this.getEmailItem(this.authorisationsToken, dataModel);
    } else {
      this.viewReport(this.authorisationsToken, dataModel);
    }
  }
  onToggleSorting(columDef: ColumnDef) {
    this.ToggleSorting(this.authorisationsToken, columDef);
  }
  displayConfirmationMSG(event) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Message . . .',
        message: 'Are you sure you want to reject this item(s)?',
        acceptLabel: 'Yes',
        rejectLabel: 'No'
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.kind === ConfirmDialogResultKind.Confirmed) {
        this.onControllerChanges(this.authorisationsToken, event);
      }
    });
  }
}
