import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnInit, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatterSearchGridData } from '../../../core/lib/matter';
import { FileHistoryGroup } from '../../../file-history-core/models/interface';
import { GridGroupData } from '../../../core/lib/grid-model';
import {
  ViewChangeKind, FileHistory, BundleTreeItem, BundlingDates, PreserveCheckboxProperty, FromToDateObject
} from '../../../bundling-core/models/interface';
import { ViewKind, ValidationMessage } from '../../../bundling-core/models/enum';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';
import { UrlPopupService } from '../../../shell-desktop/services/url-popup.service';
import { getFileExtentionByName } from '../../../core/lib/files';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-bundling-layout',
  templateUrl: './bundling-layout.component.html',
  styleUrls: ['./bundling-layout.component.scss']
})
export class BundlingLayoutComponent implements OnInit, OnChanges {

  @Input() token: string;
  @Input() refreshCount: number;
  @Input() fontSizeClass: string;
  @Input() openCaseToken: string;
  @Input() matterInfo: MatterSearchGridData;
  @Input() bundledFolderGroup: FileHistoryGroup[];
  @Input() groupData: any;
  @Input() gridData: FileHistory[];
  @Input() bundlingItemList: BundleTreeItem[];
  @Input() bundlingAllItemList: BundleTreeItem[];
  @Input() loading: boolean;
  @Input() selectGroupHash: string[];
  @Input() selectGroup: GridGroupData;
  @Input() documentUrlLoadSuccess: any;
  @Input() selectedGridItems: FileHistory[];
  @Input() documentViewOpened: boolean;
  @Input() docUrl: string;
  @Input() columnDef: any;
  @Input() fileHistoryData: any;
  @Input() bundlingComponentTreeData: any;
  @Input() companyCode: any;
  @Input() timeZone: any;
  @Input() documentUrlIsLoading: boolean;
  @Input() searchText: string;
  @Input() isDirty: string;
  @Input() vlidationInProgras: boolean;
  @Input() uploadInProgras: boolean;
  @Input() vlidationMessage: ValidationMessage;
  @Input() bunldeId: number;
  @Input() isPreserveExistingPage: PreserveCheckboxProperty;
  @Input() bundleHeaderView: PDFBundleHeaderViewModel;
  @Input() coreBundleHeader: PDFBundleHeaderViewModel;
  @Input() fromToDate: FromToDateObject;
  @Input() timeOffset: number;

  @Output() dropData = new EventEmitter<{ group: GridGroupData, dragDataType: string, bundleTreeItem: BundleTreeItem, itemType: string }>();
  @Output() selectedItemUpdate = new EventEmitter<any>();
  @Output() folderRowChange = new EventEmitter<GridGroupData>();
  @Output() menuChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() rowExpand = new EventEmitter<any>();
  @Output() openDocument = new EventEmitter<FileHistory>();
  @Output() onChnageFolderExpand = new EventEmitter<string>();
  @Output() selectRow = new EventEmitter<{ item: FileHistory, isMuilti: boolean }>();
  @Output() lableChange = new EventEmitter<any>();
  @Output() selectProfileItem = new EventEmitter<BundleTreeItem>();
  @Output() onClickEditLable = new EventEmitter<any>();
  @Output() closeViewer = new EventEmitter<any>();
  @Output() onDblClickDocView = new EventEmitter<any>();
  @Output() dragProfileItem = new EventEmitter<{ itemId: string, anchorId: string }>();
  @Output() startMoveItem = new EventEmitter<any>();
  @Output() changeDateDone = new EventEmitter<{ item: BundleTreeItem, date: string }>();
  @Output() historyGridFilterChange = new EventEmitter<{ kind: ViewKind, value: BundlingDates }>();
  @Output() uploadCoverPage = new EventEmitter<{ isFromDiary: boolean, diaryId: number, file: any }>();
  @Output() nameTextSave = new EventEmitter<any>();
  @Output() changeSelectGroup = new EventEmitter<GridGroupData>();
  @Output() updateIsPreserveExistingPage = new EventEmitter<boolean>();
  @Output() fileDateEnable = new EventEmitter<any>();
  @Output() openLogFile = new EventEmitter<number>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();

