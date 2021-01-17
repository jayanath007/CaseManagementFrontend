import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges,
  SimpleChanges, ElementRef, ViewChild
} from '@angular/core';
import { CalendarEvent } from '../../../calendar-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { TimezonePipe } from '../../../shared/pipes/timezone.pipe';

@Component({
  selector: 'dps-view-event-content',
  templateUrl: './view-event-content.component.html',
  styleUrls: ['./view-event-content.component.scss']
})
export class ViewEventContentComponent implements OnInit, OnChanges {
  @Input() event: CalendarEvent<MsGraphBeta.Event>;
  @Input() freeBusyStatusList: { lable: string, val: MsGraphBeta.FreeBusyStatus }[];
  @Input() reminderList: { lable: string, val: number }[];
  @Input() timeZone: string;
  @Input() companyCode: any;

  @Output() reminderChange = new EventEmitter<{
    calendarId: string, eventId: string, reminderMinutesBeforeStart: number, isSeries: boolean
  }>();
  @Output() showAsStateChange = new EventEmitter<{
    calendarId: string, eventId: string, showAs: MsGraphBeta.FreeBusyStatus, isSeries: boolean
  }>();
  @Output() sensitivityChange = new EventEmitter<{
    calendarId: string, eventId: string, sensitivity: MsGraphBeta.Sensitivity, isSeries: boolean
  }>();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() close = new EventEmitter<string>();
  @Output() openMatter = new EventEmitter();

  @ViewChild('mailBody') mailBody: ElementRef;

  attachments: MsGraphBeta.Attachment[];
  requiredAttendees: MsGraphBeta.Attendee[] = [];
  optionalAttendees: MsGraphBeta.Attendee[] = [];
  isPastEvent = false;

  constructor(private timezonePipe: TimezonePipe) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.event && changes.event.currentValue) {
      this.requiredAttendees = changes.event.currentValue.data.attendees.filter(val => val.type === 'required' &&
        val.emailAddress.address !== changes.event.currentValue.data.organizer.emailAddress.address);
      this.optionalAttendees = changes.event.currentValue.data.attendees.filter(val => val.type === 'optional' &&
        val.emailAddress.address !== changes.event.currentValue.data.organizer.emailAddress.address);
    }
    if (changes.event && (changes.event.isFirstChange() || (changes.event.previousValue.data.id !== changes.event.currentValue.data.id))) {

      this.attachments = [];
      if (this.event.data.attachments && this.event.data.attachments.length) {
        this.attachments = this.event.data.attachments
          .filter(att => !!att) // msg view send null Attachments
          .filter(value => !value.isInline);
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

        let body = this.event.data.body.content;
        if (this.event.data.body.contentType !== 'html') {
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
            const styleWidth = imgs[i].style.width;
            const styleHeight = imgs[i].style.height;
            const width = imgs[i].width;
            const height = imgs[i].height;
            imgs[i].style.width = '150px';
            imgs[i].style.height = '150px';
            imgs[i].removeAttribute('height');
            imgs[i].removeAttribute('width');
            let retryCount = 1;
            imgs[i].onload = (event: Event) => {
              if (event.target['src'] === src) {
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

              if (retryCount < 4) {
                event.target['src'] = '/assets/img-loading.gif';
                setTimeout(() => {
                  event.target['src'] = src;
                  retryCount++;
                }, 1000 * retryCount);
              } else {
                event.target['onerror'] = null;
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
          }
          updateHeight();
        }
      };

      this.mailBody.nativeElement.replaceChild(iframe, this.mailBody.nativeElement.childNodes[0]);
    }
    if (this.event && this.event.data.type === 'seriesMaster' && this.event.data.recurrence.range.type === 'endDate') {
      this.isPastEvent = new Date(this.event.data.recurrence.range.endDate).valueOf() <
        new Date(this.timezonePipe.transform(new Date().toISOString(), this.timeZone) + 'Z').valueOf();
    } else if (this.event && this.event.data.type !== 'seriesMaster') {
      this.isPastEvent = new Date(this.event.data.end.dateTime).valueOf() <
        new Date(this.timezonePipe.transform(new Date().toISOString(), this.timeZone) + 'Z').valueOf();
    }

  }

  onReminderChange(event) {
    this.reminderChange.emit({
      calendarId: this.event.calendarId, eventId: this.event.data.id,
      reminderMinutesBeforeStart: event.value, isSeries: this.event.data.type === 'seriesMaster'
    });
  }

  onShowAsStateChange(event) {
    this.showAsStateChange.emit({
      calendarId: this.event.calendarId, eventId: this.event.data.id,
      showAs: event.value, isSeries: this.event.data.type === 'seriesMaster'
    });
  }

  onIsPrivateChange(event) {
    if (event.checked) {
      this.sensitivityChange.emit({
        calendarId: this.event.calendarId, eventId: this.event.data.id, sensitivity: 'private',
        isSeries: this.event.data.type === 'seriesMaster'
      });
    } else {
      this.sensitivityChange.emit({
        calendarId: this.event.calendarId, eventId: this.event.data.id, sensitivity: 'normal',
        isSeries: this.event.data.type === 'seriesMaster'
      });
    }
  }
  onOpenSeries() {
    this.close.emit('OPEN_SERIES');
  }
  onDownloardFileAttachment({ attachment, type }) {
    this.downloardFileAttachment.emit({ eventId: this.event.data.id, attachment: attachment, type });
  }
  onOpenAttachement(attachment: MsGraphBeta.Attachment) {
    this.openAttachement.emit(attachment);
  }
  onOpenMatter(event) {
    this.openMatter.emit(event);
  }
}
