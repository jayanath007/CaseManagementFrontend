import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FollowupFlag, EventMessage } from '../../../core/lib/microsoft-graph';
import { MessageListItem, MessageItemWrapper } from '../../../mail-item-core';

@Component({
  selector: 'dps-mail-list-item',
  templateUrl: './mail-list-item.component.html',
  styleUrls: ['./mail-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailListItemComponent implements OnInit, OnChanges {

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
        this.itemCheck.emit(this.item);
      } else {
        this.itemSelect.emit(this.item);
      }
    }
  }
  check(event: MouseEvent) {
    event.preventDefault();
    this.itemCheck.emit(this.item);
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
// const div = document.createElement('div');
    // const h3 = document.createElement('h4');
    // h3.innerText = '2 items';
    // h3.style.fontFamily = 'unset';
    // h3.style.padding = '3px';
    // h3.style.fontWeight = '100';
    // h3.style.backgroundColor = 'lightgray';
    // div.style.paddingLeft = '20px';
    // div.style.width = 'fit-content';
    // div.appendChild(h3);
    // document.body.appendChild(div);
    // event.dataTransfer.setDragImage(div, 0, 0);
    // setTimeout(() => {
    //   document.body.removeChild(div);
    // });
