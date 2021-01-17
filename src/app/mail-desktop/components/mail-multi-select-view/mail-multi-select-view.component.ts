import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DiaryRecType, LegalAid } from '../../../add-note-core';
import { AddNoteItemsType } from '../../../core/lib/addNote';
import { MatterInputData } from '../../../core/lib/matter';
import { EventMessage, FollowupFlag, ItemAttachment } from '../../../core/lib/microsoft-graph';
import { InfoDialogType, showConfirmDialog, showInforDialog } from '../../../core/utility/DpsUtility';
import { FolderItemWrapper } from '../../../mail-core';
import { MessageItemWrapper } from '../../../mail-item-core';
import { ConfirmDialogResultKind } from '../../../shared';
import { BasePopupType } from '../../../shared/models/consol-error';
import { IsDpsMailPipe } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';


@Component({
  selector: 'dps-mail-multi-select-view',
  templateUrl: './mail-multi-select-view.component.html',
  styleUrls: ['./mail-multi-select-view.component.scss']
})
export class MailMultiSelectViewComponent implements OnInit, OnChanges {
  @Input() selectedItems: MessageItemWrapper[];
  @Input() folderList: { [id: string]: Readonly<FolderItemWrapper>; };
  @Input() companyCode: string;

  @Output() itemsReadUnread = new EventEmitter();
  @Output() itemsFlag = new EventEmitter();
  @Output() itemsDelete = new EventEmitter();
  @Output() attachToNewMail = new EventEmitter();
  @Output() moveToFolder = new EventEmitter();
  @Output() cancel = new EventEmitter();

  msgRootFolderId = '';
  folders: FolderItemWrapper[] = [];
  isDpsMailPipe: IsDpsMailPipe;

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
    this.isDpsMailPipe = new IsDpsMailPipe();
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.folderList) {
      this.folders = Object.keys(changes.folderList.currentValue).map(id => {
        if (this.folderList[id].data.wellKnownName === 'inbox') {
          this.msgRootFolderId = this.folderList[id].data.parentFolderId;
        }
        return this.folderList[id];
      });
    }
  }
  onCancel() {
    this.cancel.emit();
  }
  delete(event: MouseEvent) {
    if (this.selectedItems && this.selectedItems.length > 0) {
      this.itemsDelete.emit({ items: this.selectedItems, deleteOnlyList: false });
    }
  }
  readUnread(event: MouseEvent) {
    if (this.selectedItems && this.selectedItems.length > 0) {
      this.itemsReadUnread.emit({ items: this.selectedItems, isRead: !this.selectedItems[0].data.isRead });
    }
  }
  flag(event: MouseEvent) {
    if (this.selectedItems && this.selectedItems.length > 0) {
      let flag: FollowupFlag;
      if (this.selectedItems[0].data.flag.flagStatus === 'flagged') {
        flag = {
          flagStatus: 'complete',
          completedDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
        };
      } else {
        flag = {
          flagStatus: 'flagged',
          dueDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
          startDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' }
        };
      }
      this.itemsFlag.emit({ items: this.selectedItems, flag: flag });
    }
  }
  onAttachToNewMail() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      const itemAttachments: ItemAttachment[] = this.selectedItems.filter(item => !item.data.isDraft).map(value => {
        const item = <EventMessage>value.data;
        const attachment: ItemAttachment = {
          name: item.subject || 'No subject',
          item: value.data
          // item: {
          //   id: item.id
          // }
        };
        attachment.item['@odata.type'] = 'microsoft.graph.message';
        // attachment.item['attachments'] = undefined;
        attachment.item['attachments@odata.context'] = undefined;
        // attachment.item['singleValueExtendedProperties'] = undefined;
        attachment.item['singleValueExtendedProperties@odata.context'] = undefined;
        // attachment.item['event'] = undefined;
        attachment.item['event@odata.context'] = undefined;
        return attachment;
      });
      if (itemAttachments.length > 0) {
        this.attachToNewMail.emit(itemAttachments);
      }
    }
  }
  onAttachToDpsFile() {
    const mightBeAttchedMail = this.selectedItems.filter((i: MessageItemWrapper) =>
      (this.isDpsMailPipe.transform(i.data.subject, this.companyCode) || i.diaryId !== null) && !i.data.isDraft
    );
    const nonAttchedMail = this.selectedItems.filter(i => !i.diaryId && !i.data.isDraft);
    if (!nonAttchedMail || nonAttchedMail.length <= 0) {
      showInforDialog('Attach to file', 'Selected email(s) already linked with a matter.', InfoDialogType.warning, this.dialog, );
      return;
    }

    if ((mightBeAttchedMail && mightBeAttchedMail.length > 0)) {
      // if (nonAttchedMail && nonAttchedMail.length > 0) {
      showConfirmDialog('Attach to file',
        '<strong>Do you want to attach selected email(s)? </strong> <br> (Selected email(s) might be linked with a matter.)', this.dialog)
        .afterClosed().subscribe(dialogResult => {
          if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
            this.onAttachToDpsFileProceesing(nonAttchedMail);
          }
        });
      // } else {
      //   showInforDialog('Attach to file', ' Selected email(s) already linked with matter(s).', InfoDialogType.warning, this.dialog);
      // }
    } else {
      this.onAttachToDpsFileProceesing(nonAttchedMail);
    }
  }

  private onAttachToDpsFileProceesing(nonAttchedMail: MessageItemWrapper[]) {
    const emailAddress = [];
    if (nonAttchedMail && nonAttchedMail.length > 0) {
      nonAttchedMail.forEach(item => {
        if (item && (item.folderWellKnownId === 'sentitems')) {
          item.data.toRecipients.forEach(toItem => emailAddress.push(toItem.emailAddress.address));
        } else if (item.data && item.data.from && item.data.from.emailAddress
          && item.data.from.emailAddress.address) {
          emailAddress.push(item.data.from.emailAddress.address);
        }
      });
      // const matterInputData: MatterInputData = { isMatterSearch: false };
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
          this.popupService.openAddNotePopupWithAttachments(
            'mainAddNotePopup', nonAttchedMail.filter(item => !item.data.isDraft), AddNoteItemsType.MailItems,
            matterData, DiaryRecType.EMAIL_IN, LegalAid.NotLegalAid
          );
        }
      });
    }
  }

  onMoveToFolder(falder: FolderItemWrapper) {
    this.moveToFolder.emit({ items: this.selectedItems, falder });
  }
  get showAttachToFile(): boolean {
    if (this.selectedItems && this.selectedItems.length > 0) {
      return !!this.selectedItems.find(i => !i.diaryId);
    }
    return false;
  }
}
