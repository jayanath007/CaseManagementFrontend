import { MatDialog } from '@angular/material';
import {
  Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy,
  OnDestroy, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { Message, Importance, Recipient, User } from '../../../core/lib/microsoft-graph';
import { ValidateEmailPipe } from '../../../shared/pipes/validate-email.pipe';
import {
  InforDialogComponent, InforDialogData,
  ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResult, ConfirmDialogResultKind
} from '../../../shared';
import { ComposeTranslationsService } from '../../../compose-mail-core/services/compose-translations.service';
import { ChaserInput, ChaserOutPutType } from '../../../chaser-core';
import { LocalStorageKey } from '../../../core';
import { MainMenuItem } from '../../../layout-desktop';
import { OpenCaseMenueData } from '../../../core/lib/open-case';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { ComposeMailContentComponent } from '../compose-mail-content/compose-mail-content.component';
import { AttachmentWrapper } from '../../../compose-mail-core';
import { AddMailBoxPopupComponent } from '../add-mail-box-popup/add-mail-box-popup.component';


@Component({
  selector: 'dps-compose-mail-layout',
  templateUrl: './compose-mail-layout.component.html',
  styleUrls: ['./compose-mail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeMailLayoutComponent implements OnInit, OnDestroy, OnChanges {
  @Input() composeItem: Message;
  @Input() refItem: Message;
  @Input() followUpText: string;
  @Input() isAttachmentsUploding: boolean;
  @Input() isComposeCloseItem: boolean;
  @Input() isAttachmentsDeleting: boolean;
  @Input() enaableChaser: boolean;
  @Input() signature: string;
  @Input() listAttachements: AttachmentWrapper[];
  @Input() lastInlineAttachment: AttachmentWrapper;
  @Input() token: string;
  @Input() hasRecipientsList: boolean;
  @Input() profile: { upn: string, name: string };
  @Input() hasEmailSendAsPermission: boolean;
  @Input() isDirty: boolean;

  @Output() close = new EventEmitter();
  @Output() addAttachment = new EventEmitter();
  @Output() deleteAttachment = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() send = new EventEmitter();
  @Output() clear = new EventEmitter();
  @Output() discard = new EventEmitter();
  @Output() draft = new EventEmitter();
  @Output() flagFollowUp = new EventEmitter();
  @Output() importance = new EventEmitter();
  @Output() subjectChange = new EventEmitter();
  @Output() addToRecipient = new EventEmitter();
  @Output() removeToRecipient = new EventEmitter();
  @Output() addCcRecipient = new EventEmitter();
  @Output() removeCcRecipient = new EventEmitter();
  @Output() addBccRecipient = new EventEmitter();
  @Output() removeBccRecipient = new EventEmitter();
  @Output() openUrlPoup = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() bodyChange = new EventEmitter();
  @Output() showRecipientsList = new EventEmitter();

  @ViewChild('composeMailContent') composeMailContent: ComposeMailContentComponent;

  dpsSubject = '';
  isErrorReporting = false;
  // localBody = '';
  initBody = '';
  chaserOutPutType: ChaserOutPutType;

  constructor(private dialog: MatDialog,
    public validateEmailPipe: ValidateEmailPipe, public translations: ComposeTranslationsService,
    public popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isComposeCloseItem && !changes.isComposeCloseItem.isFirstChange() &&
      changes.isComposeCloseItem.currentValue === true) {
      this.close.emit(this.composeItem);
    }
    if (changes.composeItem && !changes.composeItem.previousValue && changes.composeItem.currentValue) {
      if (this.composeItem.subject ?
        (this.composeItem.subject.trim().toUpperCase().startsWith('(DPS:') ||
          this.composeItem.subject.trim().toUpperCase().startsWith('#DPS:') ||
          this.composeItem.subject.trim().toUpperCase().startsWith('[DPS:'))
        : false) {
        this.dpsSubject = this.composeItem.subject;
      }
      if (this.composeItem.subject ? this.composeItem.subject.trim().toUpperCase().indexOf('DPS ERROR CODE:') !== -1 : false) {
        this.isErrorReporting = true;
      }
      if (!this.composeItem.id) {
        this.initBody = this.composeItem.body.content;
      }
      // this.localBody = this.composeItem.body.content;
    }

  }
  ngOnDestroy(): void {
    if (this.isDirty && this.draftValidation()) {
      this.composeMailContent.setRecipients();
      // setTimeout(() => {
      this.removeEmptyBody();
      if (this.chaserOutPutType !== ChaserOutPutType.ChaserSucces) {
        this.draft.emit({
          message: this.patchEmail(this.composeItem.from ? {
            displayName: this.composeItem.from.emailAddress.name, mail: this.composeItem.from.emailAddress.address
          } : null), isSuppressErrors: true
        });
      }
      this.clear.emit(this.composeItem);
      // });
    } else {
      this.clear.emit(this.composeItem);
    }
  }
  onSaveAndClose() {
    this.composeMailContent.setRecipients();
    setTimeout(() => {
      this.removeEmptyBody();
      this.draft.emit({
        message: this.patchEmail(this.composeItem.from ? {
          displayName: this.composeItem.from.emailAddress.name, mail: this.composeItem.from.emailAddress.address
        } : null), isSuppressErrors: false
      });
      this.close.emit(this.composeItem);
    });

  }
  onClose() {
    if (this.draftValidation()) {
      this.onDraft(true);
    }
    this.close.emit(this.composeItem);
  }
  onSendWithChaser(sender: User) {
    this.composeMailContent.setRecipients();
    setTimeout(() => {
      this.removeEmptyBody();
      this.draft.emit({ message: this.patchEmail(sender), isSuppressErrors: false, lastDraft: true });
    });
    const openCasesMenuItems: MainMenuItem<OpenCaseMenueData>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.OpenCaseMenuItems));
    const openCaseList = openCasesMenuItems ? openCasesMenuItems.map(value => value.data) : [];
    const chaserInputData: ChaserInput = {
      token: this.token,
      fileNote: this.composeItem.subject,
      unitValue: 0,
      openCaseList: openCaseList,
      dpsSubject: this.dpsSubject,
      toRecipients: this.composeItem.toRecipients,
      from: sender ? { emailAddress: { name: sender.displayName, address: sender.mail } } :
        (this.composeItem.from ? { emailAddress: { name: this.profile.name, address: this.profile.upn } } : undefined)
    };
    this.popupService.openChaserPopup('CHASER_POPUP', chaserInputData).subscribe((data: ChaserOutPutType) => {
      this.chaserOutPutType = data;
      if (data === ChaserOutPutType.ChaserSucces) {
        this.close.emit(this.composeItem);
      } else if (data === ChaserOutPutType.ChaserIgnored) {
        const patchEmail = this.patchEmail(sender);
        if (patchEmail.subject) {
          patchEmail.subject = this.removedDpsData(patchEmail.subject);
          if (!patchEmail.subject) {
            this.onSubjectChange('');
            this.dpsSubject = '';
            this.isErrorReporting = true;
            const dialogData: ConfirmDialogData = {
              content: {
                title: this.translations.send_mail_warning_title,
                message: this.translations.send_mail_warning_message,
                acceptLabel: this.translations.send_mail_warning_accept_label,
                rejectLabel: this.translations.send_mail_warning_reject_label,
              },
              data: this.composeItem
            };

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: dialogData,
              width: '350px',
              panelClass: 'dps-notification'
            });

            dialogRef.afterClosed().subscribe((result: ConfirmDialogResult) => {
              if (result.kind === ConfirmDialogResultKind.Confirmed) {
                this.removeEmptyBody();
                this.send.emit(this.patchEmail(sender));
                this.close.emit(this.composeItem);
              }
            });
          } else {
            this.send.emit(patchEmail);
            this.close.emit(this.composeItem);
          }
        } else {
          this.send.emit(patchEmail);
          this.close.emit(this.composeItem);
        }
      }
    });
  }
  removedDpsData(subject) {
    if (!subject) {
      return subject;
    }
    let newSubject = subject;
    if (subject.trim().toUpperCase().startsWith('#DPS:')) {
      const dpsSubjectCount = subject.split('#DPS:');
      if (newSubject && dpsSubjectCount.length > 0) {
        for (let i = 0; i < dpsSubjectCount.length; i++) {
          const subject1 = dpsSubjectCount[i].split('#DPS:')[0];
          const subject2 = subject1.split('#')[0];
          const subject3 = subject2.split(':');
          const matterKey = '#DPS:' + subject3[0] + ':' + subject3[1] + ':' + subject3[2] + '#';
          newSubject = newSubject.replace(matterKey, '');
        }
        return newSubject;
      } else {
        return subject;
      }
    } else if (subject.trim().toUpperCase().startsWith('[DPS:')) {
      const dpsSubjectCount = subject.split('[DPS:');
      if (newSubject && dpsSubjectCount.length > 0) {
        for (let i = 0; i < dpsSubjectCount.length; i++) {
          const subject1 = dpsSubjectCount[i].split('[DPS:')[0];
          const subject2 = subject1.split(']')[0];
          const subject3 = subject2.split(':');
          const matterKey = '[DPS:' + subject3[0] + ':' + subject3[1] + ':' + subject3[2] + ']';
          newSubject = newSubject.replace(matterKey, '');
        }
        return newSubject;
      } else {
        return subject;
      }
    } else if (subject.trim().toUpperCase().startsWith('(DPS:')) {
      const dpsSubjectCount = subject.split('(DPS:');
      if (newSubject && dpsSubjectCount.length > 0) {
        for (let i = 0; i < dpsSubjectCount.length; i++) {
          const subject1 = dpsSubjectCount[i].split('(DPS:')[0];
          const subject2 = subject1.split(')')[0];
          const subject3 = subject2.split(':');
          const matterKey = '(DPS:' + subject3[0] + ':' + subject3[1] + ':' + subject3[2] + ')';
          newSubject = newSubject.replace(matterKey, '');
        }
        return newSubject;
      } else {
        return subject;
      }
    } else {
      return subject;
    }

  }

  onSend(sender?: User) {
    this.composeMailContent.setRecipients();
    // this.onBodyChange({ body: this.localBody, isLocal: false });
    setTimeout(() => {
      if (this.validationEmail()) {
        if (this.composeItem.subject) {
          if ((this.enaableChaser === true && !this.isErrorReporting) || this.dpsSubject) {
            this.onSendWithChaser(sender);
          } else {
            setTimeout(() => {
              this.send.emit(this.patchEmail(sender));
              this.close.emit(this.composeItem);
            }, 2050);
          }
        } else {
          const dialogData: ConfirmDialogData = {
            content: {
              title: this.translations.send_mail_warning_title,
              message: this.translations.send_mail_warning_message,
              acceptLabel: this.translations.send_mail_warning_accept_label,
              rejectLabel: this.translations.send_mail_warning_reject_label,
            },
            data: this.composeItem
          };

          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            width: '350px',
            panelClass: 'dps-notification'
          });

          dialogRef.afterClosed().subscribe((result: ConfirmDialogResult) => {
            if (result.kind === ConfirmDialogResultKind.Confirmed) {
              this.removeEmptyBody();
              if ((this.enaableChaser === true && !this.isErrorReporting) || this.dpsSubject) {
                this.onSendWithChaser(sender);
              } else {
                this.send.emit(this.patchEmail(sender));
                this.close.emit(this.composeItem);
              }
            }
          });
        }
      }
    });

  }
  onSendAs() {
    const dialogRef = this.dialog.open(AddMailBoxPopupComponent, {
      width: '500px',
      height: '215px',
      panelClass: 'dps-organizer-fld-shared-dialog',
      disableClose: true,
      data: {
        icon: 'send',
        title: 'Send as',
        message: 'Enter the name or email address of a user to send mails on behalf of.',
        sender: this.composeItem.from ? {
          displayName: this.composeItem.from.emailAddress.name, mail: this.composeItem.from.emailAddress.address
        } : null
      }
    });
    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.onSend(result);
      }
    });
  }
  onDraft(isSuppressErrors?: boolean) {
    this.composeMailContent.setRecipients();
    setTimeout(() => {
      this.removeEmptyBody();
      this.draft.emit({
        message: this.patchEmail(this.composeItem.from ? {
          displayName: this.composeItem.from.emailAddress.name, mail: this.composeItem.from.emailAddress.address
        } : null),
        isSuppressErrors: !!isSuppressErrors
      });
    });
  }
  onOpenUrlPoup() {
    setTimeout(() => {
      this.openUrlPoup.emit(this.patchEmail(this.composeItem.from ? {
        displayName: this.composeItem.from.emailAddress.name, mail: this.composeItem.from.emailAddress.address
      } : null));
    }, 2050);
  }
  onDiscard() {
    this.discard.emit(this.composeItem);
    this.close.emit(this.composeItem);
  }
  onFlagFollowUp(type: string) {
    this.flagFollowUp.emit(type);
    this.onDraft();
  }
  onImportance(importance: Importance) {
    this.importance.emit(importance);
    this.onDraft();
  }
  onSubjectChange(subject: string) {
    if (subject !== this.composeItem.subject) {
      this.subjectChange.emit(subject);
      this.onDraft();
    }
  }
  onAddToRecipient(recipient) {
    this.addToRecipient.emit(recipient);
  }
  onAddCcRecipient(recipient) {
    this.addCcRecipient.emit(recipient);
  }
  onAddBccRecipient(recipient) {
    this.addBccRecipient.emit(recipient);
  }
  onRemoveToRecipient(recipient) {
    this.removeToRecipient.emit(recipient);
  }
  onRemoveCcRecipient(recipient) {
    this.removeCcRecipient.emit(recipient);
  }
  onRemoveBccRecipient(recipient) {
    this.removeBccRecipient.emit(recipient);
  }

  onAddAttachment({ attachment, uid, type }) {
    if (attachment.size <= 0 && type === 'fileAttachment') {
      const dialogData: InforDialogData = {
        content: {
          title: `Empty attachemnt`,
          message: `Size of document "<%= displayName %>" is <%= displaySize %> bytes.
          Please attach a nonempty document.`
        },
        data: { messageType: 'alert' },
        contentParams: { displayName: attachment.name, displaySize: '0' },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        panelClass: 'dps-notification'
      });
    } else if (attachment.size < 35000000) {
      this.addAttachment.emit({
        item: this.patchEmail(this.composeItem.from ? {
          displayName: this.composeItem.from.emailAddress.name, mail: this.composeItem.from.emailAddress.address
        } : null), attachment: attachment, uid: uid, type: type
      });
    } else {
      const dialogData: InforDialogData = {
        content: {
          title: this.translations.file_attachment_size_validation_title,
          message: this.translations.file_attachment_size_validation_message
        },
        data: { messageType: 'alert' },
        contentParams: { displayName: attachment.name, displaySize: '' + Math.round(attachment.size / 1000000) },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
    }
  }
  onDownloardFileAttachment({ itemId, attachment, type }) {
    this.downloardFileAttachment.emit({ itemId: itemId, attachment: attachment, type });
  }
  onDeleteAttachment({ itemId, attachmentId }) {
    this.deleteAttachment.emit({ itemId: itemId, attachmentId: attachmentId });
  }
  onOpenAttachement(event) {
    this.openAttachement.emit(event);
  }
  removeEmptyBody() {
    if (!this.composeItem.body.content && this.composeItem.body.contentType !== 'text') {
      this.composeItem.body.content = `<p></p>`;
    }
  }
  onBodyChange({ body, isLocal }) {
    // this.localBody = body;
    // if (!isLocal) {
    this.bodyChange.emit(body);
    this.onDraft();
    // }
  }
  draftValidation(): boolean {
    if (!this.composeItem.id) {
      if ((this.composeItem.attachments && this.composeItem.attachments.length > 0) ||
        (this.composeItem.toRecipients && this.composeItem.toRecipients.length > 0) ||
        (this.composeItem.ccRecipients && this.composeItem.ccRecipients.length > 0) ||
        (this.composeItem.bccRecipients && this.composeItem.bccRecipients.length > 0) ||
        (this.composeItem.body.content ? this.composeItem.body.content !== this.initBody : false) ||
        this.composeItem.subject ||
        this.composeItem.importance !== 'normal' ||
        this.composeItem.flag.flagStatus !== 'notFlagged'
      ) {
        return true;
      }
      return false;
    }
    return true;
  }
  validationEmail(): boolean {
    let isValid = true;
    let massage = '';
    if (this.composeItem.toRecipients.length <= 0 &&
      this.composeItem.ccRecipients.length <= 0 &&
      this.composeItem.bccRecipients.length <= 0) {
      isValid = false;
      massage = this.translations.send_mail_recipient_validation_message;

    } else if (this.isAttachmentsUploding || this.isAttachmentsDeleting) {
      massage = this.translations.send_mail_attachments_validation_message;
      isValid = false;

    } else if (!this.validateEmailList(this.composeItem.toRecipients) ||
      !this.validateEmailList(this.composeItem.ccRecipients) ||
      !this.validateEmailList(this.composeItem.bccRecipients)) {
      isValid = false;
      massage = this.translations.send_mail_valid_recipients_validation_message;
    }
    if (!isValid) {
      const dialogData: InforDialogData = {
        content: {
          title: this.translations.send_mail_validation_title,
          message: massage
        },
        data: { messageType: 'warning' }
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
    }
    return isValid;
  }
  validateEmailList(recipients: Recipient[]) {
    for (let i = 0; i < recipients.length; i++) {
      if (!this.validateEmailPipe.transform(recipients[i].emailAddress.address)) {
        return false;
      }
    }
    return true;
  }
  patchEmail(sender: User): Message {
    return {
      id: this.composeItem.id,
      body: this.composeItem.body,
      subject: this.composeItem.subject,
      toRecipients: this.composeItem.toRecipients || [],
      ccRecipients: this.composeItem.ccRecipients || [],
      bccRecipients: this.composeItem.bccRecipients || [],
      importance: this.composeItem.importance,
      flag: this.composeItem.flag,
      from: sender ? { emailAddress: { name: sender.displayName, address: sender.mail } } :
        (this.composeItem.from ? { emailAddress: { name: this.profile.name, address: this.profile.upn } } : undefined)
    };
  }
  onShowRecipientsList() {
    this.showRecipientsList.emit();
  }
}
