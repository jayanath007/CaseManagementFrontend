import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Contact, Share, ToCc } from '../../../email-list-core';
import { MatRadioChange, MatCheckboxChange, MatDatepickerInputEvent, MatDialog, MatCheckbox } from '@angular/material';
import { ColumnDef } from '../../../core/lib/grid-model';
import { SubmitType } from '../../../add-note-core';
import { FailDialogData, FailDialogComponent } from '../../../shared';
import { uuid } from '../../../utils/uuid';
import { eBillingType } from '../../../core/lib/matter';
import { WorkType, PrecedentHSModel } from '../../../core/lib/precedentHS';

@Component({
  selector: 'dps-email-list-layout',
  templateUrl: './email-list-layout.component.html',
  styleUrls: ['./email-list-layout.component.scss']
})
export class EmailListLayoutComponent implements OnInit, OnChanges {
  @Input() emailList: Contact[];
  @Input() loading: boolean;
  @Input() closePopup: boolean;
  @Input() share: Share;
  @Input() columnDef: ColumnDef[];
  @Input() reviewDate: string;
  @Input() reviewNote: string;
  @Input() message: string;
  @Input() submitType: SubmitType;

  @Input() pageLoadType: eBillingType;
  @Input() worktypeList: WorkType[];
  @Input() activitiList: PrecedentHSModel[];
  @Input() phaseList: PrecedentHSModel[];
  @Input() phaseWiseTaskList: PrecedentHSModel[];
  @Input() isSilent: boolean;
  @Input() isSafeBoxEnabled: boolean;

  @Output() close = new EventEmitter();
  @Output() shareChange = new EventEmitter();
  @Output() toCcChange = new EventEmitter();
  @Output() reviewDateChange = new EventEmitter();
  @Output() reviewNoteChange = new EventEmitter();
  @Output() messageChange = new EventEmitter();
  @Output() shareAttachment = new EventEmitter();
  @Output() addRecipient = new EventEmitter();
  @Output() exportToRecepient = new EventEmitter<Contact[]>();
  @Output() changeSilent = new EventEmitter<boolean>();

  @ViewChild('isEditable') isEditable: MatCheckbox;

  Share = Share;
  ToCc = ToCc;
  SubmitType = SubmitType;

  get hasToOrCc() {
    if (this.emailList) {
      return this.emailList.filter(val => val.toCc === ToCc.To || val.toCc === ToCc.Cc).length > 0;
    }
    return false;
  }
  constructor(private datePipe: DatePipe, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.submitType === SubmitType.WorkflowShare || this.submitType === SubmitType.MsgViaMLS) {
      this.shareChange.emit(Share.MLSAndSafeChat);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.closePopup && changes.closePopup.currentValue === true) {
      this.close.emit(this.toDataObject());
    }
  }
  onClose() {
    this.close.emit(null);
  }

  toDataObject() {
    return {
      share: this.share,
      toRecipients: this.emailList.filter(item => item.toCc === ToCc.To).map(list => list.email),
      ccRecipients: this.emailList.filter(item => item.toCc === ToCc.Cc).map(list => list.email),
      reviewDate: this.submitType === SubmitType.MsgViaMLS ? '' : this.reviewDate,
      reviewNote: this.submitType === SubmitType.MsgViaMLS ? '' : this.reviewNote,
      message: this.message,
      isEditable: this.isEditable ? this.isEditable.checked : false
    };
  }

  onShare() {

    // (this.share === Share.MLSAndSafeChat && this.message)
    if (this.submitType === SubmitType.SafeBoxSheare ||
      this.submitType === SubmitType.MsgViaMLS ||
      (this.share !== Share.MLSAndSafeChat && this.reviewDate) ||
      (this.share === Share.MLSAndSafeChat && this.reviewDate && this.reviewNote)) {

      const data = this.toDataObject();
      this.shareAttachment.emit(data);

    } else {
      this.displayErrorMassage();
    }
  }


  displayErrorMassage() {

    const detailStatus = [];
    if (!this.reviewDate) {
      detailStatus.push({ title: 'Review Date', message: 'Is a DPS Required field and cannot be empty' });
    }
    if (!this.reviewNote) {
      detailStatus.push({ title: 'Review Note', message: 'Is a DPS Required field and cannot be empty' });
    }
    // if (this.share === Share.MLSAndSafeChat && !this.message) {
    //   detailStatus.push({ title: 'Message', message: 'Is a DPS Required field and cannot be empty' });
    // }

    const dialogData: FailDialogData = {
      messageBody: 'Please correct the validation errors',
      messageHeader: 'Validation error',
      detailStatus: detailStatus,
    };
    const dialogRef = this.dialog.open(FailDialogComponent, {
      data: dialogData,
      width: '450px',
      panelClass: 'dps-notification'
    });

  }



  onShareChange(event: MatRadioChange) {
    this.shareChange.emit(event.value);
  }
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }
  onToCcChange(event: MatCheckboxChange, id, toCc) {
    this.toCcChange.emit({ id, toCc: event.checked ? toCc : null });
  }
  onReviewDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
      this.reviewDateChange.emit(date ? (date + 'T00:00:00') : null);
    } else {
      this.reviewDateChange.emit(null);
    }
  }
  onBlurReviewNote(value) {
    this.reviewNoteChange.emit(value);
  }
  onBlurMessage(value) {
    this.messageChange.emit(value);
  }

  onAddRecipient(event) {
    const contact: Contact = {
      name: event.emailAddress.name,
      email: event.emailAddress.address,
      toCc: ToCc.To,
      contactType: 'User Defined',
      id: uuid()
    };
    this.addRecipient.emit(contact);
  }

  get isShowOptionPanel() {
    if (this.submitType === SubmitType.SafeBoxSheare || this.submitType === SubmitType.NewMailOnly) {
      return false;
    }
    return true;
  }

  onCreateMail() {
    const toRecipient = this.emailList.filter(val => val.toCc === ToCc.To || val.toCc === ToCc.Cc);
    if (toRecipient.length > 0) {
      this.exportToRecepient.emit(toRecipient);
    }
  }

  get showMessageInput() {
    if (this.share === Share.MLSAndSafeChat || this.share === Share.SafeBox) {
      return true;
    } else if (this.share === Share.EmailAttachment || this.share === Share.EmailAttachmentPDF) {
      return this.isSilent;
    }
    return false;
  }

  onChangeSilent(event: MatCheckboxChange) {
    this.changeSilent.emit(event.checked);
  }

}
