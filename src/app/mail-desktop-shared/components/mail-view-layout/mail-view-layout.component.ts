import {
  Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter,
  OnChanges, SimpleChanges, OnDestroy
} from '@angular/core';
import { MessageItemWrapper } from '../../../mail-item-core';
import { Attachment } from '../../../core/lib/microsoft-graph';
import { ReadingPaneMode } from '../../../auth';

@Component({
  selector: 'dps-mail-view-layout',
  templateUrl: './mail-view-layout.component.html',
  styleUrls: ['./mail-view-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailViewLayoutComponent implements OnInit, OnChanges, OnDestroy {

  @Input() item: MessageItemWrapper;
  @Input() hasNext: boolean;
  @Input() hasPrevious: boolean;
  @Input() timeZone: boolean;
  @Input() companyCode: any;
  @Input() emailReadingPaneMode: ReadingPaneMode;
  @Input() autoReadItemId: string;

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() itemReadUnread = new EventEmitter();
  @Output() itemFlag = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  @Output() meetingResponse = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() viewDpsFile = new EventEmitter();
  @Output() attachToNewMail = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() openUrlPoup = new EventEmitter();
  @Output() setAutoReadItemId = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (window.opener && window.opener !== window && window.name !== 'mail' && changes.item && changes.item.isFirstChange() &&
      !changes.item.currentValue.data.isRead) {
      this.onItemReadUnread({ item: changes.item.currentValue, isRead: true });
    } else {
      if (changes.item && !changes.item.isFirstChange() && changes.item.currentValue.data.id !== changes.item.previousValue.data.id &&
        !changes.item.previousValue.data.isRead && this.autoReadItemId === changes.item.previousValue.data.id) {
        this.onItemReadUnread({ item: changes.item.previousValue, isRead: true });
      }
      if (changes.item && changes.item.isFirstChange() && !changes.item.currentValue.data.isRead) {
        this.setAutoReadItemId.emit(changes.item.currentValue.data.id);
        // this.onItemReadUnread({ item: changes.item.currentValue, isRead: true });
      } else if (changes.item && !changes.item.isFirstChange() &&
        changes.item.currentValue.data.id !== changes.item.previousValue.data.id &&
        !changes.item.currentValue.data.isRead) {
        setTimeout(() => {
          this.setAutoReadItemId.emit(changes.item.currentValue.data.id);
        }, 100);
      }
    }

  }
  ngOnDestroy() {
    if (!this.item.data.isRead && this.item.data.id === this.autoReadItemId) {
      this.onItemReadUnread({ item: this.item, isRead: true });
    }
  }
  onNext() {
    this.next.emit(this.item);
  }

  onPrevious() {
    this.previous.emit(this.item);
  }

  onClose() {
    this.close.emit(this.item);
  }
  onItemReadUnread({ item, isRead }) {
    this.itemReadUnread.emit({ item: item, isRead: isRead });
  }

  onItemFlag({ item, flag }) {
    this.itemFlag.emit({ item: item, flag: flag });
  }

  onItemDelete({ item, deleteOnlyList }) {
    this.itemDelete.emit({ item: item, deleteOnlyList: deleteOnlyList });
  }
  onOpenUrlPoup(item) {
    this.openUrlPoup.emit(item);
    if (this.emailReadingPaneMode === 'hide') {
      this.close.emit(this.item);
    }
  }

  onMeetingResponse({ item, comment, sendResponse, type }) {
    this.meetingResponse.emit({ item: item, comment: comment, sendResponse: sendResponse, type: type });
  }
  onReplyForward({ item, type }) {
    this.replyForward.emit({ item: this.item, type: type });
  }
  onDownloardFileAttachment(data) {
    this.downloardFileAttachment.emit(data);
  }
  onViewDpsFile(event) {
    this.viewDpsFile.emit(event);
  }
  onAttachToNewMail(itemAttachments) {
    this.attachToNewMail.emit(itemAttachments);
  }

  onOpenAttachement(attachment: Attachment) {
    this.openAttachement.emit({ attachment: attachment, item: this.item });
  }
  onRemoveFromCalendar(event) {
    this.removeFromCalendar.emit(event);
  }
}
