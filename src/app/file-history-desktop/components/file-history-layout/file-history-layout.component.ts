import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatterInfo } from '../../../core/lib/matter';
import { FileItemWrapper, GroupMode, Folder, FileHistoryGroup } from '../../../file-history-core/models/interface';
import { RowItemChangeKind, ViewChangeKind } from '../../../file-history-core/actions/core';
import { checkUploadFileIsBlacklisted, showInforDialog } from '../../../core/utility/DpsUtility';
import { InfoDialogType } from './../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-file-history-layout',
  templateUrl: './file-history-layout.component.html',
  styleUrls: ['./file-history-layout.component.scss']
})
export class FileHistoryLayoutComponent implements OnInit, OnChanges {

  constructor(public dialog: MatDialog) {

  }
  @Input() fontSizeClass: string;
  @Input() matterInfo: MatterInfo;
  @Input() token: string;
  @Input() fileHistorData: { data: FileItemWrapper[], loading: true, total: number, groupData?: FileHistoryGroup[] };
  @Input() checkedItems: FileItemWrapper[];
  @Input() documentViewOpened: boolean;
  @Input() searchText: any;
  @Input() pageInfo: any;
  @Input() columnDef: any;
  @Input() isDocPassword: any;
  @Input() documentViewPopupOpened: boolean;
  @Input() groupMode: GroupMode;
  @Input() folderList: Folder[];



  pageSizeOptions = [25, 50, 100];

  @Input() deleteEntrySecurityInfo: any;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() signIsLoading: boolean;
  @Input() dpsSignDetails: any;
  @Input() signandSendToken: string;
  @Input() xdraftViewSuccess: any;
  @Input() isDocumentVersioning: boolean;



  @Output() requestReplytoMail = new EventEmitter<{ diaryId: string, password: string }>();
  @Output() rowChange = new EventEmitter();
  @Output() shareOnSafeBox = new EventEmitter<{ rows: FileItemWrapper[], lookUpId: number }>();
  @Output() viewChange = new EventEmitter();
  @Output() searchTextChanged = new EventEmitter();
  @Output() userPassword = new EventEmitter<string>();
  @Output() addFiles = new EventEmitter<File[]>();
  @Output() deleteSelectedItem = new EventEmitter();
  @Output() closeDocumentViewPopup = new EventEmitter();
  @Output() xdraftItem = new EventEmitter();
  @Output() xdraftItemselect = new EventEmitter<{ kind: RowItemChangeKind, row: FileItemWrapper, value: any }>();
  @Output() groupRowChange = new EventEmitter();
  @Output() moveSelectedFolder = new EventEmitter<{ folder: Folder, rows: FileItemWrapper[] }>();
  @Output() loadMore = new EventEmitter<any>();

  @Output() onCheckin = new EventEmitter<FileItemWrapper>();
  @Output() onDiscardCheckin = new EventEmitter<FileItemWrapper>();

  groupList = [
    { value: GroupMode.Default, viewValue: 'Default' },
    { value: GroupMode.Folder, viewValue: 'Group By Folder' },
    { value: GroupMode.Date, viewValue: 'Group By Date' },
    { value: GroupMode.Note, viewValue: 'Group By Note' },
    { value: GroupMode.Type, viewValue: 'Group By Type' },
    { value: GroupMode.FolderDate, viewValue: 'Group By Folder Date' },
    { value: GroupMode.DateFolder, viewValue: 'Group By Date Folder' },
  ];


  onLoadMore(event) {
    this.loadMore.emit(event);
  }

  selectionChange(event) {
    this.viewChange.emit({ kind: ViewChangeKind.GroupModeChange, value: event });
  }

  onGroupRowChange(event) {
    this.groupRowChange.emit(event);
  }

  onRowChange(event) {
    this.rowChange.emit(event);
  }
  onShareOnSafeBox(event) {
    this.shareOnSafeBox.emit(event);
  }
  onViewChange(event) {

    this.viewChange.emit(event);
  }
  onSearchTextChanged(event) {
    this.searchTextChanged.emit(event);
  }

  onXdraftItemselect(event) {
    this.xdraftItemselect.emit(event);
  }

  onXdraftItem(event) {
    this.xdraftItem.emit(event);
  }

  onMoveSelectedFolder(event) {
    this.moveSelectedFolder.emit(event);
  }

  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }

  ngOnChanges(changes: SimpleChanges) {

  }
  ngOnInit() {
  }


  onDrop({ event, dragData, dragDataType }: { event: DragEvent, dragData: File[], dragDataType: string }) {
    if (dragDataType === 'Files' && this.checkUploadedFile(dragData)) {
      this.addFiles.emit(dragData);

    }
  }

  fileUpload(files: File[]) {
    if (files && this.checkUploadedFile(files)) {
      this.addFiles.emit(files);
    }
  }

  checkUploadedFile(file: any[]): boolean {
    let valid = true;
    for (let i = 0; i < file.length; i++) {
      if (checkUploadFileIsBlacklisted(file[i].name)) {
        showInforDialog('Harmful file detection',
          'You are try to upload harmful file type, please contact admin', InfoDialogType.warning, this.dialog);
        valid = false;
      }
    }
    return valid;
  }

  deleteRows() {
    this.deleteSelectedItem.emit();
  }
  replyToMail(data) {
    this.requestReplytoMail.emit(data);
  }
  onCloseDocumentViewPopup() {
    this.closeDocumentViewPopup.emit();
  }

}

