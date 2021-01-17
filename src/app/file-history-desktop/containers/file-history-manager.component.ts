import { DriveItem } from './../../core/lib/microsoft-graph';
import { IS_GOOGLE } from './../../shared';
import { ConfirmDialogResultKind } from '../../shared/models/dialog';
import { BaseFileHistoryManager } from '../../file-history-core/containers/base-file-history-manager';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject, Injector } from '@angular/core';
import * as fileHistoryCore from '../../file-history-core';
import {
  ViewChangeKind, RowItemChangeKind, ExpandFileHistoryGroup,
  MoveSelectedFolder, FileHistoryGroupLoadMore
} from '../../file-history-core/actions/core';
import { FileItemWrapper, Folder } from '../../file-history-core/models/interface';
import { MatterInfo } from '../../core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata/enums';
import { AddNoteInPutData, AddNoteCloseInfo, AddNoteItemsType, AddNoteItem } from '../../core/lib/addNote';
import {
  InforDialogComponent, ConfirmDialogData, ConfirmDialogComponent,
  InforDialogData
} from '../../shared';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { DiaryRecType, LegalAid } from '../../add-note-core';
import { CheckinFile, DiscardCheckout, RequstReplayToMailForDiaryMsg } from '../../document-view';
import { FileManagerType } from '../../document-view';
import { Observable } from 'rxjs';
import { User } from '../../auth';

@Component({
  selector: 'dps-file-history-manager',
  template: `<dps-file-history-layout
  [fontSizeClass]="fontSizeClass"
  [matterInfo]="matterInfo"
  [token]="token"
  [fileHistorData]="fileHistorData$ | async"
  [checkedItems]="checkedItems$ | async"
  [documentViewOpened] ="documentViewOpened$ | async"
  [documentViewPopupOpened] ="documentViewPopupOpened$ | async"
  [isDocPassword]="isDocPassword$ | async"
  [searchText]="searchText$ | async"
  [pageInfo]="pageInfo$ | async"
  [columnDef]="columnDef$ | async"
  [deleteEntrySecurityInfo] ="deleteEntrySecurityInfo"
  [companyCode] = "(user$|async)?.general?.companyCode"
  [signIsLoading] = "signIsLoading$ | async"
  [dpsSignDetails]="(user$|async)?.general?.signature"
  [signandSendToken]="signandSendToken$ | async"
  [xdraftViewSuccess]="xdraftViewSuccess$ | async"
  [isDocumentVersioning] = "(user$|async)?.general?.isDocumentVersioning"
  [timeZone]="(user$|async)?.userTimeZone?.info.alias"
  [groupMode]="groupMode$ | async"
  [folderList]="folderList$ | async"

  (onCheckin)="doCheckin($event)" (onDiscardCheckin)="doDiscardCheckin($event)"
  (viewChange)="onViewChange($event)"
  (closeDocumentViewPopup)="onCloseDocumentViewPopup()"
  (rowChange)="onRowChange($event)"
  (searchTextChanged)="onSearchTextChanged($event)"
  (userPassword)="changeDocPassword($event)"
  (addFiles)="onAddFiles($event)"
  (deleteSelectedItem)="deleteRows()"
  (requestReplytoMail)="replyToMail($event)"
  (shareOnSafeBox)="onShareOnSafeBox($event)"
  (xdraftItemselect)="onXdraftItem($event)"
  (xdraftItem)="onXdraftItemSubmit($event)"
  (groupRowChange)="onGroupRowChange($event)"
  (moveSelectedFolder)="moveSelectedFolder($event)"
  (loadMore)="onLoadMore($event)"
  >
  </dps-file-history-layout>
 `,
  styleUrls: []
})
export class FistoryHistoryManagerComponent extends BaseFileHistoryManager implements OnInit, OnChanges {

  @Input()
  matterInfo: MatterInfo;
  @Input() refreshCount: number;
  @Input() searchText: string;
  @Input() fontSizeClass: string;
  @Input() deleteEntrySecurityInfo: any;
  @Input() signandSendToken$: any;


