import { GridGroupData } from '../../core/lib/grid-model';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { BaseBundlingManager } from '../../bundling-core/containers/base-bundling-manager';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { BundleTreeItem, FileHistory, ViewChangeKind, ExistingRecordPopUpInput } from '../../bundling-core/models/interface';
import { MatterSearchGridData } from '../../core/lib/matter';
import { SystemJsPopupLoaderService } from '../../shell-desktop';

@Component({
  selector: 'dps-bundling-manager',
  template: `<ng-content></ng-content>`,
  styleUrls: []
})
export class BundlingManagerComponent extends BaseBundlingManager implements OnInit {

  constructor(store: Store<any>, private popupService: SystemJsPopupLoaderService) {
    super(store);
  }

  @Input() token: string;
  @Input() matterInfo: MatterSearchGridData;

  public columnDef$: any;
  public fileHistoryList$: any;
  public bundlingComponentTreeData$: any;
  public bndledFolderGroup$: any;
  public groupData$: any;
  public gridData$: any;
  public bundlingItemList$: any;
  public bundlingAllItemList$: any;
  public loading$: any;
  public expandRow$: any;
  public selectedGroupHash$: any;
  public selectGroup$: any;
  public selectedFileHistoryItems$: any;
  public documentViewOpened$: any;
  public matterInfo$: any;
  public searchText$: any;
  public isDirty$: any;
  public vlidationInProgras$: any;
  public uploadInProgras$: any;
  public vlidationMessage$: any;
  public bunldeId$: any;
  public isPreserveExistingPage$: any;
  public bundleHeaderView$: any;
  public coreBundleHeader$: any;
  public fromToDate$: any;

  columnDef = [
    createDefultColumnDef('dateDone', { label: 'Date Done', fxFlex: '132px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('note', { label: 'File', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('file', { label: 'Note', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('folderName', { label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true }),
  ];

  ngOnInit() {
    this.onInit(this.token, this.matterInfo, this.columnDef);
    this.onOpenOptionPopup(this.token);
    this.columnDef$ = this.getColumnDef(this.token);
    this.bndledFolderGroup$ = this.getBundledFolderGroup(this.token);
    this.groupData$ = this.getGridGroupData(this.token);
    this.gridData$ = this.getBundlingGridData(this.token);
    this.bundlingItemList$ = this.getBundledItemDataList(this.token);
    this.bundlingAllItemList$ = this.getBundledAllItemDataList(this.token);
    this.loading$ = this.getLoading(this.token);
    this.expandRow$ = this.getGridExpandedRowData(this.token);
    this.selectedGroupHash$ = this.getSelectedGroupHash(this.token);
    this.selectGroup$ = this.getSelectedGroup(this.token);
    this.selectedFileHistoryItems$ = this.getSelectedFileHistoryItems(this.token);
    this.documentViewOpened$ = this.getDocumentViewOpend(this.token);
    this.matterInfo$ = this.getMatterInfo(this.token);
    this.searchText$ = this.getSearchText(this.token);
    this.isDirty$ = this.isTreeDirty(this.token);
    this.vlidationInProgras$ = this.getValidationIsInProgras(this.token);
    this.uploadInProgras$ = this.getUploadIsInProgras(this.token);
    this.vlidationMessage$ = this.getValidationMessage(this.token);
    this.bunldeId$ = this.getBundleId(this.token);
    this.isPreserveExistingPage$ = this.getIsPreserveExistingPage(this.token);
    this.bundleHeaderView$ = this.getBundleHeaderViewModel(this.token);
    this.coreBundleHeader$ = this.getCoreBundleHeader(this.token);
    this.fromToDate$ = this.onGetFromToDate(this.token);
  }

  onDropBundleData(data: { group: GridGroupData, dragDataType: string, bundleTreeItem: BundleTreeItem, itemType: string }) {
    this.dropBundleData(this.token, data);
  }
  onFolderRowChange(data: GridGroupData) {
    this.onGroupRowChange(this.token, data);
  }
  onMenuChange(event: { kind: ViewChangeKind; value: any }) {
    if (event.kind === ViewChangeKind.Bundled) {
      const input: any = {};
      this.popupService.bundleOptionPopup(this.token, input).subscribe((data) => {
      });
    } else if (event.kind === ViewChangeKind.OpenExisting) {
      const input: ExistingRecordPopUpInput = {
        branchId: this.matterInfo.branchID,
        appId: this.matterInfo.appID,
        fileId: this.matterInfo.fileID,
        displayDataString: '',
        excludeInProgress: false
      };
      this.popupService.existingListOpenPopup(this.token, input).subscribe((data) => {
      });
    } else if (event.kind === ViewChangeKind.CoreBundled) {
      const input: ExistingRecordPopUpInput = {
        branchId: this.matterInfo.branchID,
        appId: this.matterInfo.appID,
        fileId: this.matterInfo.fileID,
        displayDataString: '',
        excludeInProgress: false
      };
      this.popupService.coreBundlePopup(this.token, input).subscribe((data) => {
      });
    } else {
      this.onMenuChangeBundling(this.token, event);
    }
  }
  onRowExpand(row) {
    this.expandRow(this.token, row);
  }
  onOpenDocument(item) {
    this.getDocUrl(this.token, item);
  }
  onExpanFolder(folderId: string) {
    this.expanFolder(this.token, folderId);
  }
  onLableChange(event) {
    this.lableChange(this.token, event);
  }
  clickEditLable(event) {
    this.onClickEditLable(this.token, event);
  }
  onSelectRow(event: { item: FileHistory, isMuilti: boolean }) {
    this.selectRow(this.token, event);
  }
  onSelectProfileItem(selectedItem: BundleTreeItem) {
    this.selectProfileItem(this.token, selectedItem);
  }
  onCloseViewer() {
    this.closeViewer(this.token);
  }
  ondblClickDocView(item) {
    this.getDocUrl(this.token, item);
  }
  onDragProfileItem(event) {
    this.dragProfileItem(this.token, event);
  }
  onStartMoveItem(item) {
    this.startMoveItem(this.token, item);
  }
  onChangeDateDone(event: { item: BundleTreeItem, date: string }) {
    this.changeDateDone(this.token, event);
  }
  onHistoryGridFilterChange(data) {
    this.historyGridViewChange(this.token, data);
  }
  onUploadCoverPage(data: { isFromDiary: boolean, diaryId: number, file: any }) {
    this.uploadCoverPage(this.token, data);
  }
  onNameTextSave(inputText) {
    this.popupService.bundleNameAddPopup(this.token, inputText).subscribe((data) => {
    });
  }
  onSelectGroup(groupData: GridGroupData) {
    this.onChangeSelectGroup(this.token, groupData);
  }
  onChangePreserveExistingPage(checked: boolean) {
    this.changePreserveExistingPage(this.token, checked);
  }
  onChangeFileDateEnable(event) {
    this.onFileDateEnable(this.token, event);
  }
  onOpenLogFile(bundleId) {
    this.openLogFile(this.token, bundleId);
  }
  onLoadMoreData(groupData: GridGroupData) {
    this.loadMoreData(this.token, groupData);
  }

}
