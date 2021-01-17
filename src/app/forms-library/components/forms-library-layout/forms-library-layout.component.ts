
import { PosingPeriod } from './../../../setting-core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeDataWrapper } from '../../models/interfce';
import { ItemChangeKind, TreeItemType } from '../../models/enums';

@Component({
  selector: 'dps-forms-library-layout',
  templateUrl: './forms-library-layout.component.html',
  styleUrls: ['./forms-library-layout.component.scss']
})
export class FormsLibraryLayoutComponent implements OnInit {

  @Input() formsLibrarytree: TreeDataWrapper;
  @Input() flLoading: boolean;
  @Input() selectedMenuChildList: TreeDataWrapper[];
  @Input() searchText: string;

  @Output() itemChange = new EventEmitter<any>();
  @Output() searchData = new EventEmitter<any>();
  @Output() formsLibraryClose = new EventEmitter<any>();

  selectedDetailItem: TreeDataWrapper = null;
  TreeItemType = TreeItemType;

  constructor() { }

  ngOnInit() {
  }
  onClose(value) {
    this.formsLibraryClose.emit(value);
  }
  onItemChange(event) {
    this.itemChange.emit(event);
  }
  onTreeItemClick(treeItem) {
    this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: treeItem });
  }
  onDetailViewItemClick(treeItem) {
    this.itemChange.emit({ kind: ItemChangeKind.DetailDbClick, value: treeItem });
    this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: treeItem });
  }
  // runWorkFlow
  onRunWorkFlow(treeItem) {
    this.itemChange.emit({ kind: ItemChangeKind.RunWorkFlow, value: treeItem });
    this.formsLibraryClose.emit('close');
  }
  setSelectedItem(treeItem) {
    this.selectedDetailItem = treeItem;
  }
  onSearchTextClick(searchTest) {
    this.selectedDetailItem = null;
    this.searchData.emit(searchTest);
  }
  // onSearchTextClear(event) {
  //   this.searchData.emit('');
  // }
  onKeydownSearchText(event: any) {
    if (event.keyCode === 13 && event.currentTarget) {
      this.selectedDetailItem = null;
      this.searchData.emit(event.currentTarget.value ? event.currentTarget.value : '');
    }
  }
}
