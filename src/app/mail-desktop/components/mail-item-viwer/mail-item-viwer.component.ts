import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { MessageItemWrapper } from '../../../mail-item-core';
import { ReadingPaneMode } from '../../../auth';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dps-mail-item-viwer',
  templateUrl: './mail-item-viwer.component.html',
  styleUrls: ['./mail-item-viwer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailItemViwerComponent implements OnInit, OnChanges {

  @Input() item: MessageItemWrapper;
  @Input() hasNext: boolean;
  @Input() hasPrevious: boolean;
  @Input() timeZone: string;
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
  @Output() getEventMessageEvent = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();

  draftToken$ = new BehaviorSubject<string>(null);

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.item &&
      (changes.item.firstChange || !changes.item.previousValue ||
        (changes.item.currentValue && changes.item.currentValue.data.id !== changes.item.previousValue.data.id)) &&
      changes.item.currentValue &&
      changes.item.currentValue.data.event && ((changes.item.currentValue.data.event.id &&
        changes.item.currentValue.data.event.isOrganizer === undefined) || !changes.item.currentValue.data.event.id)) {
      this.getEventMessageEvent.emit(changes.item.currentValue);
    }

    if (changes.item && (changes.item.firstChange || !changes.item.previousValue) && changes.item.currentValue) {
      this.draftToken$.next(this.item.data.id);
    } else if (changes.item && changes.item.currentValue) {
      setTimeout(() => {
        this.draftToken$.next(this.item.data.id);
      }, 1000);
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
  onMeetingResponse({ item, comment, sendResponse, type }) {
    this.meetingResponse.emit({ item: item, comment: comment, sendResponse: sendResponse, type: type });
  }
  onReplyForward({ item, type }) {
    this.replyForward.emit({ item: this.item, type: type });
  }
  onDownloardFileAttachment(data) {
    this.downloardFileAttachment.emit(data);
  }
  onOpenUrlPoup(item) {
    this.openUrlPoup.emit(item);
  }

  onViewDpsFile(event) {
    this.viewDpsFile.emit(event);
  }
  onAttachToNewMail(itemAttachments) {
    this.attachToNewMail.emit(itemAttachments);
  }

  onOpenAttachement(event) {
    this.openAttachement.emit(event);
  }
  onSetAutoReadItemId(event) {
    this.setAutoReadItemId.emit(event);
  }
  onRemoveFromCalendar(event) {
    this.removeFromCalendar.emit(event);
  }
}
