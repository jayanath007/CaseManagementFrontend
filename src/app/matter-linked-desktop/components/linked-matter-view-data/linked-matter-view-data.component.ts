import { MatterLinkedType } from './../../../matter-linked-core/models/enum';
import { GridData } from './../../../case-task-core/models/interface';
import { ConfirmDialogData } from './../../../shared/models/dialog';
import { ColumnDef } from './../../../core/lib/grid-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatterDataInput } from '../../../matter-linked-core/models/interfaces';

@Component({
  selector: 'dps-linked-matter-view-data',
  templateUrl: './linked-matter-view-data.component.html',
  styleUrls: ['./linked-matter-view-data.component.scss']
})

export class LinkedMatterViewDataComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  @Input() data: any;
  @Input() linkedMatterData: GridData;
  @Input() columnDef: ColumnDef[];
  @Input() onlySelectMatter: boolean;
  @Input() matterData: MatterDataInput;
  @Input() selectedMatterData: any;
  @Input() multiSelectItem: any;
  @Input() openFrom: MatterLinkedType;
  @Input() plotRange: string;



  @Output() onOpenLinkedMatter = new EventEmitter<any>();
  @Output() selectedMatter = new EventEmitter<any>();
  @Output() multiSelectMatter = new EventEmitter<any>();

  matterLinkedType = MatterLinkedType;



  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  openLinkedMatter(event, rowData) {
    event.preventDefault();
    event.stopPropagation();
    this.onOpenLinkedMatter.emit(rowData);
  }

  // onSelectedMatter(event, value) {
  //   // event.preventDefault();
  //   // event.stopPropagation();

  //   this.selectedMatter.emit({ checked: event.checked, matterRef: value });


  // }

  isSelected(matterRef) {
    if (this.selectedMatterData) {

      if (this.selectedMatterData.find(value => value === matterRef)) {
        return true;
      } else { return false; }


    }

  }

  getMultiSelect(matterRef) {
    if (this.multiSelectItem) {

      if (this.multiSelectItem.find(value => value === matterRef)) {
        return true;
      } else { return false; }


    }

  }

  onSelectedMatter(event, e, value) {
    event.preventDefault();
    event.stopPropagation();

    if (this.matterLinkedType.OpenCase !== this.openFrom) {
      e.checked = !e.checked;
      this.selectedMatter.emit({ checked: e.checked, matterRef: value });
    }

  }

  onSelectRow(event, item) {
    event.preventDefault();
    event.stopPropagation();
    if (event.ctrlKey) {
      this.multiSelectMatter.emit(item.matterReferenceNo);
    } else {

      this.multiSelectMatter.emit(null);

    }
  }

  getCellIndex(index: number): number {
    if (this.matterData && !!this.matterData.isPlotMasterMatter) {
      return index;
    }
    return index - 1;

  }

}