  // @Input() xdraftViewSuccess: any;




  public fileHistorData$: any;
  public checkedItems$: any;
  public searchText$: any;
  public pageInfo$: any;
  public columnDef$: any;
  public isDocPassword$: any;
  public documentViewOpened$: any;
  public documentViewPopupOpened$;
  public user$: Observable<User>;
  public signIsLoading$: any;
  public xdraftViewSuccess$: any;
  public groupMode$: any;
  public folderList$: any;


  @Input() token: string;

  constructor(store: Store<any>, private popupService: SystemJsPopupLoaderService,
    @Inject(IS_GOOGLE) public isGoogle: boolean, private dialog: MatDialog, protected injector: Injector) {
    super(store);
  }


  onRowChange(item: { kind: RowItemChangeKind, row: FileItemWrapper, value: any }) {

    if (item.kind === RowItemChangeKind.DeleteRow) {
      this.onDeleteRow(item);
    } else if (item.kind === RowItemChangeKind.EditRow) {
      // this.onEditRow(item.row);
      this.store.dispatch(new fileHistoryCore.FileHistoryGridRowChange(this.token, item));
    } else if (item.kind === RowItemChangeKind.SignDoc) {
      this.requestSignToken(this.token, item.row, item.value);
    } else {
      this.store.dispatch(new fileHistoryCore.FileHistoryGridRowChange(this.token, item));
    }
  }




  onShareOnSafeBox(item: { rows: { row: FileItemWrapper, password: string }[] }) {
    this.store.dispatch(new fileHistoryCore.ShareDiaryItemOnSafebox(this.token, {
      matterRef: this.matterInfo.MatterReferenceNo, rows: item.rows
    }));
  }

  onXdraftItem(item: { kind: RowItemChangeKind, row: FileItemWrapper, value: any }) {

    this.store.dispatch(new fileHistoryCore.XdraftItem(this.token, { itemKey: item.kind, row: item.row }));

  }


  onGroupRowChange(row: any) {
    this.store.dispatch(new ExpandFileHistoryGroup(this.token, { row: row }));
  }

  onLoadMore(row) {
    this.store.dispatch(new FileHistoryGroupLoadMore(this.token, { row: row }));
  }

  onXdraftItemSubmit(item: { kind: RowItemChangeKind, row: FileItemWrapper, value: any }) {

    this.store.dispatch(new fileHistoryCore.XdraftItemChange(this.token,
      { kind: item.kind, row: item.row, value: item.value }));

  }



  moveSelectedFolder(event: { folder: Folder, rows: FileItemWrapper[] }) {
    this.store.dispatch(new MoveSelectedFolder(this.token, { folderId: event.folder.folderId, rows: event.rows, }));
  }

  doCheckin(item: FileItemWrapper) {
    const checkout = {
      hashKey: item.data.checkedOutHashKey,
      url: null,
      name: null,
      path: null,
      fileManagerType: FileManagerType.FileWithDiaryEntryManager
    };
    this.store.dispatch(new CheckinFile(checkout));
  }

  doDiscardCheckin(item: FileItemWrapper) {
    const checkout = {
      hashKey: item.data.checkedOutHashKey,
      url: null,
      name: null,
      path: null,
      fileManagerType: FileManagerType.FileWithDiaryEntryManager
    };
    this.store.dispatch(new DiscardCheckout(checkout));
  }

