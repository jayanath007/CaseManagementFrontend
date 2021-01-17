import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ConfirmDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ReferralNotePopupManagerComponent } from '../../containers/referral-note-popup-manager.component';
import { ReviewNoteResponce } from '../../../matter-search-core/models/interfaces';

@Component({
  selector: 'dps-referral-note-and-date-popup',
  templateUrl: './referral-note-and-date-popup.component.html',
  styleUrls: ['./referral-note-and-date-popup.component.scss']
})
export class ReferralNoteAndDatePopupComponent implements OnInit, OnChanges {
  @Input() myToken: string;
  @Input() data: any;
  @Input() matterInfo: any;
  @Input() refferalNoteLoading: boolean;
  @Input() refferalNotePopupClose: number;
  @Input() currentReviewNote: ReviewNoteResponce;


  @Output() addReferralNote = new EventEmitter<any>();
  @Output() popupClose = new EventEmitter<any>();
  constructor(private datePipe: DatePipe, public dialog: MatDialog, public dialogRef: MatDialogRef<ReferralNotePopupManagerComponent>) { }

  reviewDate = null;
  reviewNotes: string = null;
  keyMessage: string = null;

  ngOnInit() {
    if (this.matterInfo) {
      this.reviewDate = this.matterInfo.reviewDate;
      this.reviewNotes = this.matterInfo.reviewNote;
    }
  }

  onChangeReviewDate(event) {
    const date = this.datePipe.transform(event.value, 'yyyy-MM-ddT00:00:00');

    this.reviewDate = date;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refferalNotePopupClose && !changes.refferalNotePopupClose.isFirstChange()
      && changes.refferalNotePopupClose.currentValue) {
      this.dialogRef.close();
    }

    if (changes.currentReviewNote && !changes.currentReviewNote.isFirstChange()
      && changes.currentReviewNote.currentValue) {
      this.reviewDate = this.currentReviewNote.reviewDate;
      this.reviewNotes = this.currentReviewNote.reviewNote;
      this.keyMessage = this.currentReviewNote.keyMessage;
    }

  }

  onChangeReviewNotes(value) {

    if (value.length > 250) {

      const headingText = 'Info';
      const dialogData: ConfirmDialogData = {
        content: {
          title: headingText,
          message: 'Review Notes length must not exceed 260 characters!.',
          acceptLabel: 'OK',
        },
        data: { messageType: 'alert' }
      };
      this.dialog.open(InforDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });

    } else {
      this.reviewNotes = value;
    }



  }

  onChangeKeyMessage(value) {
    if (value.length > 250) {

      const headingText = 'Info';
      const dialogData: ConfirmDialogData = {
        content: {
          title: headingText,
          message: 'Key Message length must not exceed 260 characters!.',
          acceptLabel: 'OK',
        },
        data: { messageType: 'alert' }
      };
      this.dialog.open(InforDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });

    } else {
      this.keyMessage = value;
    }



  }
  onSubmitData() {
    const addReferralNote: any = {
      reviewDate: this.reviewDate,
      reviewNotes: this.reviewNotes,
      keyMessage: this.keyMessage,
      matterInfo: this.data
    };

    if (this.reviewDate === null) {
      this.validateNullMsg();
    } else if (this.reviewNotes === null) {
      this.validateNullMsg();
    } else {
      this.addReferralNote.emit(addReferralNote);
    }




  }

  validateNullMsg() {
    const headingText = 'Info';
    const dialogData: ConfirmDialogData = {
      content: {
        title: headingText,
        message: 'Review date and note please',
        acceptLabel: 'OK',
      },
      data: { messageType: 'alert' }
    };
    this.dialog.open(InforDialogComponent, {
      data: dialogData,
      disableClose: true,
      width: '350px',
      panelClass: 'dps-notification'
    });

  }


  onClose() {
    this.popupClose.emit();
  }
}
