import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridGroupData } from '../../../core/lib/grid-model';
import { FileHistory } from '../../../bundling-core/models/interface';

@Component({
  selector: 'dps-bundling-item-grid-group',
  templateUrl: './bundling-item-grid-group.component.html',
  styleUrls: ['./bundling-item-grid-group.component.scss']
})
export class BundlingItemGridGroupComponent implements OnInit {
  @Input() columnDef: any;
  @Input() fileHistoryData: any;
  @Input() groupData: GridGroupData[];
  @Input() gridData: FileHistory[];
  @Input() selectGroupHash: string[];
  @Input() selectedGridItems: FileHistory[];
  @Input() selectGroup: GridGroupData;
  @Input() loading: boolean;

  @Output() dragStart = new EventEmitter<any>();
  @Output() dragSelect = new EventEmitter<any>();
  @Output() addFiles = new EventEmitter<any>();
  @Output() folderRowChange = new EventEmitter<GridGroupData>();
  @Output() clickGridButton = new EventEmitter<any>();
  @Output() rowExpand = new EventEmitter<any>();
  @Output() openDocument = new EventEmitter<FileHistory>();
  @Output() selectRow = new EventEmitter<{ item: FileHistory, isMuilti: boolean }>();
  @Output() changeSelectGroup = new EventEmitter<GridGroupData>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();

  constructor() { }

  ngOnInit() {
  }

  getFileHistoryGroupData(groupHash) {
    if (this.gridData && this.gridData && this.gridData.length > 0) {
      return this.gridData.filter(row => row.groupHash === groupHash && !row.isRemove);
    }
    return [];
  }

  onGroupRowChange(group: GridGroupData) {
    this.folderRowChange.emit(group);
  }

  isGroupExpand(groupHash: string) {
    if (this.selectGroupHash.find(gh => gh === groupHash)) {
      return true;
    }
    return false;
  }

  select(event) {
    this.dragSelect.emit(event);
  }

  public onClickGridButton(action) {
    this.clickGridButton.emit(action);
  }

  public gridRowExpan(row: FileHistory, event: MouseEvent): void {
    this.rowExpand.emit(row);
  }

  onOpenDocument(item) {
    this.openDocument.emit(item);
  }

  onSelectRow(event: { item: FileHistory, isMuilti: boolean }) {
    this.selectRow.emit(event);
  }
  onDragStart(event, group) {

  }
  onSelectGroup(group: GridGroupData) {
    this.changeSelectGroup.emit(group);
  }
  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }
  getIsAllItemRemove(group: GridGroupData): boolean {
    const removeItem = (this.gridData.filter(row => row.groupHash === group.groupHash && row.isRemove));
    if (removeItem && removeItem.length <  group.count) {
      return true;
    } else {
      return false;
    }
  }
  getNotRemoveCount(group: GridGroupData): number {
    if (this.gridData.find(row => row.groupHash === group.groupHash)) {
      return this.gridData.filter(row => row.groupHash === group.groupHash && !row.isRemove).length;
    } else {
      return group.count;
    }
  }
  getRemoveCount(group: GridGroupData): number {
    return this.gridData.filter(row => row.groupHash === group.groupHash && row.isRemove).length;
  }
}
