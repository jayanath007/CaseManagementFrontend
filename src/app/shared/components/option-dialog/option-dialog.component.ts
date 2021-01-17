import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmDialogResultKind, ConfirmDialogResult } from '../../models/dialog';
import { OptionDialogInput, OptionDialogOptionList } from '../..';

@Component({
  selector: 'dps-option-dialog',
  templateUrl: './option-dialog.component.html',
  styleUrls: ['./option-dialog.component.scss']
})
export class OptionDialogComponent implements OnInit {
  // list: OptionDialogOptionList[] = this.data.list;

  ConfirmDialogResultKind = ConfirmDialogResultKind;
  constructor(@Inject(MAT_DIALOG_DATA) public data: OptionDialogInput, public dialogRef: MatDialogRef<OptionDialogComponent>) { }

  hidePanel = false;
  ngOnInit() {
  }

  selectItem(item: OptionDialogOptionList) {
    if (item.isSelect && this.data.needOneSelected) {
      this.hidePanel = true;
      setTimeout(() => this.hidePanel = false, 10);
      return;
    }
    this.data.list.forEach(dataItem => {
      if (item.value === dataItem.value) {
        dataItem.isSelect = true;
      } else if (!this.data.isMultipleSelect) {
        dataItem.isSelect = false;
      } else {
        dataItem.isSelect = dataItem.isSelect;
      }
    });

  }

  onAction() {
    this.close(this.data.list);
    this.dialogRef.close(this.data.list);
  }

  close(list) {
    this.dialogRef.close(list);
  }
}
