import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, AfterViewChecked, ViewContainerRef
} from '@angular/core';


import { FolderItemWrapper } from '../../../mail-core/models/interfaces';
import { ComponentBase } from '../../../core';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';


@Component({
  selector: 'dps-folder-tree-view',
  templateUrl: './folder-tree-view.component.html',
  styleUrls: ['./folder-tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderTreeViewComponent extends ComponentBase implements OnInit {

  @Input() folders: FolderItemWrapper[];
  @Input() deleteItemsFolder: FolderItemWrapper;
  @Input() isGroupMode: boolean;

  @Output() itemToggleExpand = new EventEmitter();
  @Output() itemSelect = new EventEmitter();
  @Output() itemEditOperations = new EventEmitter();
  @Output() newRootFolder = new EventEmitter();
  @Output() moveItems = new EventEmitter();
  @Output() itemRefresh = new EventEmitter();

  showInput = false;

  constructor() { super(); }

  ngOnInit() {
  }

  onItemToggle(item: FolderItemWrapper) {
    this.itemToggleExpand.emit(item);
  }

  trackByFn(index: number, item: FolderItemWrapper) {
    return item.data.id;
  }

  onItemSelect(item) {
    this.itemSelect.emit(item);
  }

  onRefresh(item) {
    this.itemRefresh.emit(item);
  }

  onItemEditOperations(action) {
    this.itemEditOperations.next(action);
  }

  onCreateRootFolder(displayName) {
    this.showInput = false;
    if (displayName) {
      this.newRootFolder.emit(displayName);
    }
  }

  onKey(event: KeyboardEvent, value) {
    if (event.keyCode === ESCAPE) {
      event.stopPropagation();
      event.preventDefault();
      this.showInput = false;
    } else if (event.keyCode === ENTER) {
      this.onCreateRootFolder(value);
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onMoveItems(event) {
    this.moveItems.emit(event);
  }
}
