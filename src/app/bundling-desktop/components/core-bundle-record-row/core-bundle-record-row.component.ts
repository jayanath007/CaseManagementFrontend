
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { BundleTreeItem } from '../../../bundling-core/models/interface';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';
import { MatDialog } from '@angular/material';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';

@Component({
  selector: 'dps-core-bundle-record-row',
  templateUrl: './core-bundle-record-row.component.html',
  styleUrls: ['./core-bundle-record-row.component.scss']
})
export class CoreBundleRecordRowComponent {

  constructor(private dialog: MatDialog) { }

  @Input() rowData: BundleTreeItem[];
  @Input() columnDef: ColumnDef[];
  @Input() isTreeDirty: boolean;
  @Input() changedItemId: string[];
  @Output() selectdRow = new EventEmitter<PDFBundleHeaderViewModel>();
  @Output() close = new EventEmitter();
  @Output() changeItem = new EventEmitter<BundleTreeItem>();

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onRowSelect(rowData: PDFBundleHeaderViewModel) {
    if (this.isTreeDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Open Bundle . . .',
          message: 'The Current bundle will be replaced. Discard changes?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.close.emit();
        } else if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.selectdRow.emit(rowData);
        }
      });
    } else {
      this.selectdRow.emit(rowData);
    }
  }
  get getRowData(): BundleTreeItem[] {
    return this.rowData.filter(r => !r.isRoot && !r.isFolder && !r.isCoverPage);
  }
  getFolderName(row: BundleTreeItem): string {
    return this.rowData.find(r => r.id === row.parentId).lable;
  }
  onChangeItem(row: BundleTreeItem) {
    this.changeItem.emit(row);
  }
  getIsCoreBundle(row: BundleTreeItem): boolean {
    if (this.changedItemId.find(i => i === row.id)) {
      return !row.isCoreBunlde;
    }
    return row.isCoreBunlde;
  }
}







