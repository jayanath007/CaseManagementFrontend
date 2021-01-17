import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  UrlPopupReadUnreadItems, UrlPopupFlagItems, UrlPopupMeetingResponse, UrlPopupDownloadAttachment,
  UrlPopupDeleteItems, UrlPopupCreateReplyForward, UrlPopupNewMailWithItemAttachment, UrlPopupRemoveFromCalendar
} from '../../mail-url-popup-core/actions/core';
import { OpenEmailAttachemnt } from '../../document-view';
import { MatSidenav } from '@angular/material';


@Component({
  selector: 'dps-compose-url-popup-view-manager-component',
  template: `
  <dps-notification-boostrap></dps-notification-boostrap>
 <mat-progress-bar mode="indeterminate" *ngIf="mailItem?.loading"></mat-progress-bar>

 <dps-mail-view-layout *ngIf="mailItem && mailItem.data && !mailItem.data.isDraft"
 [item]="mailItem"
 [timeZone]="timeZone"
 [companyCode]="companyCode"
 (close)="onClose($event)"
 (itemReadUnread)="onItemReadUnread($event)"
 (itemFlag)="onItemFlag($event)" (itemDelete)="onItemDelete($event)"
 (meetingResponse)="onMeetingResponse($event)" (replyForward)="onReplyForward($event)"
 (downloardFileAttachment)="onDownloardFileAttachment($event)"
 (viewDpsFile)="onViewDpsFile($event)"
 (attachToNewMail)="onAttachToNewMail($event)"
 (openAttachement)="openAttachemnt($event)"
 (setAutoReadItemId)="onSetAutoReadItemId($event)"
 (removeFromCalendar)="onRemoveFromCalendar($event)"
 >
 </dps-mail-view-layout>
 <dps-compose-mail-store-manager emailReadingPaneMode="hide" [composeItem]="mailItem.data" *ngIf="mailItem?.data?.isDraft">
  <dps-compose-mail-manager #composeManager  *ngIf="mailItem?.data?.isDraft"  [token]="'draftMail'">
    <mat-sidenav-container>
      <mat-sidenav style="width: 250px; border-left: 1px solid #c1c1c1;" mode="side" [disableClose]="true" position="end">
        <dps-email-list-contacts (hideRecipientsList)="onHideRecipientsList()" [contactList]="recipientsList"></dps-email-list-contacts>
      </mat-sidenav>
      <dps-compose-mail-layout
        *ngIf="(composeManager.composeItem$|async)?.isDraft"
        [composeItem]="composeManager.composeItem$|async"
        [followUpText]="composeManager.followUpText$|async"
        [isAttachmentsUploding]="composeManager.isAttachmentsUploding$|async"
        [isAttachmentsDeleting]="composeManager.isAttachmentsDeleting$|async"
        [isDirty]="composeManager.isDirty$|async"
        (addAttachment)="composeManager.onAddAttachment($event)"
        (close)="onClose($event)"
        (send)="composeManager.onSend($event)"
        (draft)="composeManager.onDraft($event)"
        (discard)="composeManager.onDiscard($event)"
        (addToRecipient)="composeManager.onAddToRecipient($event)"
        (addCcRecipient)="composeManager.onAddCcRecipient($event)"
        (addBccRecipient)="composeManager.onAddBccRecipient($event)"
        (removeToRecipient)="composeManager.onRemoveToRecipient($event)"
        (removeCcRecipient)="composeManager.onRemoveCcRecipient($event)"
        (removeBccRecipient)="composeManager.onRemoveBccRecipient($event)"
        (flagFollowUp)="composeManager.onFlagFollowUp($event)"
        (importance)="composeManager.onImportance($event)"
        (downloardFileAttachment)="composeManager.onDownloardFileAttachment($event)"
        (deleteAttachment)="composeManager.onDeleteAttachment($event)"
        (clear)="composeManager.onClear($event)"
        (subjectChange)="composeManager.onSubjectChange($event)"
        [signature]="(composeManager.user$|async)?.signature"
        [profile]="(composeManager.user$|async)?.profile"
        [hasEmailSendAsPermission]="(composeManager.user$|async)?.general?.isUserHasEmailSendAsPermission"
        [enaableChaser]="(composeManager.user$|async)?.isChaserEnable"
        [listAttachements]="composeManager.listAttachements$|async"
        [lastInlineAttachment]="composeManager.lastInlineAttachment$|async"
        [refItem]="composeManager.refItem$|async"
        (openAttachement)="composeManager.onOpenAttachement($event)"
        (bodyChange)="composeManager.onBodyChange($event)"
        [hasRecipientsList]="recipientsList?.length>0"
        (showRecipientsList)="onShowRecipientsList()"
        [token]="composeManager.token">
      </dps-compose-mail-layout>
    </mat-sidenav-container>
  </dps-compose-mail-manager>
  </dps-compose-mail-store-manager>
  `,
  styles: []
})

export class ComposeUrlPopupViewManagerComponent implements OnInit, OnDestroy {

  @Input() mailItem;
  @Input() token;
  @Input() isComposeMailSending: boolean;
  @Input() isComposeMailDeleting: boolean;
  @Input() isComposeMailSendFail: boolean;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() recipientsList;

  @ViewChild(MatSidenav) matSidenav: MatSidenav;

  constructor(private store: Store<any>) { }

  onItemReadUnread({ item, isRead }) {
    this.store.dispatch(new UrlPopupReadUnreadItems(this.token, { items: [item], isRead: isRead }));
  }

  onItemFlag({ item, flag }) {
    this.store.dispatch(new UrlPopupFlagItems(this.token, { items: [item], flag: flag }));
  }

  onMeetingResponse({ item, comment, sendResponse, type }) {
    this.store.dispatch(new UrlPopupMeetingResponse(this.token, { item: item, comment: comment, sendResponse: sendResponse, type: type }));
  }
  onRemoveFromCalendar(event) {
    this.store.dispatch(new UrlPopupRemoveFromCalendar(this.token, event));
  }

  onDownloardFileAttachment({ owner, itemId, attachment, type }) {
    this.store.dispatch(new UrlPopupDownloadAttachment(this.token, { owner, itemId, attachment, type }));
  }
  onItemDelete({ item, deleteOnlyList }) {
    this.store.dispatch(new UrlPopupDeleteItems(this.token, { items: [item], deleteOnlyList: deleteOnlyList === true }));
  }

  onReplyForward({ item, type, token }) {
    this.store.dispatch(new UrlPopupCreateReplyForward(this.token, { item, type }));
  }
  onAttachToNewMail(attachments) {
    this.store.dispatch(new UrlPopupNewMailWithItemAttachment(this.token, { attachments: attachments }));
  }

  onViewDpsFile(event) {
    window.blur();
    localStorage.setItem('viewDpsFile', JSON.stringify(event));
    localStorage.removeItem('viewDpsFile');
  }
  onSetAutoReadItemId(event) {

  }
  onClose(item) {
    setTimeout(() => {
      if (!(this.isComposeMailSending || this.isComposeMailDeleting || this.isComposeMailSendFail)) {
        window.close();
      }
    }, 1000);
  }

  ngOnInit() {

  }
  ngOnDestroy(): void {

  }

  openAttachemnt({ item, attachment }) {
    this.store.dispatch(new OpenEmailAttachemnt({
      owner: item.owner,
      itemId: item.data.id,
      attachement: attachment,
      isEmail: true
    }));
  }
  onShowRecipientsList() {
    this.matSidenav.open();
  }
  onHideRecipientsList() {
    this.matSidenav.close();
  }
}
