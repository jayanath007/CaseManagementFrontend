import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MessageItemWrapper } from '../../../mail-item-core';
import { FollowupFlag, ItemAttachment } from '../../../core/lib/microsoft-graph';
import { MatterInputData } from '../../../core/lib/matter';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { DiaryRecType, LegalAid } from '../../../add-note-core';
import { AddNoteInPutData, AddNoteItemsType } from '../../../core/lib/addNote';
import { ReadingPaneMode } from '../../../auth';
import { BasePopupType } from '../../../shared/models/consol-error';
import { ConfirmDialogResultKind, IsDpsMailPipe } from './../../../shared';
import { InfoDialogType, showConfirmDialog } from '../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-mail-view-header',
  templateUrl: './mail-view-header.component.html',
  styleUrls: ['./mail-view-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailViewHeaderComponent implements OnInit {

  @Input() item: MessageItemWrapper;
  @Input() hasNext: boolean;
  @Input() hasPrevious: boolean;
  @Input() timeZone: string;
  @Input() emailReadingPaneMode: ReadingPaneMode;
  @Input() companyCode: string;

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() itemReadUnread = new EventEmitter();
  @Output() itemFlag = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  @Output() attachToNewMail = new EventEmitter();
  @Output() openUrlPoup = new EventEmitter();
  isWindowUrlPopup = false;

  get isProtectedMail() {
    if (this.item && this.item.data.id && this.item.data.attachments) {
      return !!this.item.data.attachments.find(val => val.contentType === 'application/x-microsoft-rpmsg-message');
    }
    return false;
  }

  constructor(private popupService: SystemJsPopupLoaderService, private matDialog: MatDialog) { }

  ngOnInit() {
    if (window.opener && window.opener !== window && window.name !== 'mail') {
      this.isWindowUrlPopup = true;
    }

  }
  delete(event: MouseEvent) {
    if (this.item) {
      this.itemDelete.emit({ item: this.item, deleteOnlyList: false });
    }
  }
  readUnread(event: MouseEvent) {
    if (this.item) {
      this.itemReadUnread.emit({ item: this.item, isRead: !this.item.data.isRead });
    }
  }
  flag(event: MouseEvent) {
    if (this.item) {
      let flag: FollowupFlag;
      if (this.item.data.flag.flagStatus === 'flagged') {
        flag = {
          flagStatus: 'complete',
          completedDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
          // dueDateTime: { dateTime: '' , timeZone: 'UTC'},
          // startDateTime: { dateTime: '' , timeZone: 'UTC'}
        };
      } else {
        flag = {
          flagStatus: 'flagged',
          // completedDateTime: { dateTime: '' , timeZone: 'UTC'},
          dueDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
          startDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' }
        };
      }
      this.itemFlag.emit({ item: this.item, flag: flag });
    }
  }
  onNext(event: MouseEvent) {
    this.next.emit(this.item);
  }

  onPrevious(event: MouseEvent) {
    this.previous.emit(this.item);
  }
  onOpenUrlPoup(event: MouseEvent) {
    this.openUrlPoup.emit(this.item);
  }
  onClose(event: MouseEvent) {
    this.close.emit(this.item);
  }
  onAttachToNewMail() {
    const itemAttachments: ItemAttachment[] = [{ name: this.item.data.subject || 'No subject', item: this.item.data }];
    this.attachToNewMail.emit(itemAttachments);
  }
  onAttachToDpsFile() {
    if (this.item) {
      const isDpsMailPipe = new IsDpsMailPipe();
      const isDpsMail = isDpsMailPipe.transform(this.item.data.subject, this.companyCode);
      if (isDpsMail || this.item.diaryId !== null) {
        showConfirmDialog('Attach to file',
          '<strong>Do you want to attach selected email(s)? </strong> <br> (Selected email(s) might be linked with a matter.)',
          this.matDialog).afterClosed()
          .subscribe((result: { kind: ConfirmDialogResultKind }) => {
            if (result.kind === ConfirmDialogResultKind.Confirmed) {
              this.openAddNotePopup();
            }
          });
      } else {
        this.openAddNotePopup();
      }
    }
  }

  openAddNotePopup() {
    const emailAddress = [];
    if (this.item && (this.item.folderWellKnownId === 'sentitems')) {
      this.item.data.toRecipients.forEach(toItem => emailAddress.push(toItem.emailAddress.address));
    } else if (this.item.data && this.item.data.from && this.item.data.from.emailAddress
      && this.item.data.from.emailAddress.address) {
      emailAddress.push(this.item.data.from.emailAddress.address);
    }
    const matterInputData: MatterInputData = {
      isMatterSearch: false,
      basePopupType: BasePopupType.EmailAttachDPSfile,
      emailList: emailAddress
    };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result: any) => {
      if (result) {
        const matterData = {
          MatterReferenceNo: result.MatterReferenceNo,
          BranchID: result.BranchID,
          AppID: result.AppID,
          FeeEarner: result.FeeEarner,
          ClientName: result.ClientName ? result.ClientName : '',
          RateCategory: null,
          FileID: result.FileID,
          AppCode: result.AppCode,
          eBilling: result.eBilling,
          isPlotMasterMatter: result.isPlotMasterMatter,
          isProspectMatter: result.isProspectMatter,
          isLegalAid: result.isLegalAid
        };
        const input: AddNoteInPutData = {
          isEdit: false,
          matterData: matterData,
          diaryType: DiaryRecType.EMAIL_IN,
          legalAid: LegalAid.NotLegalAid,
          addNoteItemsType: AddNoteItemsType.MailItems,
          mailItemList: [this.item]
        };
        this.popupService.openAddNotePopup('mainAddNotePopup', input).subscribe((data) => {
          if (data) {

          }
        });
      }
    }
    );
  }
}
