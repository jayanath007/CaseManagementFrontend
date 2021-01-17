import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { MessageItemWrapper, MessageListItem } from '../../../mail-item-core';

@Component({
  selector: 'dps-mail-list-view',
  templateUrl: './mail-list-view.component.html',
  styleUrls: ['./mail-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailListViewComponent implements OnInit {

  constructor() { }

  @Input() items: MessageListItem<MsGraphBeta.Message>[];
  @Input() selectedItems: MessageItemWrapper[];
  @Input() timeZone: boolean;
  @Input() companyCode: any;

  @Output() itemsReadUnread = new EventEmitter();
  @Output() itemsFlag = new EventEmitter();
  @Output() itemCheck = new EventEmitter();
  @Output() itemsDelete = new EventEmitter();
  @Output() itemSelect = new EventEmitter();
  ngOnInit() {
  }
  onItemsReadUnread({items, isRead}) {
    this.itemsReadUnread.emit({items: items, isRead: isRead});
  }
  onItemsFlag({ items, flag }) {
    this.itemsFlag.emit({ items: items, flag: flag });
  }
  onItemCheck(item) {
    this.itemCheck.emit(item);
  }
  onItemsDelete({ items, deleteOnlyList }) {
    this.itemsDelete.emit({ items: items, deleteOnlyList: deleteOnlyList});
  }

  onItemSelect(item) {
    this.itemSelect.emit(item);
  }
}
