
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Folder, FileItemWrapper } from '../../../file-history-core/models/interface';
import { MatterInfo } from '../../../core';
@Component({
  selector: 'dps-file-history-default',
  templateUrl: './file-history-default.component.html',
  styleUrls: ['./file-history-default.component.scss']
})
export class FileHistoryDefaultComponent implements OnInit {

  constructor() { }

  @Input() fileHistorData: { data: FileItemWrapper[] };
  @Input() checkedItems: FileItemWrapper[];
  @Input() columnDef;
  @Input() deleteEntrySecurityInfo;
  @Input() isDocumentVersioning;
  @Input() pageInfo;
  @Input() pageSizeOptions;
  @Input() folderList: Folder[];
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
  @Output() pageChange = new EventEmitter<any>();
  @Output() moveSelectedFolder = new EventEmitter<any>();

  @Output() onCheckin = new EventEmitter<FileItemWrapper>();
  @Output() onDiscardCheckin = new EventEmitter<FileItemWrapper>();


  onPageChange(event) {
    this.pageChange.emit(event);
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
  onMoveSelectedFolder(event) {

    this.moveSelectedFolder.emit(event);
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



  ngOnInit() {
  }

}
