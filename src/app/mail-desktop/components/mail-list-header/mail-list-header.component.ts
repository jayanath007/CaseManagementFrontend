
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';
import { MessageItemWrapper } from '../../../mail-item-core';
import { ItemAttachment, FollowupFlag, EventMessage } from '../../../core/lib/microsoft-graph';
import { FilterTypes, OrderBy, SortDir, MessageListActions, FolderItemWrapper } from '../../../mail-core';
import { MatterInputData } from '../../../core/lib/matter';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { LegalAid, DiaryRecType, MatterInfo } from '../../../add-note-core';
import { AddNoteItemsType } from '../../../core/lib/addNote';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { BasePopupType } from '../../../shared/models/consol-error';
import { InfoDialogType, showConfirmDialog, showInforDialog } from '../../../core/utility/DpsUtility';
import { ConfirmDialogResultKind } from '../../../shared';
import { IsDpsMailPipe } from '../../../shared';


interface FilterMenuItem {
  id: FilterTypes;
  label: string;
  icon: string;
}

interface SortMenuItem {
  id: OrderBy;
  label: string;
}

@Component({
  selector: 'dps-mail-list-header',
  templateUrl: './mail-list-header.component.html',
  styleUrls: ['./mail-list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailListHeaderComponent implements OnInit, OnChanges {
  [x: string]: any;


  @Input() selectedItems: MessageItemWrapper[];
  @Input() itemsLoading: boolean;
  @Input() itemPerPage: number;
  @Input() filter: FilterTypes;
  @Input() orderBy: OrderBy;
  @Input() sortDir: SortDir;
  @Input() total: number;
  @Input() isSearching: boolean;
  @Input() pageIndex: number;
  @Input() isShortView: boolean;
  @Input() folderList: { [id: string]: Readonly<FolderItemWrapper>; };
  @Input() companyCode: string;

  @Output() itemsReadUnread = new EventEmitter();
  @Output() itemsFlag = new EventEmitter();
  @Output() itemsDelete = new EventEmitter();
  @Output() viewChange = new EventEmitter();
  @Output() attachToNewMail = new EventEmitter();
  @Output() moveToFolder = new EventEmitter();

  SortDir = SortDir;
  pageSizeOptions = [25, 50, 100];
  pageEvent: PageEvent;
  msgRootFolderId = '';
  folders: FolderItemWrapper[] = [];
  isDpsMailPipe: IsDpsMailPipe;

  filterMenuData: FilterMenuItem[] = [
    { id: FilterTypes.All, label: 'All', icon: 'done_all' },
    { id: FilterTypes.Unread, label: 'Unread', icon: 'email' },
    // { id: FilterTypes.ToMe, label: 'To me', icon: 'person' },
    { id: FilterTypes.Flagged, label: 'Flagged', icon: 'flag' }
  ];

  sortMenuData: SortMenuItem[] = [
    { id: OrderBy.Date, label: 'Date' },
    { id: OrderBy.From, label: 'From' },
    // { id: OrderBy.Size, label: 'Size' },
    { id: OrderBy.Subject, label: 'Subject' },
    // { id: OrderBy.Type, label: 'Type' },
    { id: OrderBy.Attachment, label: 'Attachment' },
    { id: OrderBy.Importance, label: 'Importance' }
  ];

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
    this.isDpsMailPipe = new IsDpsMailPipe();
  }

  get filterLable() {
    if (this.filter) {
      return this.filterMenuData.
        filter((item) => item.id === this.filter)
        .map(item => item.label)
        .reduce((acc, item) => item, '');
    }
    return '';
  }

  get getOrderByLabel() {
    if (this.orderBy) {
      return this.sortMenuData.
        filter((item) => item.id === this.orderBy)
        .map(item => item.label)
        .reduce((acc, item) => item, '');
    }
    return '';
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

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  onFilterApply({ id }: FilterMenuItem) {
    this.viewChange.emit([{ kind: MessageListActions.Filter, value: id }]);
  }

  onSortTypeApply({ id }: SortMenuItem) {
    this.viewChange.emit([{ kind: MessageListActions.OrderBy, value: id },
    {
      kind: MessageListActions.SortDir,
      value: this.orderBy === id ? (this.sortDir === SortDir.Desc ? SortDir.Asc : SortDir.Desc) :
        ((id === OrderBy.From || id === OrderBy.Subject) ? SortDir.Asc : SortDir.Desc)
    }]);
  }
  onMoveToFolder(falder: FolderItemWrapper) {
    this.moveToFolder.emit({ items: this.selectedItems, folderId: falder.data.id, owner: falder.owner });
  }
  toggleSortDirection() {
    this.viewChange.emit([{ kind: MessageListActions.SortDir, value: this.sortDir === SortDir.Desc ? SortDir.Asc : SortDir.Desc }]);
  }

  onPageChang(event: PageEvent) {
    this.viewChange.emit([{ kind: MessageListActions.PageChange, value: { pageIndex: event.pageIndex, itemPerPage: event.pageSize } }]);
  }
  onAttachToNewMail() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      const itemAttachments: ItemAttachment[] = this.selectedItems.map(value => {
        const item = <EventMessage>value.data;
        const attachment: ItemAttachment = {
          name: item.subject,
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
      this.attachToNewMail.emit(itemAttachments);
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

  onAttachToDpsFileProceesing(nonAttchedMail: MessageItemWrapper[]) {
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
      const matterInputData: MatterInputData = {
        isMatterSearch: false,
        basePopupType: BasePopupType.EmailAttachDPSfile,
        emailList: emailAddress
      };
      this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result: MatterInfo) => {
        if (result) {
          const matterData = {
            MatterReferenceNo: result.MatterReferenceNo, BranchID: result.BranchID,
            AppID: result.AppID, FeeEarner: result.FeeEarner,
            ClientName: result.ClientName, RateCategory: null, FileID: result.FileID,
            AppCode: result.AppCode, eBilling: result.eBilling, isPlotMasterMatter: result.isPlotMasterMatter,
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

}
