import { Message, Attachment } from './../../../core/lib/microsoft-graph';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MsgViewerInput } from '../../models/msg-viewer-input';
import { WebViewService } from '../../../azure-storage';
import { BodyHandlerService } from '../../../organizer-desktop-shared';
import { switchMap, map, take, catchError } from 'rxjs/operators';
import { from, BehaviorSubject } from 'rxjs';
import { Attachments } from '../../../add-note-core';
import { MainMenuService } from '../../../layout-desktop';
import { AuthInfoStateService } from '../../../auth';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { Store } from '@ngrx/store';
import { FileUrlResolverService } from '../../../document-view';
import { DownloadDiaryInlineAttachmentToCloud, RequstReplayToMailForDiaryMsg } from '../../../document-view';
import { V3Error } from '../../../shared';

@Component({
  selector: 'dps-msg-viewer',
  templateUrl: './msg-viewer.component.html',
  styleUrls: ['./msg-viewer.component.scss']
})
export class MsgViewerComponent implements OnInit, OnChanges {

  @Input() input: MsgViewerInput;

  @Output() close = new EventEmitter();

  loading = true;
  item$ = new BehaviorSubject<Message>(null);
  timeZone: string;
  companyCode: any;

  errorMessage = '';

  onError = ({ error }: { error: V3Error }) => {
    this.errorMessage = (error && error.message && error.message.includes('The file not available in the storage'))
      ? 'The file not available in the storage' : '';
    this.loading = false;
    this.item$.next(null);
  }

  get isItemRefNumber() {
    return this.input.viewerFrom === 'diary' && this.input.diaryInput && !isNaN(Number(this.input.diaryInput.itemRef));
  }

