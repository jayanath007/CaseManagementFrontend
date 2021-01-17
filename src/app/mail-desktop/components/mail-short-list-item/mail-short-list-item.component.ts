import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MessageListItem, MessageItemWrapper } from '../../../mail-item-core';
import { EventMessage, FollowupFlag } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-mail-short-list-item',
  templateUrl: './mail-short-list-item.component.html',
  styleUrls: ['./mail-short-list-item.component.scss']
})
export class MailShortListItemComponent implements OnInit, OnChanges {

  @Input() item: MessageListItem<Readonly<EventMessage>>;
  @Input() selectedItems: MessageItemWrapper[];
  @Input() timeZone: boolean;
  @Input() companyCode: any;

  @Output() itemReadUnread = new EventEmitter();
  @Output() itemFlag = new EventEmitter();
  @Output() itemCheck = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  @Output() itemSelect = new EventEmitter();
  showProfileImg = false;

  constructor() { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.item) {
      this.showProfileImg = false;
    }
  }
  select(event: MouseEvent) {
    if (!event.defaultPrevented) {
      if (event.ctrlKey) {
        this.check(event);
      } else {
        this.itemSelect.emit(this.item);
      }
    }
  }
  check(event: MouseEvent) {
    event.preventDefault();
    // let item;
    // if (this.item.selected && this.selectedItems.length === 2) {
    //   this.selectedItems.forEach((val, i) => {
    //     if (val.data.id === this.item.data.id) {
    //       if (i === (this.selectedItems.length - 1)) {
    //         item = this.selectedItems[i - 1];
    //       } else {
    //         item = this.selectedItems[i + 1];
    //       }
    //     }
    //   });
    // } else
    if (this.item.selected && this.selectedItems.length === 1) {
      this.itemSelect.emit(this.item);
    } else {
      this.itemCheck.emit(this.item);
    }
    // if (item) {
    //   this.itemSelect.emit(item);
    // }
  }
  delete(event: MouseEvent) {
    event.preventDefault();
    this.itemDelete.emit({ items: [this.item], deleteOnlyList: false });
  }
  readUnread(event: MouseEvent) {
    event.preventDefault();
    this.itemReadUnread.emit({ items: [this.item], isRead: !this.item.data.isRead });
  }
  flag(event: MouseEvent) {
    event.preventDefault();
    let flag: FollowupFlag;
    if (this.item.data.flag.flagStatus === 'flagged') {
      flag = {
        flagStatus: 'complete',
        completedDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
      };
    } else {
      flag = {
        flagStatus: 'flagged',
        // completedDateTime: { dateTime: '', timeZone: 'UTC'},
        dueDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
        startDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' }
      };
    }
    this.itemFlag.emit({ items: [this.item], flag: flag });
  }

  onDragStart(event: DragEvent) {
    if (this.item.selected) {
      event.dataTransfer.setData('text', 'text/mailItem;jsonString,' + JSON.stringify(this.selectedItems));
    } else {
      event.dataTransfer.setData('text', 'text/mailItem;jsonString,' + JSON.stringify([this.item]));
    }
  }
}
