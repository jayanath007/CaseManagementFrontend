import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FilterTypes, OrderBy, SortDir, MessageListActions, FolderItemWrapper } from '../../../mail-core';
import { MessageItemWrapper } from '../../../mail-item-core';

@Component({
  selector: 'dps-folder-content-short-layout',
  templateUrl: './folder-content-short-layout.component.html',
  styleUrls: ['./folder-content-short-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderContentShortLayoutComponent implements OnInit {

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
  @Input() viewingItem: MessageItemWrapper;
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

  onItemsDelete({ items, deleteOnlyList }: { items: MessageItemWrapper[], deleteOnlyList: boolean }) {
    // const indexList: number[] = [];
    // let itemList: MessageItemWrapper[];
    // let nextSelectItem: MessageItemWrapper;
    // if (items && items.length > 0 && (items.length > 1 || !items[0].selected)) {
    //   itemList = this.activeItems.filter((val, index) => {
    //     if (items.find(item => val.data.id === item.data.id)) {
    //       indexList.push(index);
    //       return false;
    //     }
    //     return true;
    //   });
    //   indexList.sort((a, b) => a < b ? 1 : -1);
    //   if (itemList.length > indexList[0]) {
    //     nextSelectItem = itemList[indexList[0]];
    //   } else if (itemList.length !== 0) {
    //     nextSelectItem = itemList[indexList[0] - 1];
    //   }
    // }
    this.itemsDelete.emit({ items: items, deleteOnlyList: deleteOnlyList });
    // if (nextSelectItem) {
    //   this.onItemSelect(nextSelectItem);
    // }
  }

  onItemSelect(item) {
    this.itemSelect.emit({ item: item, viewId: this.viewId, readingPaneMode: 'right' });
  }

  onListViewChange(changes) {
    this.listViewChange.emit({ viewId: this.viewId, changes: changes });
  }
  onAttachToNewMail(itemAttachments) {
    this.attachToNewMail.emit({ itemAttachments: itemAttachments, readingPaneMode: 'right' });
  }
  onMoveToFolder(event) {
    this.moveToFolder.emit(event);
  }
  onMultiSelectCancel() {
    const item = this.selectedItems.find(val => val.viewing);
    if (item) {
      this.onItemSelect(item);
    } else {
      this.onItemSelect(this.selectedItems[0]);
    }
  }
}