  constructor(private webViewService: WebViewService, private bodyHandler: BodyHandlerService,
    private layoutMenu: MainMenuService, private authService: AuthInfoStateService, private store: Store<any>,
    private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.input) {
      this.errorMessage = '';
      this.authService.getUser().pipe(take(1)).subscribe(user => {
        if (user) {
          this.timeZone = user.userTimeZone ? user.userTimeZone.info.alias : '';
          this.companyCode = user.general ? user.general.companyCode : '';
        }
      }
      );

      if (this.input.viewerFrom === 'diary' && this.input.diaryInput) {
        const input = this.input.diaryInput;
        if (input.attachmentRef) {
          this.webViewService.getDiaryWebViewForInlineAttachment(
            input.appCode,
            input.branchId,
            input.fileId,
            input.itemRef,
            input.attachmentRef,
            input.attachmentName).pipe(
              switchMap((data: Message) =>
                from(this.bodyHandler.substituteInlineAttachementPathForDiary(
                  data.body.content, data.attachments as Attachments[],
                  input.appCode, input.branchId,
                  input.fileId, input.itemRef)
                ).pipe(map(body => ({ ...data, body: { ...data.body, content: body } })))
              )
            ).subscribe(
              item => {
                this.item$.next(item);
                this.loading = false;
              },
              this.onError
            );
        } else {
          this.webViewService.getDiaryWebView(
            input.appCode,
            input.branchId,
            input.fileId,
            input.itemRef,
            input.attachmentName).pipe(
              switchMap((data: Message) =>
                from(this.bodyHandler.substituteInlineAttachementPathForDiary(
                  data.body.content, data.attachments as Attachments[],
                  input.appCode, input.branchId,
                  input.fileId, input.itemRef)
                ).pipe(map(body => ({ ...data, body: { ...data.body, content: body } })))
              )
            ).subscribe(
              item => {
                this.item$.next(item);
                this.loading = false;
              },
              this.onError
            );
        }

      } else if (this.input.viewerFrom === 'email' && this.input.emailInput) {

        const input = this.input.emailInput;

        if (input.attachmentId === input.attachment.id) {
          this.webViewService.getMailAttachementWebView(input.owner, input.itemId, input.attachmentId,
            input.attachment['attachmentType'] === 'Item' ? 'ItemAttachment.eml' : input.attachment.name).pipe(
              switchMap((data: Message) =>
                from(this.bodyHandler.substituteInlineAttachementPathForEmail(
                  data.body.content, data.attachments as Attachments[], input.owner,
                  input.itemId, input.attachmentId, input.parentExtention)
                ).pipe(map(body => ({ ...data, body: { ...data.body, content: body } })))
              )
            ).subscribe(
              item => {
                this.item$.next({
                  ...item, attachments: item.attachments ? item.attachments.map(val => ({
                    ...val,
                    '@odata.type': val['attachmentType'] === 'Item' ?
                      '#microsoft.graph.itemAttachment' : '#microsoft.graph.fileAttachment',
                  })) : []
                });
                this.loading = false;
              },
              this.onError
            );
        } else {
          this.webViewService.getMailAttachementWebViewForInlineAttachment(input.owner, input.itemId, input.attachmentId,
            input.parentExtention, input.attachment['attachmentType'] === 'Item' ? 'ItemAttachment.eml' : input.attachment.name,
            (input.attachment as Attachments).viewReferance).pipe(
              switchMap((data: Message) =>
                from(this.bodyHandler.substituteInlineAttachementPathForEmail(
                  data.body.content, data.attachments as Attachments[], input.owner, input.itemId,
                  input.attachmentId, input.parentExtention)
                ).pipe(map(body => ({ ...data, body: { ...data.body, content: body } })))
              )
            ).subscribe(
              item => {
                this.item$.next({
                  ...item, attachments: item.attachments ? item.attachments.map(val => ({
                    ...val,
                    '@odata.type': val['attachmentType'] === 'Item' ?
                      '#microsoft.graph.itemAttachment' : '#microsoft.graph.fileAttachment',
                  })) : []
                });
                this.loading = false;
              },
              this.onError
            );
        }

      }

    }
  }
  onMeetingResponse({ item, comment, sendResponse, type }) {

  }

  onReplyForward({ item, type }) {
    if (this.input.viewerFrom === 'diary') {
      this.store.dispatch(new RequstReplayToMailForDiaryMsg({ diaryId: this.input.diaryInput.itemRef, password: '', type }));
    }
  }

  onOpenAttachement(attachment: Attachments) {
    if (this.input.viewerFrom === 'diary' && attachment.viewReferance) {
      const extension = attachment.name.split('.').pop().toLowerCase();
      const viewReferance = (attachment as Attachments).viewReferance;
      if ((extension === 'msg' || extension === 'eml')) {
        this.popupService.openMsgViewer(
          { ...this.input, diaryInput: { ...this.input.diaryInput, attachmentRef: viewReferance } }
        );
      } else {
        const input = this.input.diaryInput;
        this.webViewService.getDiaryWebViewUrlForInlineAttachment(
          input.appCode,
          input.branchId,
          input.fileId,
          input.itemRef,
          viewReferance,
          attachment.name).subscribe(url => {
            const id = `${input.appCode}-${input.branchId}-
            ${input.fileId}-${input.itemRef}-${viewReferance}`;
            window.open(url, id, 'width=1000,height=900');
          });
      }
    } else if (this.input.viewerFrom === 'email' && attachment.viewReferance) {
      const extension = attachment.name.split('.').pop().toLowerCase();
      if ((extension === 'msg' || extension === 'eml' || attachment.attachmentType === 'Item')) {
        this.popupService.openMsgViewer(
          { ...this.input, emailInput: { ...this.input.emailInput, attachment: attachment } }
        );
      } else {
        const input = this.input.emailInput;
        this.webViewService.getMailAttachementWebViewUrlForInlineAttachment(input.owner, input.itemId,
          input.attachmentId, input.parentExtention, attachment.name, attachment.viewReferance).subscribe(url => {
            const id = `${input.itemId}-${input.attachmentId}-${attachment.viewReferance}`;
            window.open(url, id, 'width=1000,height=900');
          });
      }
    }
  }

  onDownloardFileAttachment(data: { itemId: number, attachment: Attachments, type: string }) {
    if (this.input.viewerFrom === 'diary') {
      if (data.type === 'cloud') {
        this.store.dispatch(new DownloadDiaryInlineAttachmentToCloud({
          diaryId: this.input.diaryInput.itemRef, attachmentName: data.attachment.name
        }));
      } else {
        this.webViewService.getDiaryInlineAttachmentDownloadUrl(
          this.input.diaryInput.appCode,
          this.input.diaryInput.branchId,
          this.input.diaryInput.fileId,
          this.input.diaryInput.itemRef,
          data.attachment.originalReference,
          data.attachment.name).subscribe(url => {
            window.open(url, '_blank');
          });
      }
    } else if (this.input.viewerFrom === 'email') {
      if (data.type === 'cloud') {
      } else {
        const input = this.input.emailInput;
        this.webViewService.getMailAttachementDownloadUrlForInlineAttachment(input.owner, input.itemId,
          input.attachmentId, input.parentExtention, data.attachment.name, data.attachment.originalReference).subscribe(url => {
            window.open(url, '_blank');
          });
      }
    }
  }

  onViewDpsFile(event) {
    if (window.opener && window.opener !== window) {
      localStorage.setItem('viewDpsFile', JSON.stringify(event));
      localStorage.removeItem('viewDpsFile');
    } else {
      this.layoutMenu.goToOpenCaseByMailSubjectOrDiaryId(event);
    }
    this.close.emit();
  }

}