  changeDocPassword(password: string) {
    // const payload = { kind: RowItemChangeKind.SetPassword, row: row, value: password };
    // this.store.dispatch(new fileHistoryCore.FileHistoryGridRowChange(this.token, payload));
  }
  onAddFiles(itemList: AddNoteItem[]) {
    let addNoteItemsType = AddNoteItemsType.FileItems;
    if (itemList && itemList.length > 0) {
      if ((itemList[0] as DriveItem).file) {
        addNoteItemsType = AddNoteItemsType.DriveItems;
      }
    }
    const matterData = {
      MatterReferenceNo: this.matterInfo.MatterReferenceNo, BranchID: this.matterInfo.BranchId,
      AppID: this.matterInfo.AppId, FeeEarner: this.matterInfo.FeeEarner,
      ClientName: this.matterInfo.ClientName, RateCategory: null, FileID: this.matterInfo.FileId,
      AppCode: this.matterInfo.AppCode, eBilling: this.matterInfo.eBilling, isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
      isProspectMatter: this.matterInfo.isProspectMatter,
      isLegalAid: this.matterInfo.isLegalAid
    };
    const callback = () => {
      this.refresh(this.token);
    };
    this.popupService.openAddNotePopupWithAttachments(
      'mainAddNotePopup', itemList, addNoteItemsType,
      matterData, DiaryRecType.LETTER_IN, LegalAid.NotLegalAid, callback
    );
  }

