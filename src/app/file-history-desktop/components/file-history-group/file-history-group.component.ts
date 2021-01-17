

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FileHistoryGroup, FileItemWrapper, Folder } from '../../../file-history-core/models/interface';
import { MatterInfo } from '../../../core';
@Component({
  selector: 'dps-file-history-group',
  templateUrl: './file-history-group.component.html',
  styleUrls: ['./file-history-group.component.scss']
})
export class FileHistoryGroupComponent implements OnInit {

  @Input() fileHistorData: { data: FileItemWrapper[], loading: true, total: number, groupData?: FileHistoryGroup[] };
  @Input() checkedItems: FileItemWrapper[];
  @Input() columnDef;
  @Input() deleteEntrySecurityInfo;
  @Input() isDocumentVersioning;
  @Input() folderList: Folder;
  @Input() isMuiltySelect: boolean;
  @Input() matterInfo: MatterInfo;

  @Output() onDeleteRow = new EventEmitter<any>();
  @Output() onEditRow = new EventEmitter<any>();
  @Output() onCheckedRow = new EventEmitter<any>();
  @Output() signDoc = new EventEmitter<any>();
  @Output() xdraftItem = new EventEmitter<any>();
  @Output() newVersion = new EventEmitter<any>();
  @Output() share = new EventEmitter<any>();
  @Output() expand = new EventEmitter<any>();
  @Output() groupRowChange = new EventEmitter<any>();
  @Output() moveSelectedFolder = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();

  @Output() onCheckin = new EventEmitter<any>();
  @Output() onDiscardCheckin = new EventEmitter<any>();

  constructor() { }


  onLoadMore(event) {
    this.loadMore.emit(event);
  }


  onExpand(item, event) {
    if (!!event.ctrlKey) {
      this.onCheckedRow.emit(item);
    } else {
      this.expand.emit(item);
      event.preventDefault();
    }
  }

  onGroupRowChange(event) {
    this.groupRowChange.emit(event);
  }

  deleteRow(event) {
    this.onDeleteRow.emit(event);
  }
  editRow(event) {
    this.onEditRow.emit(event);
  }
  checkedRow(event) {
    this.onCheckedRow.emit(event);
  }
  onSignDoc(event) {
    this.signDoc.emit(event);
  }
  onXdraftItem(event) {
    this.xdraftItem.emit(event);
  }
  onNewVersion(event) {
    this.newVersion.emit(event);
  }
  onShare(event) {
    this.share.emit(event);
  }

  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }

  getFilehistoryDataGroupIds(groupHash) {
    if (this.fileHistorData && this.fileHistorData.data && this.fileHistorData.data.length > 0) {
      return this.fileHistorData.data.filter(row => row.groupHash === groupHash);
    }
    return [];
  }

  onMoveSelectedFolder(event) {

    this.moveSelectedFolder.emit(event);
  }

  ngOnInit() {
  }

}
