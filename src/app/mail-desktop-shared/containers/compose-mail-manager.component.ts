import { Component, OnInit, Input, ChangeDetectionStrategy, Optional, SimpleChanges, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComposeMailManager } from '../../compose-mail-core/containers/base-compose-mail-manager';
import { Importance, Message } from '../../core/lib/microsoft-graph';
import { AuthInfoStateService } from '../../auth';
import { FileUrlResolverService } from '../../document-view';
import { CidToAttachemntUrlPipe, MsgraphClientService } from '../../organizer-desktop-shared';

@Component({
  selector: 'dps-compose-mail-manager',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeMailManagerComponent extends BaseComposeMailManager implements OnInit, OnChanges {

  @Input() token: string;
  constructor(store: Store<any>, service: AuthInfoStateService,
    urlResolver: FileUrlResolverService, @Optional() inlineAttHandler: CidToAttachemntUrlPipe, graphClient: MsgraphClientService) {
    super(store, service, urlResolver, inlineAttHandler, graphClient);
  }

  ngOnInit() {
    this.composeItem$ = this.getComposeMailByToken(this.token);
    this.refItem$ = this.getRefMailByToken(this.token);
    this.followUpText$ = this.getFollowUpTextByToken(this.token);
    this.isMailSending$ = this.getIsMailSendingByToken(this.token);
    this.isMailSaveing$ = this.getIsMailSaveingByToken(this.token);
    this.isMailDeleting$ = this.getIsMailDeleteingByToken(this.token);
    this.isComposeCloseItem$ = this.getIsComposeCloseItemByToken(this.token);
    this.listAttachements$ = this.getListAttachmentsByToken(this.token);
    this.isAttachmentsUploding$ = this.getIsAttachmentsUplodingByToken(this.token);
    this.isAttachmentsDeleting$ = this.getIsAttachmentsDeletingByToken(this.token);
    this.lastInlineAttachment$ = this.getLastInlineAttachmentByToken(this.token);
    this.isDirty$ = this.getIsDirtyByToken(this.token);
    this.user$ = this.getUser();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.token && !changes.token.isFirstChange()) {
      this.composeItem$ = this.getComposeMailByToken(this.token);
      this.refItem$ = this.getRefMailByToken(this.token);
      this.followUpText$ = this.getFollowUpTextByToken(this.token);
      this.isMailSending$ = this.getIsMailSendingByToken(this.token);
      this.isMailSaveing$ = this.getIsMailSaveingByToken(this.token);
      this.isMailDeleting$ = this.getIsMailDeleteingByToken(this.token);
      this.isComposeCloseItem$ = this.getIsComposeCloseItemByToken(this.token);
      this.listAttachements$ = this.getListAttachmentsByToken(this.token);
      this.isAttachmentsUploding$ = this.getIsAttachmentsUplodingByToken(this.token);
      this.isAttachmentsDeleting$ = this.getIsAttachmentsDeletingByToken(this.token);
      this.lastInlineAttachment$ = this.getLastInlineAttachmentByToken(this.token);
      this.isDirty$ = this.getIsDirtyByToken(this.token);
    }
  }
  onFlagFollowUp(type: string) {
    this.flagFollowUp(type, this.token);
  }
  onImportance(importance: Importance) {
    this.changeImportance(importance, this.token);
  }
  onAddToRecipient(recipient) {
    this.addToRecipient(recipient, this.token);
  }
  onAddCcRecipient(recipient) {
    this.addCcRecipient(recipient, this.token);
  }
  onAddBccRecipient(recipient) {
    this.addBccRecipient(recipient, this.token);
  }
  onRemoveToRecipient(recipient) {
    this.removeToRecipient(recipient, this.token);
  }
  onRemoveCcRecipient(recipient) {
    this.removeCcRecipient(recipient, this.token);
  }
  onRemoveBccRecipient(recipient) {
    this.removeBccRecipient(recipient, this.token);
  }
  onDraft(event: { message: Message, isSuppressErrors: boolean }) {
    this.draft(event, this.token);
  }
  onOpenUrlPoup(composeItem: Message) {
    this.openUrlPoup(composeItem, this.token);
  }
  onDiscard(composeItem: Message) {
    this.discard(composeItem, this.token);
  }
  onSend(composeItem: Message) {
    this.send(composeItem, this.token);
  }
  onClear(composeItem: Message) {
    this.clear(composeItem.id, this.token);
  }
  onAddAttachment({ item, attachment, uid, type }) {
    this.addAttachment(this.token, item, attachment, uid, type);
  }
  onDeleteAttachment({ itemId, attachmentId }) {
    this.deleteAttachment(this.token, itemId, attachmentId);
  }
  onSubjectChange(subject: string) {
    this.changeSubject(subject, this.token);
  }
  onBodyChange(body: string) {
    this.changeBody(body, this.token);
  }
  onOpenAttachement({ itemId, attachment }) {
    this.openAttachement(itemId, attachment);
  }
}
