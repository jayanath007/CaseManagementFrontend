import {
  Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter,
  ViewChild, ElementRef, OnChanges, SimpleChanges
} from '@angular/core';


import { Attachment, EventMessageRequest } from '../../../core/lib/microsoft-graph';
import { ReplyForwardType, MessageListItem } from '../../../mail-item-core';
import { TimezonePipe } from '../../../shared/pipes/timezone.pipe';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-mail-view-content',
  templateUrl: './mail-view-content.component.html',
  styleUrls: ['./mail-view-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailViewContentComponent implements OnInit, OnChanges {
  @Input() item: MessageListItem<Readonly<EventMessageRequest>>;
  @Input() timeZone: boolean;
  @Input() companyCode: any;
  @Input() isItemAttachment: boolean;
  @Input() openFrom: string;
  @Input() isComputerDownloadOnly: string;

  @Output() openAttachement = new EventEmitter();
  @Output() meetingResponse = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() viewDpsFile = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  module = Module;

  @ViewChild('mailBody') mailBody: ElementRef;

  attachments: Attachment[];
  isWindowUrlPopup = false;
  showProfileImg = false;
  isPastEvent = false;

  get requiredAttendees() {
    if (this.item && this.item.data.event && this.item.data.event.attendees) {
      return this.item.data.event.attendees.filter(val => val.type === 'required');
    }
    return [];
  }
  get optionalAttendees() {
    if (this.item && this.item.data.event && this.item.data.event.attendees) {
      return this.item.data.event.attendees.filter(val => val.type === 'optional');
    }
    return [];
  }

  get isProtectedMail() {
    if (this.item && this.item.data.id && this.item.data.attachments) {
      return !!this.item.data.attachments.find(val => val.contentType === 'application/x-microsoft-rpmsg-message');
    }
    return false;
  }

  constructor(private timezonePipe: TimezonePipe, private access: AccessControlService) { }

  ngOnInit() {
    if (window.opener && window.opener !== window && window.name !== 'mail') {
      this.isWindowUrlPopup = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.item && (changes.item.isFirstChange() ||
      ((changes.item.previousValue.data.id !== changes.item.currentValue.data.id) || this.openFrom !== 'mail'))) {
      if (!changes.item.isFirstChange() && ((changes.item.previousValue.data.from && changes.item.currentValue.data.from &&
        changes.item.previousValue.data.from.emailAddress.address !== changes.item.currentValue.data.from.emailAddress.address) ||
        (changes.item.previousValue.data.sender && changes.item.currentValue.data.sender &&
          changes.item.previousValue.data.sender.emailAddress.address !== changes.item.currentValue.data.sender.emailAddress.address))) {
        this.showProfileImg = false;
      }
      this.attachments = [];
      if (this.item.data.attachments && this.item.data.attachments.length) {
        this.attachments = this.item.data.attachments // msg view send null Attachments
          .filter(value => value && !value.isInline && value.contentType !== 'application/x-microsoft-rpmsg-message');
      }
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      // iframe.setAttribute('sandbox', '');
      iframe.onload = () => {

        const updateHeight = () => {
          setTimeout(() => {
            if (iframe.contentWindow && iframe.contentWindow.document) {
              iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
            }
          }, 100);
          setTimeout(() => {
            if (iframe.contentWindow && iframe.contentWindow.document) {
              iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
            }
          }, 1000);
          setTimeout(() => {
            if (iframe.contentWindow && iframe.contentWindow.document) {
              iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
            }
          }, 5000);
        };

        let body = this.item.data.body.content;
        if (this.item.data.body.contentType !== 'html') {
          body = body.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        body = `<style>
        .dps-white-gray-scroll::-webkit-scrollbar {
          height: 15px;
          width: 15px;
          background-color: rgba(0, 0, 0, 0);
        }
        .dps-white-gray-scroll::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          -webkit-border-radius: 10px;
          border-radius: 10px;
          border: 4px solid rgba(0, 0, 0, 0);
          background-clip: padding-box;
          height: 40px;
          width: 40px;
        }
        .dps-white-gray-scroll{
          scrollbar-face-color: #c1c1c1;
          overflow-x: auto;
          overflow-y: hidden;
        }
      </style>` + body;
        body = body.replace(/<base[^>]+>/g, '');
        iframe.contentDocument.write(body);
        if (iframe.contentDocument.head && iframe.contentWindow.document && iframe.contentWindow.document.body) {

          (<ChildNode[]><any>iframe.contentWindow.document.body.childNodes).forEach(node => {
            if (node.nodeType !== 3) {
              node['className'] = node['className'] + ' dps-white-gray-scroll';
            }
          });
          const base = document.createElement('base');
          base.target = '_blank';
          iframe.contentDocument.head.appendChild(base);
          const imgs = iframe.contentDocument.querySelectorAll<HTMLImageElement>('img[src]');
          for (let i = 0; i < imgs.length; i++) {
            const src = imgs[i].src;
            imgs[i].src = '//:0';
            const title = imgs[i].title;
            imgs[i].title = 'Click here to view image';
            const styleWidth = imgs[i].style.width;
            const styleHeight = imgs[i].style.height;
            const width = imgs[i].width;
            const height = imgs[i].height;
            imgs[i].style.width = '20px';
            imgs[i].style.height = '20px';
            imgs[i].removeAttribute('height');
            imgs[i].removeAttribute('width');
            let retryCount = 1;
            imgs[i].onclick = (event: MouseEvent) => {
              event.target['src'] = src;
              event.target['title'] = title;
              event.preventDefault();
              event.stopPropagation();
              setTimeout(() => {
                imgs[i].onclick = null;
              }, 100);
            };
            imgs[i].onload = (event: Event) => {
              if (event.target['src'] === src) {
                for (let ind = 0; ind < imgs.length; ind++) {
                  if (imgs[ind].onclick) {
                    imgs[ind].click();
                    break;
                  }
                }
                imgs[i].style.width = styleWidth;
                imgs[i].style.height = styleHeight;
                if (width) {
                  imgs[i].setAttribute('width', width + 'px');
                }
                if (height) {
                  imgs[i].setAttribute('height', height + 'px');
                }
                setTimeout(() => {
                  if (iframe.contentWindow && iframe.contentWindow.document) {
                    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
                  }
                }, 100);
              }
            };
            imgs[i].onerror = (event: Event) => {
              if (event.target['src'] !== 'http://:0/' && event.target['src'] !== 'https://:0/') {
                if (retryCount < 4) {
                  event.target['src'] = '/assets/img-loading.gif';
                  imgs[i].style.width = '150px';
                  imgs[i].style.height = '150px';
                  setTimeout(() => {
                    event.target['src'] = src;
                    retryCount++;
                  }, 1000 * retryCount);
                } else {
                  imgs[i].src = '//:0';
                  imgs[i].style.width = '20px';
                  imgs[i].style.height = '20px';
                  imgs[i].title = 'Click here to view image';
                  retryCount = 1;
                  imgs[i].onclick = (e: MouseEvent) => {
                    e.target['src'] = src;
                    e.target['title'] = title;
                    e.preventDefault();
                    e.stopPropagation();
                    setTimeout(() => {
                      imgs[i].onclick = null;
                    }, 100);
                  };
                }
                setTimeout(() => {
                  if (iframe.contentWindow && iframe.contentWindow.document) {
                    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
                  }
                }, 100);
              }
            };
          }
          updateHeight();
        }
      };
      this.mailBody.nativeElement.replaceChild(iframe, this.mailBody.nativeElement.childNodes[0]);
    }

    if (this.item && this.item.data.meetingMessageType &&
      this.item.data.meetingMessageType === 'meetingRequest' && this.item.data.event.type) {
      if (this.item.data.event.type === 'seriesMaster') {
        if (this.item.data.event.recurrence.range.type === 'endDate') {
          this.isPastEvent = new Date(this.timezonePipe.transform(this.item.data.event.recurrence.range.endDate, this.timeZone)).valueOf() <
            new Date(this.timezonePipe.transform(new Date().toISOString(), this.timeZone)).valueOf();
        }
      } else {
        this.isPastEvent = new Date(this.timezonePipe.transform(this.item.data.event.end.dateTime, this.timeZone)).valueOf() <
          new Date(this.timezonePipe.transform(new Date().toISOString(), this.timeZone)).valueOf();
      }
    } else {
      this.isPastEvent = false;
    }

  }

  onMeetingResponse({ item, comment, sendResponse, type }) {
    this.meetingResponse.emit({ item: item, comment: comment, sendResponse: sendResponse, type: type });
  }
  onRemoveFromCalendar() {
    if (this.item.data.event.id) {
      this.removeFromCalendar.emit({ item: this.item, eventId: this.item.data.event.id });
    } else {
      this.itemDelete.emit({ item: this.item, deleteOnlyList: false });
    }
  }

  onReplyForward(type: ReplyForwardType) {
    this.replyForward.emit({ item: this.item, type: type });
  }
  onDownloardFileAttachment({ attachment, type }) {
    this.downloardFileAttachment.emit({ owner: this.item.owner, itemId: this.item.data.id, attachment: attachment, type });
  }
  onViewDpsFile() {
    this.viewDpsFile.emit({ subject: this.item.data.subject, diaryId: this.item.diaryId });
  }

  onOpenAttachement(attachment: Attachment) {
    this.openAttachement.emit(attachment);
  }
  onOpenMatter(event) {
    this.viewDpsFile.emit({ subject: event });
  }

  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

}