  onEditRow(row: FileItemWrapper) {
    if (row.data.type === 'TA') {
      const dialogData: InforDialogData = {
        content: {
          title: 'Edit',
          message: 'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.'
        },
        data: { messageType: 'warning' }
      };
      console.log('dialogData', dialogData);
      // popup dialog
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'dps-notification'
      });

    } else {
      const matterData = {
        MatterReferenceNo: this.matterInfo.MatterReferenceNo,
        BranchID: this.matterInfo.BranchId,
        AppID: this.matterInfo.AppId,
        FeeEarner: row.data.for,
        ClientName: row.data.client,
        RateCategory: null,
        FileID: this.matterInfo.FileId,
        AppCode: this.matterInfo.AppCode,
        eBilling: this.matterInfo.eBilling,
        isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
        isProspectMatter: row.data.isProspectMatter,
        isLegalAid: this.matterInfo.isLegalAid
      };

      const input: AddNoteInPutData = {
        isEdit: true,
        type: row.data.type,
        uid: row.data.diary_UID,
        matterData: matterData,
        diaryType: null,
        legalAid: null,
      };
      this.popupService.openAddNotePopup('editAddNoteNotePopup', input).subscribe((data) => {
        if (data === AddNoteCloseInfo.ExitWithSaveSuccess) {
          this.refresh(this.token);
        }
      });
    }
  }
  onDeleteRow(item) {

    let message = 'You are about to delete one or more items. The following rules will be applied: ' +
      '<br/> <br/> 1) Entries linked to time in Accounts that are billed will not be deleted.' +
      '<br/> <br/> 2) Items linked to MS Outlook will be deleted, the related Outlook item will not be deleted.' +
      '<br/> <br/> 3) If more than a single item has links to the same document, the document will not be deleted.' +
      '<br/> <br/> Are you sure you want to continue?';

    if (this.isGoogle) {
      message = 'You are about to delete one or more items. The following rules will be applied: ' +
        '<br/> <br/> 1) Entries linked to time in Accounts that are billed will not be deleted.' +
        '<br/> <br/> 2) Items linked to G Suite will be deleted, the related mail item will not be deleted.' +
        '<br/> <br/> 3) If more than a single item has links to the same document, the document will not be deleted.' +
        '<br/> <br/> Are you sure you want to continue?';
    }

    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete',
        message: message,
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '600px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        this.store.dispatch(new fileHistoryCore.FileHistoryGridRowChange(this.token, item));
      }
    });

  }

  onViewChange(item) {
    this.store.dispatch(new fileHistoryCore.FileHistoryViewChange(this.token, item));
  }
  onCloseDocumentViewPopup() {
    super.onCloseDocumentViewPopup(this.token);
  }
  replyToMail(info: { diaryId, password, type }) {
    this.store.dispatch(new RequstReplayToMailForDiaryMsg({ diaryId: info.diaryId, password: info.password, type: info.type }));
  }

  onSearchTextChanged(searchText) {
    this.store.dispatch(new fileHistoryCore.FileHistoryViewChange
      (this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {

      // createDefultColumnDef('dateBilled', { label: 'Date Billed', fxFlex: '80px', filterAnchor: 'end', hidden: !this.showFDFigures }),
      // createDefultColumnDef('netBilled', { label: 'Billed Amount', fxFlex: '125px', filterAnchor: 'end', hidden: !this.showFDFigures }),
      // createDefultColumnDef('billNo', { label: 'Bill No.', fxFlex: '85px', filterAnchor: 'end', hidden: !this.showFDFigures }),


      const columnDef = [
        createDefultColumnDef('deleteaction', { label: '', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('action', { label: 'Actions', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('dateDone', { label: 'Date Done', fxFlex: '115px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('type', { label: 'Type', fxFlex: '65px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('by', { label: 'By', fxFlex: '54px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('folderName', { label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('from', { label: 'From', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('to', { label: 'To', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end' }),
      ];

      this.token = 'InitFileHistory' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.onChange(this.token, { columnDef: columnDef, matterInfo: this.matterInfo });
      this.fileHistorData$ = this.getCurrentGridData(this.token);
      this.checkedItems$ = this.getCheckedItems(this.token);


      this.searchText$ = this.getSearchText(this.token);
      this.columnDef$ = this.getColumnDef(this.token);
      this.groupMode$ = this.getGroupModeByToken(this.token);
      this.folderList$ = this.getFolderListByToken(this.token);


      // this.pageInfo$ = this.getPageEventByToken(this.token);
      this.pageInfo$ = this.store.select(fileHistoryCore.getFileHistoryPageEventByToken(this.token));
      this.isDocPassword$ = this.store.select(fileHistoryCore.getIsDocPasswordByToken(this.token));
      this.documentViewOpened$ = this.store.select(fileHistoryCore.getDocumentViewOpenedByToken(this.token));
      this.documentViewPopupOpened$ = this.getDocumentViewPopupOpened(this.token);
      this.signIsLoading$ = this.getSignAndSendIsLoading(this.token);
      this.signandSendToken$ = this.getSignandSendToken(this.token);
      this.xdraftViewSuccess$ = this.getXdraftViewSuccess(this.token);

    }
    if (changes.searchText) {
      this.store.dispatch(new fileHistoryCore.FileHistoryViewChange
        (this.token, { kind: ViewChangeKind.SearchText, value: this.searchText }));
    }

    if (changes.refreshCount &&
      !changes.refreshCount.firstChange) {
      if (changes.matterInfo) {
        if (changes.matterInfo.previousValue === changes.matterInfo.currentValue) {
          this.refresh(this.token);
        }
      } else {
        this.refresh(this.token);
      }
    }
  }

  deleteRows() {

    let message = 'You are about to delete one or more items. The following rules will be applied: ' +
      '<br/> <br/> 1) Entries linked to time in Accounts that are billed will not be deleted.' +
      '<br/> <br/> 2) Items linked to MS Outlook will be deleted, the related Outlook item will not be deleted.' +
      '<br/> <br/> 3) If more than a single item has links to the same document, the document will not be deleted.' +
      '<br/> <br/> Are you sure you want to continue?';

    if (this.isGoogle) {
      message = 'You are about to delete one or more items. The following rules will be applied: ' +
        '<br/> <br/> 1) Entries linked to time in Accounts that are billed will not be deleted.' +
        '<br/> <br/> 2) Items linked to G Suite will be deleted, the related mail item will not be deleted.' +
        '<br/> <br/> 3) If more than a single item has links to the same document, the document will not be deleted.' +
        '<br/> <br/> Are you sure you want to continue?';
    }

    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete',
        message: message,
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '600px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        this.store.dispatch(new fileHistoryCore.DeleteMultipleDiaryRecords(this.token));
      }
    });
  }
  ngOnInit() {
    this.user$ = this.agetUser();
    // this.authInfo$ = this.agetAuthInfo();
  }

}

