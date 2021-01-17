import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FilterTypes, OrderBy, SortDir, MessageListActions, FolderItemWrapper } from '../../../mail-core';
import { MessageItemWrapper } from '../../../mail-item-core';

@Component({
  selector: 'dps-folder-content-layout',
  templateUrl: './folder-content-layout.component.html',
  styleUrls: ['./folder-content-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderContentLayoutComponent implements OnInit {

  @Input() activeItems: MessageItemWrapper[];
  @Input() selectedItems: MessageItemWrapper[];
  @Input() activeViewInfo: any;
  @Input() hidden: boolean;
  @Input() isItemsLoading: boolean;
  @Input() viewId: string;
  @Input() listOptions: any;
  @Input() isSearching: boolean;
  @Input() timeZone: boolean;
  @Input() companyCode: any;
  @Input() folderList: { [id: string]: Readonly<FolderItemWrapper>; };

  @Output() itemsReadUnread = new EventEmitter();
  @Output() itemsFlag = new EventEmitter();
  @Output() itemCheck = new EventEmitter();
  @Output() itemsDelete = new EventEmitter();
  @Output() itemSelect = new EventEmitter();
  @Output() listViewChange = new EventEmitter();
  @Output() attachToNewMail = new EventEmitter();
  @Output() moveToFolder = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onItemsReadUnread({ items, isRead }) {
    this.itemsReadUnread.emit({ items: items, isRead: isRead });
  }

  onItemsFlag({ items, flag }) {
    this.itemsFlag.emit({ items: items, flag: flag });
  }

  onItemCheck(item) {
    this.itemCheck.emit(item);
  }

  onItemsDelete({ items, deleteOnlyList }) {
    this.itemsDelete.emit({ items: items, deleteOnlyList: deleteOnlyList });
  }

  onItemSelect(item) {
    this.itemSelect.emit({ item: item, viewId: this.viewId, readingPaneMode: 'hide' });
  }

  onListViewChange(changes) {
    this.listViewChange.emit({ viewId: this.viewId, changes: changes });
  }
  onAttachToNewMail(itemAttachments) {
    this.attachToNewMail.emit({ itemAttachments: itemAttachments, readingPaneMode: 'hide' });
  }
  onMoveToFolder(event) {
    this.moveToFolder.emit(event);
  }
}
