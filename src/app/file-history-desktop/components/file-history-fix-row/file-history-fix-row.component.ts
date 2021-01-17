import { MatMenuTrigger, MenuPositionX } from '@angular/material';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, ViewChild, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';

import { Folder, FileItemWrapper } from '../../../file-history-core/models/interface';
import { MatterInfo } from '../../../core';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { UserPermissionKey } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-file-history-fix-row',
  templateUrl: './file-history-fix-row.component.html',
  styleUrls: ['./file-history-fix-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileHistoryFixRowComponent implements OnInit {

  @Input() rowData: FileItemWrapper;
  @Input() checkedItems: FileItemWrapper[];
  @Input() columnDef: ColumnDef[];
  @Input() deleteEntrySecurityInfo: any;
  @Input() isDocumentVersioning: boolean;
  @Input() folderList: Folder[];
  @Input() isMuiltySelect: boolean;
  @Input() treeFolder: Folder[];

  @Input() matterInfo: MatterInfo;

  @Output() onDeleteRow = new EventEmitter<FileItemWrapper>();
  @Output() onEditRow = new EventEmitter<FileItemWrapper>();
  @Output() signDoc = new EventEmitter<{ signDoc: FileItemWrapper, docs: FileItemWrapper[] }>();
  @Output() share = new EventEmitter<FileItemWrapper>();
  @Output() onCheckedRow = new EventEmitter<FileItemWrapper>();
  @Output() xdraftItem = new EventEmitter<FileItemWrapper>();
  @Output() newVersion = new EventEmitter<FileItemWrapper>();
  @Output() onCheckin = new EventEmitter<FileItemWrapper>();
  @Output() onDiscardCheckin = new EventEmitter<FileItemWrapper>();
  @Output() moveSelectedFolder = new EventEmitter<{ folder: Folder, row: FileItemWrapper }>();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;


  xPosition: MenuPositionX;
  dragElement;
  userPermisionType = UserPermissionKey;

  constructor(public accessControl: AccessControlService) { }


  ngOnInit() {

    if (this.folderList) {
      //  this.treeFolder = this.list_to_tree(this.folderList);
      this.treeFolder = this.list_to_tree(JSON.parse(JSON.stringify(this.folderList)));
    }
  }

  getIsChecked(row: FileItemWrapper) {
    return !!this.checkedItems.find(val => val.data.diary_UID === row.data.diary_UID);
  }

  getHiddenProperty(index) {
    if (!this.columnDef) { return ''; }
    return !this.columnDef[index].extras.hidden;
  }

  deleteRow(event, item) {
    // event.preventDefault();
    // event.stopPropagation();
    this.onDeleteRow.emit(item);

  }

  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }

  isCheckoutFile(item: FileItemWrapper) {
    return this.isCheckoutByMe(item) || item.data.checkedOutByUser && item.data.checkedOutByUser !== '';
  }

  isCheckoutByMe(item: FileItemWrapper) {
    return item.data.checkedOutHashKey && item.data.checkedOutHashKey !== '';
  }

  rowCheckChanged(event, item) {
    event.stopPropagation();
    event.preventDefault();
    this.onCheckedRow.emit(item);
  }

  editRow(event, item) {
    // event.preventDefault();
    // event.stopPropagation();
    this.onEditRow.emit(item);
  }

  rowForce(event) {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.openMenu();
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }

  clickSign(row: FileItemWrapper, event) {
    if (this.getIsChecked(row)) {
      this.signDoc.emit({
        signDoc: row,
        docs: this.checkedItems
      });
    } else {
      this.signDoc.emit({ signDoc: row, docs: [] });
    }
  }

  clickShare(row, event) {
    this.share.emit(row);
  }

  clickMenuTrigge(event, row) {
    // if (!!row.isChecked) {
    event.preventDefault();
    event.stopPropagation();
    // }

  }


  clickXdraftItem(row, event) {
    this.xdraftItem.emit(row);
  }

  clickNewVersion(row, event) {
    this.newVersion.emit(row);
  }

  clickMoveFolder() {
    event.preventDefault();
    event.stopPropagation();
  }

  // clickMoveSelectedFolder(folder: Folder, row: FileItemWrapper) {
  //   this.moveSelectedFolder.emit({ folder: folder, row: row });

  // }
  onFolderChanged(folder: Folder, row: FileItemWrapper) {
    this.moveSelectedFolder.emit({ folder: folder, row: row });
  }

  checkIsShow(row: FileItemWrapper) {
    if (!this.isMuiltySelect) {
      return true;
    } else if (this.getIsChecked(row)) {
      return true;
    }
    return false;
  }
  onDragStart(event) {
    this.dragElement = document.getElementById('file-history-dragPreView');
    if (this.getIsChecked(this.rowData) || this.rowData.isExpand) {
      event.dataTransfer.setData('text', 'text/fileHistorData;jsonString,' +
        JSON.stringify(this.checkedItems.map(data => ({
          ...data,
          appId: this.matterInfo.AppId,
          appCode: this.matterInfo.AppCode,
          branchId: this.matterInfo.BranchId,
          fileId: this.matterInfo.FileId
        })))
      );
    } else {
      event.dataTransfer.setData('text', 'text/fileHistorData;jsonString,' + JSON.stringify([{
        ...this.rowData,
        appId: this.matterInfo.AppId,
        appCode: this.matterInfo.AppCode,
        branchId: this.matterInfo.BranchId,
        fileId: this.matterInfo.FileId
      }]));
    }
  }


  list_to_tree(list: Folder[]) {
    const map = {};
    let node: Folder;
    const roots: Folder[] = [];
    let i;
    if (list && list.length > 0) {

      for (i = 0; i < list.length; i += 1) {
        map[list[i].folderId] = i; // initialize the map
        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          if (list[map[node.parentId]] && list[map[node.parentId]].children) {
            list[map[node.parentId]].children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    } else {

      return roots;
    }
  }

}
