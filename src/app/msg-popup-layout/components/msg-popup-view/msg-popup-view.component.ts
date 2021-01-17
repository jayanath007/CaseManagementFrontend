import { Attachment } from '../../../core/lib/microsoft-graph';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainMenuService } from '../../../layout-desktop';

@Component({
  selector: 'dps-msg-popup-view',
  templateUrl: './msg-popup-view.component.html',
  styleUrls: ['./msg-popup-view.component.scss']
})
export class MsgPopupViewComponent implements OnInit {

  @Input() item;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() msgToken: string;

  @Output() chaserPopupClosed = new EventEmitter();
  @Output() fileHistoryMsgReply = new EventEmitter();


  // @Output() meetingResponse = new EventEmitter();
  // @Output() openAttachement = new EventEmitter();
  // @Output() replyForward = new EventEmitter();
  // @Output() downloardFileAttachment = new EventEmitter();
  // @Output() viewDpsFile = new EventEmitter();

  constructor(private layoutMenu: MainMenuService) { }

  ngOnInit() {
  }

  // ********* msg file open start *****************
  onMeetingResponse({ item, comment, sendResponse, type }) {
    // this.meetingResponse.emit({ item: item, comment: comment, sendResponse: sendResponse, type: type });
  }

  onReplyForward({ item, type }) {
    if (this.item.diaryId) {
      this.fileHistoryMsgReply.emit({ diaryId: this.item.diaryId, password: this.item.password, type });
    }
    // this.replyForward.emit({ item: this.item, type: type });
  }

  onOpenAttachement(attachment: Attachment) {
  }

  onDownloardFileAttachment(data: { itemId: number, attachment: Attachment, type: string }) {
  }


  onViewDpsFile(event) {
    if (window.opener && window.opener !== window) {
      localStorage.setItem('viewDpsFile', JSON.stringify(event));
      localStorage.removeItem('viewDpsFile');
    } else {
      this.layoutMenu.goToOpenCaseByMailSubjectOrDiaryId(event);
    }
    this.chaserPopupClosed.emit('close');
  }

  // ********** msg file open end *********************

  onClose() {
    this.chaserPopupClosed.emit('close');
  }

}