  showContent = false;
  letterExtention: string;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event) {
    $event.returnValue = 'The Current bundle has been modified. You want to leave?';
    // this.endChat();
  }
  constructor(private datePipe: DatePipe, private urlPopupService: UrlPopupService, private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
    setTimeout(() => {
      this.showContent = true;
    }, 500);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.bundleHeaderView || changes.fromToDate) {
      let title = 'PDF BUNDLE';
      if (this.bundleHeaderView) {
        if (this.bundleHeaderView.pbH_BundleID === 0) {
          const fromDate = this.datePipe.transform(this.fromToDate.fromDate, 'dd-MM-yyyy');
          const toDate = this.datePipe.transform(this.fromToDate.toDate, 'dd-MM-yyyy');
          title = `NEW: From ${fromDate} To ${toDate}`;
        } else {
          const submittedDate = this.bundleHeaderView.pbH_LastSubmitDate ?
            this.datePipe.transform(this.bundleHeaderView.pbH_LastSubmitDate, 'dd-MM-yyyy') :
            'Never';
          title = `OPENED: ${this.bundleHeaderView.pbH_Name},
           Last Submitted: ${submittedDate}, By: ${this.bundleHeaderView.pbH_CreateUser}`;
        }
      }
      this.setPopUpTitle(title);
    }
  }
  setPopUpTitle(title: string) {
    if (window.document) { // if loaded
      window.document.title = title; // set title
    }
  }
  onChangeFileDateEnable(event) {
    this.fileDateEnable.emit(event);
  }
  onCloseViewer() {
    this.closeViewer.emit();
  }
  openInPopup(docUrl) {
  }
  onLableChange(event) {
    this.lableChange.emit(event);
  }
  clickEditLable(event) {
    this.onClickEditLable.emit(event);
  }
  get docPrivewRow() {
    if (this.gridData && this.gridData.length > 0) {
      const viewRow = this.gridData.find((row) => row.view);
      if (viewRow) {
        this.letterExtention = getFileExtentionByName(viewRow.letter_name);
      }
      return viewRow;
    }
    return null;
  }
  onFolderRowChange(event: GridGroupData) {
    this.folderRowChange.emit(event);
  }
  onDropData(event: { group: GridGroupData, dragDataType: string, bundleTreeItem: BundleTreeItem, itemType: string }) {
    this.dropData.emit(event);
  }
  onMenuChange(event: { kind: ViewChangeKind; value: any }) {
    if (event && event.kind === ViewChangeKind.Add && this.selectGroup) {
      const selectedItem = this.bundlingItemList.find(i => i.selected);
      const data = {
        group: this.selectGroup, dragDataType: '', bundleTreeItem: selectedItem, itemType: 'ByFolder'
      };
      this.dropData.emit(data);

    } else {
      this.menuChange.emit(event);
    }
  }
  onDragProfileItem(event) {
    this.dragProfileItem.emit(event);
  }
  gridRowExpan(row) {
    this.rowExpand.emit(row);
  }
  onOpenDocument(item) {
    this.openDocument.emit(item);
  }
  onExpanFolder(folderId: string) {
    this.onChnageFolderExpand.emit(folderId);
  }
  onSelectRow(event: { item: FileHistory, isMuilti: boolean }) {
    this.selectRow.emit(event);
  }
  onSelectProfileItem(selectedItem: BundleTreeItem) {
    this.selectProfileItem.emit(selectedItem);
  }
  dblClickDocView(item) {
    this.onDblClickDocView.emit(item);
  }
  onStartMoveItem(event) {
    this.startMoveItem.emit(event);
  }

  openMsgFile() {
    this.popupService.openMsgViewer({
      viewerFrom: 'diary',
      diaryInput: {
        appCode: this.matterInfo.app_Code, branchId: this.matterInfo.branchID, fileId:
          this.matterInfo.fileID,
        itemRef: this.docPrivewRow.diary_UID, attachmentName: this.docPrivewRow.letter_name
      }
    });
  }
  onChangeDateDone(event: { item: BundleTreeItem, date: string }) {
    this.changeDateDone.emit(event);
  }
  onHistoryGridFilterChange(event) {
    this.historyGridFilterChange.emit(event);
  }
  onUploadCoverPage(data) {
    this.uploadCoverPage.emit(data);
  }
  onNameTextSave() {
    this.nameTextSave.emit('');
  }
  onChangeSelectedGroup(data: GridGroupData) {
    this.changeSelectGroup.emit(data);
  }
  onChangePreserveExistingPage(checked: boolean) {
    this.updateIsPreserveExistingPage.emit(checked);
  }
  onOpenMonitor() {
    const urlPath = `/pdfbundlemonitor/${this.bundleHeaderView.pbH_BundleID}`;
    this.urlPopupService.openWithUrlPoup(urlPath, 'pdf-bundle-monitor', false, true, 'PDF Bundle Monitor', true);
  }
  onOpenLogFile() {
    this.openLogFile.emit(this.bundleHeaderView.pbH_BundleID);
  }
  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }
  // getLetterIcon(fileName: string) {
  // return getFileExtention(fileName);
  // }
}
