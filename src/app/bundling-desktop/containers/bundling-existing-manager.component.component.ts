import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { BaseBundlingManager } from '../../bundling-core/containers';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';
import { ExistingRecordPopUpInput } from '../../bundling-core/models/interface';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

@Component({
  selector: 'dps-bundling-existing-manager',
  template: `<dps-general-popup-manager #generalPopupManager
                    [token]="generalPopupToken"
                    [searchText]="''"
                    [sitePath]="sitePath"
                    [isFrontEndFilter]="true"
                    [colDefs]="columnDef"
                    [request]="request">
                  <dps-general-popup [generalPopupManager]=generalPopupManager
                        [popupTitle] = "popupTitle"
                        [columnDef] = "columnDef"
                        [hideSearchBox]="true"
                        [hidePaginator]="true">
                        <dps-bundled-exisiting-record-row
                            [columnDef]="columnDef"
                            [isTreeDirty]="isTreeDirty(data.token)|async"
                            [generalPopupRowData]="generalPopupManager.generalPopupDataList$|async"
                            (selectdRow)="onSelectRow($event)"
                            (close)="dialogRef.close()">
                        </dps-bundled-exisiting-record-row>
                  </dps-general-popup>
                  </dps-general-popup-manager>`
})
export class BundlingExistingManagerComponent extends BaseBundlingManager {

  constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: ExistingRecordPopUpInput, token: string },
    public dialogRef: MatDialogRef<BundlingExistingManagerComponent>, private dialog: MatDialog) {
    super(store);
  }
  generalPopupToken = this.data.token + 'ExistingList';
  sitePath = '/pdfbundle/GetBundleList';
  popupTitle = 'Open PDF Bundle';
  request = new PDFBundleCaseFileIdentityWithAppIdRequestViewModel(
    {
      branchId: this.data.input.branchId,
      appId: this.data.input.appId,
      fileId: this.data.input.fileId,
      displayDataString: this.data.input.displayDataString
    },
    false,
    this.sitePath
  );
  columnDef = [
    createDefultColumnDef('name', { label: 'Name', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('ofDocs', { label: '# of Docs', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('Created', { label: 'Created', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('lastSubmitted', { label: 'Last submitted', fxFlex: '200px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('by', { label: 'By', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
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
export class PDFBundleCaseFileIdentityWithAppIdRequestViewModel {
  constructor(public caseFileIdentityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel,
    public excludeInProgress: boolean,
    public sitePath: string) { }

  public toPost() {
    return { caseFileIdentityWithAppIdViewModel: this.caseFileIdentityWithAppIdViewModel, excludeInProgress: this.excludeInProgress };
  }
}
