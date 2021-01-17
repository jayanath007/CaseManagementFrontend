import { GridGroupData } from './../../../core/lib/grid-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  BundleTreeItem, ViewChangeKind,
  PreserveCheckboxProperty
} from '../../../bundling-core/models/interface';
import { MatterSearchGridData } from '../../../core/lib/matter';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';
import { MatDialog } from '@angular/material';
import { showInforDialog, InfoDialogType, checkUploadFileIsBlacklisted } from '../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-bundled-profile',
  templateUrl: './bundled-profile.component.html',
  styleUrls: ['./bundled-profile.component.scss']
})
export class BundledProfileComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  @Input() bundlingItemList: BundleTreeItem[];
  @Input() bundlingAllItemList: BundleTreeItem[];
  @Input() matterInfo: MatterSearchGridData;
  @Input() isDirty: string;
  @Input() bunldeId: number;
  @Input() isPreserveExistingPage: PreserveCheckboxProperty;
  @Input() uploadInProgras: boolean;
  @Input() bundleHeaderView: PDFBundleHeaderViewModel;
  @Input() coreBundleHeader: PDFBundleHeaderViewModel;

  @Output() onChnageFolderExpand = new EventEmitter<string>();
  @Output() dropData = new EventEmitter<{
    group: GridGroupData,
    dragDataType: string, bundleTreeItem: BundleTreeItem, itemType: string
  }>();
  @Output() selectProfileItem = new EventEmitter<BundleTreeItem>();
  @Output() lableChange = new EventEmitter<any>();
  @Output() changeDateDone = new EventEmitter<{ item: BundleTreeItem, date: string }>();
  @Output() onclickEditLable = new EventEmitter<any>();
  @Output() ondblClickDocView = new EventEmitter<any>();
  @Output() dragProfileItem = new EventEmitter<{ itemId: string, anchorId: string }>();
  @Output() startMoveItem = new EventEmitter<any>();
  @Output() uploadCoverPage = new EventEmitter<{ isFromDiary: boolean, diaryId: number, file: any }>();
  @Output() nameTextSave = new EventEmitter<any>();
  @Output() updateIsPreserveExistingPage = new EventEmitter<boolean>();
  @Output() menuChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() fileDateEnable = new EventEmitter<any>();
  @Output() openMonitor = new EventEmitter();
  @Output() openLogFile = new EventEmitter();
  isEdit = false;
  clickId = null;
  status = false;
  dropId: string;
  disableDrop = false;
  moveProfileItem: BundleTreeItem;
  dropedItem: BundleTreeItem;
  ngOnInit() {
  }
  clickEditLable(event, item) {
    event.preventDefault();
    event.stopPropagation();
    this.selectProfileItem.emit(item);
    this.onclickEditLable.emit(item.id);
  }
  onExpanFolder(item: BundleTreeItem) {
    this.onChnageFolderExpand.emit(item.id);
  }
  onDrop({ event, dragData, dragDataType }, dropedItem: BundleTreeItem) {
    this.moveProfileItem = null;
    if (dragData && dragData.id && !dragData.isCoverPage) {
      if (dropedItem && !this.disableDrop) {
        this.dragProfileItem.emit({ itemId: dragData.id, anchorId: dropedItem.id });
      }
      return;
    }
    if (dropedItem && dropedItem.isCoverPage) {
      if (dragData.group) {
        this.uploadCoverPage.emit({
          isFromDiary: true,
          diaryId: dragData.item.diary_UID,
          file: null
        });
      }
      return;
    }
    let itemType;
    let groupItem;
    if (dragData && dragData.value) {
      itemType = 'ByFolder';
      groupItem = dragData;
    } else if (!dropedItem || dropedItem.isRoot) {
      itemType = 'WithNewFolder';
      groupItem = dragData.group;
    } else {
      itemType = 'ByItem';
      groupItem = dragData.group;
    }
    this.dropData.emit({
      group: groupItem,
      dragDataType: dragDataType, bundleTreeItem: dropedItem, itemType: itemType
    });
  }
  onDragEnter(dropedItem: BundleTreeItem) {
    this.dropedItem = dropedItem;
    if (!this.possibleToDrop(dropedItem)) {
      this.disableDrop = true;
      return;
    }
    this.disableDrop = false;
    const selectedParent = dropedItem.isFolder ? dropedItem : this.bundlingItemList.find(i => i.id === dropedItem.parentId);
    if (selectedParent) {
      this.selectProfileItem.emit(selectedParent);
    }
    if (!dropedItem.expanded && dropedItem.isFolder && !dropedItem.isRoot) {
      setTimeout(() => { this.onChnageFolderExpand.emit(dropedItem.id); }, 100);
    }
  }
  possibleToDrop(dropedItem: BundleTreeItem): boolean {
    if (this.moveProfileItem && this.dropedItem.hierarchy.includes(this.moveProfileItem.hierarchy)) { return false; }
    return true;
  }
  onSelectProfileItem(event, selectedItem) {
    this.selectProfileItem.emit(selectedItem);
  }
  onUp(event) {
    this.menuChange.emit({ kind: ViewChangeKind.Up, value: event });
  }
  onLableInput(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDown(event) {
    this.menuChange.emit({ kind: ViewChangeKind.Down, value: event });
  }
  onAdd(event) {
    this.menuChange.emit({ kind: ViewChangeKind.Add, value: event });
  }
  onHeading(event) {
    if (!this.getSelectedItem || this.getSelectedItem.isCoverPage) {
      return;
    }
    this.menuChange.emit({ kind: ViewChangeKind.Heading, value: this.getSelectedItem });
  }
  onBundled(event) {
    if (this.bundlingAllItemList && this.bundlingAllItemList.filter(i => !i.isRoot && !i.isFolder && !i.isCoverPage).length > 1) {
      if (!!this.isPreserveExistingPage.checked) {
        const dialog = showInforDialog('Bundle to PDF',
          `'Restart Page Numbering at Section' will be turned off because it conflicts with 'Preserve Existing Pagination'`,
          InfoDialogType.alert, this.dialog);
        dialog.afterClosed().subscribe(() => {
          this.menuChange.emit({ kind: ViewChangeKind.Bundled, value: null });
        });
      } else {
        this.menuChange.emit({ kind: ViewChangeKind.Bundled, value: null });
      }
    } else {
      showInforDialog('Bundle to PDF', 'You must select at least 2 documents to merge.', InfoDialogType.alert, this.dialog);
    }
  }
  openExisting(event) {
    this.menuChange.emit({ kind: ViewChangeKind.OpenExisting, value: null });
  }
  onRemove(event) {
    const getAllChildItems = (items: BundleTreeItem[]): BundleTreeItem[] => {
      let childs: BundleTreeItem[] = [];
      items.forEach(si => {
        childs = childs.concat(this.bundlingAllItemList.filter(i => i.parentId === si.id));
      });
      if (childs && childs.length > 0) {
        childs = childs.concat(getAllChildItems(childs));
      }
      return childs;
    };
    let selectItems: BundleTreeItem[] = [this.getSelectedItem];
    if (selectItems) {
      selectItems = selectItems.concat(getAllChildItems(selectItems));
      this.menuChange.emit({ kind: ViewChangeKind.Rmove, value: selectItems });
    }
  }

  get getSelectedItem() {
    if (this.bundlingItemList && this.bundlingItemList.length > 0) {
      return this.bundlingItemList.find((row) => row.selected);
    }
    return null;
  }
  onLableChange(item, value) {
    this.lableChange.emit({ item, value });
  }
  onDblClickDocView(event, item: BundleTreeItem) {
    if (item.isFolder) {
      return;
    }
    this.ondblClickDocView.emit(item.data);
  }
  mouseEnter(event, item) {
    this.status = !this.status;
    this.dropId = item.id;
  }

  onStartMoveItem(item: BundleTreeItem) {
    this.disableDrop = false;
    this.moveProfileItem = item;
  }
  onEndMoveItem() {
    this.disableDrop = false;
    this.moveProfileItem = null;
    this.dropedItem = null;
  }
  onCoreBundled(event) {
    this.menuChange.emit({ kind: ViewChangeKind.CoreBundled, value: null });
  }
  get disabledUp(): boolean {
    if (!this.getSelectedItem) {
      return false;
    }
    if (!this.getSelectedItem || this.getSelectedItem.level === 0 || this.getSelectedItem.isCoverPage
      || !this.bundlingItemList.filter(i => i.level === 1)[1]) {
      return true;
    } else if (this.bundlingItemList.filter(i => i.parentId === this.getSelectedItem.parentId)[0].id === this.getSelectedItem.id
      || this.bundlingItemList.filter(i => i.level === 1)[1].id === this.getSelectedItem.id) {
      return true;
    }
    return false;
  }

  get disabledDown(): boolean {
    if (!this.getSelectedItem) {
      return false;
    }
    const parantsItems = this.bundlingItemList.filter(i => i.parentId === this.getSelectedItem.parentId);
    const level1Item = this.bundlingItemList.filter(i => i.level === 1);
    if (!this.getSelectedItem || this.getSelectedItem.level === 0 || this.getSelectedItem.isCoverPage
      || !this.bundlingItemList.filter(i => i.level === 1)[1]) {
      return true;
    } else if (parantsItems[parantsItems.length - 1].id === this.getSelectedItem.id
      || level1Item[level1Item.length - 1].id === this.getSelectedItem.id) {
      return true;
    }
    return false;
  }

  get disabledRemove(): boolean {
    if (!this.getSelectedItem || this.getSelectedItem.isRoot || this.getSelectedItem.isCoverPage) { return true; }
    return false;
  }

  onChangeDateDone(item, event) {
    this.changeDateDone.emit({ item: item, date: event.value });
  }
  onUploadBTNClick() {
    const fileUploadInput = document.getElementById('coverPageUploader');
    fileUploadInput.click();
  }
  onCoverPageUpload(files) {
    if (files && files[0] && checkUploadFileIsBlacklisted(files[0].name)) {
      showInforDialog('Harmful file detection',
        'You are try to upload harmful file type, please contact admin', InfoDialogType.warning, this.dialog);
    } else {
      if (files[0]) {
        this.uploadCoverPage.emit({
          isFromDiary: false,
          diaryId: null,
          file: files[0]
        });
      }
    }


  }
  onRemoveCoverPage(item: BundleTreeItem) {
    // const fileUploadInput = <HTMLInputElement>document.getElementById('coverPageUploader');
    // fileUploadInput.value = null;
    this.menuChange.emit({ kind: ViewChangeKind.Rmove, value: [item] });
  }
  onNameTextSave(event) {
    this.nameTextSave.emit();
  }

  haveSubElement(item: BundleTreeItem) {
    if (!item.isFolder) { return false; }
    if (this.bundlingAllItemList.find(i => i.parentId === item.id)) { return true; }
    return false;
  }

  onChangePreserveExistingPage(checked: boolean) {
    this.updateIsPreserveExistingPage.emit(checked);
  }
  onChangeItemDateEnable(item, event) {
    this.fileDateEnable.emit({ id: item.id, value: true });
  }
  onOpenMonitor() {
    this.openMonitor.emit();
  }
  onOpenLogFile() {
    this.openLogFile.emit();
  }
}


