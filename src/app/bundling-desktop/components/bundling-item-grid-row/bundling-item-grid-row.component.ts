import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileHistory } from '../../../bundling-core/models/interface';
import { GridGroupData } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-bundling-item-grid-row',
  templateUrl: './bundling-item-grid-row.component.html',
  styleUrls: ['./bundling-item-grid-row.component.scss']
})
export class BundlingItemGridRowComponent implements OnInit {
  @Input() columnDef: any;
  @Input() fileHistoryList: any;
  @Input() gridData: any;
  @Input() folderList: any;
  @Input() isMuiltySelect: any;
  @Input() selectedGridItems: FileHistory[];
  @Input() groupData: GridGroupData;

  @Output() openDocument = new EventEmitter<FileHistory>();
  @Output() selectRow = new EventEmitter<{ item: FileHistory, isMuilti: boolean }>();
  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onOpenDocument(event: Event, item: FileHistory) {
    event.stopPropagation();
    this.openDocument.emit(item);
  }

  onSelectRow(event, item: FileHistory) {
    if (this.isItemSelect(item)) {
      return;
    }
    let isMuilti = false;
    if (event.ctrlKey) {
      isMuilti = true;
    }
    this.selectRow.emit({ item: item, isMuilti: isMuilti });
  }

  onExpand(item, event) {

  }

  isItemSelect(item: FileHistory): boolean {
    if (this.selectedGridItems.find(i => i.diary_UID === item.diary_UID)) {
      return true;
    }
    return false;
  }

}
