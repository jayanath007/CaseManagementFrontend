
import { map } from 'rxjs/operators';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { RowItemChangeKind } from '../../../file-history-core/actions/core';

import { FileItemWrapper, GroupMode, FileHistoryGroup, Folder } from '../../../file-history-core/models/interface';
import {
  Component, OnInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';
import { ViewChangeKind } from '../../../file-history-core/actions/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { Filter, Condition } from '../../../odata';
import {
  InsertPasswordDialog, InforDialogData, InforDialogComponent, TextInsertDialogInput, ConfirmDialogData,
  ConfirmDialogComponent, ConfirmDialogResultKind
} from '../../../shared';

import { PasswordInsertComponent } from '../../../shared/components/password-insert-dialog/password-insert.component';
import { isMobile } from '../../../utils/is-mobile';
import { DocumentViewPopupInput } from '../../../document-view';
import { TextInsertDialogComponent } from '../../../shared/components/text-insert-dialog/text-insert-dialog.component';
import { InputData } from '../../../email-list-core';
import { SubmitType } from '../../../add-note-core';
import { ReplyForwardType } from '../../../mail-item-core';
import { LocalStorageKey, MatterInfo } from '../../../core';


@Component({
  selector: 'dps-file-history',
  templateUrl: './file-history.component.html',
  styleUrls: ['./file-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileHistoryComponent implements OnInit, OnChanges {

  windowHeight: number;
  rowHeight: number;

  @ViewChild('fileHistorGridContent') fileHistorGridContent;

  @Input() columnDef: ColumnDef[];
  @Input() fileHistorData: { data: FileItemWrapper[], loading: true, total: number, groupData?: FileHistoryGroup[] };
  @Input() checkedItems: FileItemWrapper[];
  @Input() documentViewOpened: boolean;
  @Input() documentViewPopupOpened: boolean;
  @Input() pageInfo;
  @Input() fontSizeClass: string;
  @Input() deleteEntrySecurityInfo: any;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() signIsLoading: boolean;
  @Input() dpsSignDetails;
  @Input() signandSendToken: string;
  @Input() xdraftViewSuccess: any;
  @Input() isDocumentVersioning: boolean;
  @Input() groupMode: GroupMode;
  @Input() folderList: Folder[];
  @Input() matterInfo: MatterInfo;


  @Output() rowChangeEvent = new EventEmitter<{ kind: RowItemChangeKind, row: FileItemWrapper, value: any }>();
  @Output() shareOnSafeBox = new EventEmitter<{ rows: { row: FileItemWrapper, password: string }[] }>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() addFiles = new EventEmitter<any>();
  @Output() deleteSelectedItem = new EventEmitter();
  @Output() closeDocumentViewPopup = new EventEmitter();
  @Output() requestReplytoMail = new EventEmitter<{ diaryId: string, password: string, type: ReplyForwardType }>();
  @Output() xdraftItemselect = new EventEmitter<{ kind: RowItemChangeKind, row: FileItemWrapper, value: any }>();
  @Output() xdraftItem = new EventEmitter<{ kind: RowItemChangeKind, row: FileItemWrapper, value: any }>();
  @Output() groupRowChange = new EventEmitter();

  @Output() moveSelectedFolder = new EventEmitter<{ folder: Folder, rows: FileItemWrapper[] }>();
  @Output() loadMore = new EventEmitter<any>();

  @Output() onCheckin = new EventEmitter<FileItemWrapper>();
  @Output() onDiscardCheckin = new EventEmitter<FileItemWrapper>();

  isMobileDevice = isMobile().any();
  pageSizeOptions = [25, 50, 100];

  fileHistoryGroupMode = GroupMode;

  docs: FileItemWrapper[] = [];

  constructor(private popupService: SystemJsPopupLoaderService, public dialog: MatDialog) {
    this.rowHeight = 36;
  }

  headerFlex(header) {
    if (header.extras.hidden) {
      return 0;
    }
    return header.extras.fxFlex;
  }

  get getIsMuiltySelect() {

    return this.checkedItems && this.checkedItems.length > 1;
  }

  get openedFile(): FileItemWrapper {
    if (this.fileHistorData && this.fileHistorData.data) {
      const expandRow = this.fileHistorData.data.find(row => row.isExpand);
      return expandRow;
    } return null;
  }

  get columnDefVisibale(): ColumnDef[] {
    return this.columnDef.filter(p => p.extras.hidden !== true);
  }


  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }


  onLoadMore(event) {
    this.loadMore.emit(event);
  }


  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.fileHistorData) {
      const selectedItemIndex = this.fileHistorData.data.indexOf(this.fileHistorData.data.filter(p => p.isExpand === true)[0]);
      if (selectedItemIndex !== -1) {
        setTimeout(() => {
          if (this.fileHistorGridContent) {
            this.fileHistorGridContent.nativeElement.scrollTop = (selectedItemIndex) * this.rowHeight;
          }
        }, 100);
      }
    }
    if (changes.documentViewPopupOpened && changes.documentViewPopupOpened.currentValue === true) {
      const input: DocumentViewPopupInput = {
        fileItem: this.openedFile,
        signandSendToken: this.signandSendToken,
        title: 'Sign and Share',
        icon: 'border_color'
      };
      this.popupService.openDocumentViewPopup('DocumentViewPopup', input).subscribe(data => {
        if (data) {
          const fileCredentials = this.docs.map(val => ({ diaryId: val.data.diary_UID, password: null, letterName: val.data.letter_name }));
          const inputData: InputData = {
            signTokens: [this.signandSendToken],
            safeBoxFileList: null,
            fileCredentials: fileCredentials,
            subjectNote: this.openedFile.data.note,
            submitType: SubmitType.SignAndShare,
            url: this.openedFile.signAndSendUrl,
            matterData: {
              MatterReferenceNo: this.matterInfo.MatterReferenceNo,
              FileID: this.matterInfo.FileId,
              AppCode: this.matterInfo.AppCode,
              AppID: this.matterInfo.AppId,
              BranchID: this.matterInfo.BranchId,
              ClientName: this.openedFile.data.client,
              RateCategory: null,
              FeeEarner: null,
              eBilling: this.matterInfo.eBilling,
              isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
              isProspectMatter: this.openedFile.data.isProspectMatter,
              isLegalAid: this.matterInfo.isLegalAid
            }
          };
          this.showEmailListPopup(inputData);
        }
        this.closeDocumentViewPopup.emit();
      });
    }

  }
  onEditDocument(item) {
    this.rowChangeEvent.emit({ kind: RowItemChangeKind.DocumentEditUpdate, row: item, value: '' });
    this.onCloseViewer(item);
  }
  openMsgFile() {
    this.popupService.openMsgViewer({
      viewerFrom: 'diary',
      diaryInput: {
        appCode: this.matterInfo.AppCode, branchId: this.matterInfo.BranchId, fileId:
          this.matterInfo.FileId,
        itemRef: this.openedFile.data.diary_UID, attachmentName: this.openedFile.data.letter_name
      }
    });
  }

  replyToMail(event: { type: ReplyForwardType }, diaryId, password) {
    const type = event ? event.type : null;
    this.requestReplytoMail.emit({ diaryId, password, type });
  }

  onExpand(item: FileItemWrapper) {

    // const extention = item.data.letter_icon.toLocaleLowerCase();
    if (item.data.hasPassword && !item.password) {
      this.openDialog(item, 'View Document', 'This document is protected. You must provide a password to view it.',
        RowItemChangeKind.ValidateUserPassword);
    } else {
      if (!item.isExpand) {
        this.rowChangeEvent.emit({ kind: RowItemChangeKind.IsExpand, row: item, value: '' });
      }
    }

  }


  onGroupRowChange(row) {
    this.groupRowChange.emit(row);
  }

  onMoveSelectedFolder(event: { folder: Folder, row: FileItemWrapper }) {
    if (this.getIsMuiltySelect) {
      this.moveSelectedFolder.emit({ folder: event.folder, rows: this.checkedItems });
    } else {
      this.moveSelectedFolder.emit({ folder: event.folder, rows: [event.row] });
    }
  }



  openedSignAndSend() {
    if (this.fileHistorData && this.fileHistorData.data) {
      const signDoc = this.fileHistorData.data.find(row => row.signAndSendUrl !== null);
      if (signDoc) {
        window.open(signDoc.signAndSendUrl, 'Sign and Share', 'width=800,height=600');
      }
    }
  }
  // }

  onCloseViewer(openedFile) {
    if (openedFile) {
      this.rowChangeEvent.emit({ kind: RowItemChangeKind.IsCollapse, row: openedFile, value: '' });
    }
  }


  openDialog(item: FileItemWrapper, title: string, details: string, emitKind: RowItemChangeKind, askToremainded = false): void {
    const dialogData: InsertPasswordDialog = {
      content: { title: title, details: details, message: '' },
      data: { password: '', askToRemainded: askToremainded }
    };

    const dialogRef = this.dialog.open(PasswordInsertComponent, {
      width: '350px',
      data: dialogData,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(result => {
      {
        this.rowChangeEvent.emit({ kind: emitKind, row: item, value: result.data });
      }
    });
  }

  deleteRow(item) {
    if (this.getIsMuiltySelect) {
      this.deleteSelectedItem.emit();
    } else {
      this.rowChangeEvent.emit({ kind: RowItemChangeKind.DeleteRow, row: item, value: '' });
    }

  }

  editRow(item) {
    this.rowChangeEvent.emit({ kind: RowItemChangeKind.EditRow, row: item, value: '' });
  }

  checkedRow(item) {
    this.rowChangeEvent.emit({ kind: RowItemChangeKind.IsChecked, row: item, value: '' });
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      console.log('apply column filter', data);
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  opened(e) {

  }

  onShare(diaryRecord: FileItemWrapper) {
    if (this.getIsMuiltySelect) {
      this.onMultiShare();
    } else {
      const inputData: InputData = {
        signTokens: null,
        safeBoxFileList: null,
        fileCredentials: [{ diaryId: diaryRecord.data.diary_UID, password: null, letterName: diaryRecord.data.letter_name }],
        subjectNote: diaryRecord.data.note,
        submitType: SubmitType.Share,
        url: null,
        matterData: {
          MatterReferenceNo: this.matterInfo.MatterReferenceNo,
          FileID: this.matterInfo.FileId,
          AppCode: this.matterInfo.AppCode,
          AppID: this.matterInfo.AppId,
          BranchID: this.matterInfo.BranchId,
          ClientName: diaryRecord.data.client,
          RateCategory: null,
          FeeEarner: null,
          eBilling: this.matterInfo.eBilling,
          isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
          isProspectMatter: diaryRecord.data.isProspectMatter,
          isLegalAid: this.matterInfo.isLegalAid
        }
      };
      this.showEmailListPopup(inputData);
    }
  }

  onSignDoc({ signDoc, docs }: { signDoc: FileItemWrapper, docs: FileItemWrapper[] }) {
    // this.rowChangeEvent.emit({ kind: RowItemChangeKind.SignDoc, row: diaryRecord, value: null });
    if (this.dpsSignDetails && !this.dpsSignDetails.isUserHasSignature && this.dpsSignDetails.message) {
      const dialogData: InforDialogData = {
        content: {
          title: 'File History',
          message: this.dpsSignDetails.message
        },
        data: { messageType: 'alert' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });

    } else {
      this.checkAllDocumentsReadyToShare(docs, signDoc);
    }

  }

  onMultiShare() {
    if (this.fileHistorData && this.fileHistorData.data && this.fileHistorData.data.length > 0) {
      this.checkAllDocumentsReadyToShare(this.checkedItems, null);
    }
  }

  muiltiShareConfirm(validateItems: FileItemWrapper[]) {
    if (validateItems && validateItems.length > 0) {
      const fileCredentials = validateItems.map(val => ({ diaryId: val.data.diary_UID, password: null, letterName: val.data.letter_name }));
      const inputData: InputData = {
        signTokens: null,
        fileCredentials: fileCredentials,
        subjectNote: validateItems[0].data.note,
        safeBoxFileList: null,
        submitType: SubmitType.Share,
        url: null,
        matterData: {
          MatterReferenceNo: this.matterInfo.MatterReferenceNo,
          FileID: this.matterInfo.FileId,
          AppCode: this.matterInfo.AppCode,
          AppID: this.matterInfo.AppId,
          BranchID: this.matterInfo.BranchId,
          ClientName: validateItems[0].data.client,
          RateCategory: null,
          FeeEarner: null,
          eBilling: this.matterInfo.eBilling,
          isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
          isProspectMatter: validateItems[0].data.isProspectMatter,
          isLegalAid: this.matterInfo.isLegalAid
        }
      };
      this.showEmailListPopup(inputData);
    }
  }

  showEmailListPopup(input: InputData) {
    return this.popupService.openEmailListPopup('EmailListPopup', input).pipe(map(data => {
    }));
  }

  onDrop({ event, dragData, dragDataType }) {
    if (dragDataType === 'Files') {
      this.addFiles.emit({ event, dragData, dragDataType });
    }
  }

  onXdraftItem(row) {
    if (row.data.letter_name === '' || row.data.letter_name === null) {

      const message = 'There is no document attached to this item.';

      const dialogData: InforDialogData = {
        content: {
          title: 'DPS Spitfire',
          message: message,
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });



    } else {

      this.openXdraftDialog(row,
        'Xdraft Note', 'Enter the Note for the new item', RowItemChangeKind.Xdraft);

    }

  }


  onNewVersion(row) {
    if (row.data.letter_name === '' || row.data.letter_name === null) {

      const message = 'There is no document attached to this item.';

      const dialogData: InforDialogData = {
        content: {
          title: 'DPS Spitfire',
          message: message
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });



    } else {

      if (!(row.data.auditParentId === 0 || row.data.auditParentId === null)) {

        const message = 'Only latest version of document can be processed for New Version.';

        const dialogData: InforDialogData = {
          content: {
            title: 'DPS Spitfire',
            message: message
          },
          data: { messageType: 'warning' }
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
          data: dialogData,
          width: '400px',
          disableClose: true,
          panelClass: 'dps-notification'
        });

      } else {
        this.openXdraftDialog(row,
          'New Version Note', 'Enter the Note for the new item', RowItemChangeKind.XDraftNewVersion);


      }
    }
  }



  openXdraftDialog(item, title: string, details: string, emitKind: RowItemChangeKind): void {
    const dialogData: TextInsertDialogInput = {
      content: { title: title, details: details, message: '', placeholder: '' }, allowEmpty: true,
      text: item.data.note,
      showCancelBtn: true
    };

    const dialogRef = this.dialog.open(TextInsertDialogComponent, {
      width: '250px',
      data: dialogData,
      panelClass: 'dps-notification',

    });
    dialogRef.afterClosed().subscribe(result => {
      {
        if (result) {
          this.xdraftItem.emit({ kind: emitKind, row: item, value: result });
        } else {

        }
      }
    });
  }

  checkAllDocumentsReadyToShare(rows: FileItemWrapper[], signDoc: FileItemWrapper) {
    const notIncludedFiles = rows.filter(r => !r.data.letter_icon);
    const checkoutFiles = rows.filter(r => this.isCheckoutByMe(r) || (r.data.checkedOutByUser && r.data.checkedOutByUser !== ''));

    if ((!!notIncludedFiles && notIncludedFiles.length > 0) || (!!checkoutFiles && checkoutFiles.length > 0)) {
      let msg = '';
      notIncludedFiles.forEach(i => {
        msg += `<p>Diary Id - ${i.data.diary_UID} can't find file item </p>`;
      });
      checkoutFiles.forEach(i => {
        msg += `<p>Diary Id - ${i.data.diary_UID} is checkout by someone </p>`;
      });

      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Following items can not be share',
          message: `${msg} <strong>Do you want continue without above items? </strong>`,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };

      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      confirmDialog.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          if (!!signDoc) {
            this.requestDocForSignature(signDoc);
            this.docs = rows.filter(r => !!r.data.letter_icon && !this.isCheckoutByMe(r) &&
              !r.data.checkedOutByUser && signDoc.data.diary_UID !== r.data.diary_UID);
          } else {
            const temp = rows.filter(r => !!r.data.letter_icon && !this.isCheckoutByMe(r) && !r.data.checkedOutByUser);
            this.muiltiShareConfirm(temp);
          }
        }
      });

    } else {
      if (!!signDoc) {
        this.requestDocForSignature(signDoc);
        this.docs = rows.filter(r => signDoc.data.diary_UID !== r.data.diary_UID);
      } else {
        this.muiltiShareConfirm(rows);
      }
    }
  }

  requestDocForSignature(signDoc: FileItemWrapper) {
    const signPWHash = localStorage.getItem(LocalStorageKey.SignatureTokenHash)
    if (signPWHash) {
      const value = { password: null, needPasswordHash: false, passwordHash: signPWHash }
      this.rowChangeEvent.emit({ kind: RowItemChangeKind.SignDoc, row: signDoc, value: value });
    } else {
      this.openDialog(signDoc, 'Sign and Share', 'Enter signature password', RowItemChangeKind.SignDoc, true);
    }

  }

  isCheckoutByMe(item: FileItemWrapper) {
    return item.data.checkedOutHashKey && item.data.checkedOutHashKey !== '';
  }

}
