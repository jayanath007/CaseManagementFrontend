import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';
import { MatDialog } from '@angular/material';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';

@Component({
  selector: 'dps-bundled-exisiting-record-row',
  templateUrl: './bundled-exisiting-record-row.component.html',
  styleUrls: ['./bundled-exisiting-record-row.component.scss']
})
export class BundledExisitingRecordRowComponent {

  constructor(private dialog: MatDialog) { }

  @Input() generalPopupRowData: PDFBundleHeaderViewModel[];
  @Input() columnDef: ColumnDef[];
  @Input() isTreeDirty: boolean;
  @Output() selectdRow = new EventEmitter<PDFBundleHeaderViewModel>();
  @Output() close = new EventEmitter();

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

}






