import { InfoDialogType } from './../../../core/utility/DpsUtility';
import { MatInput, MatDialog } from '@angular/material';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DriveItem, Drive } from '../../../core/lib/microsoft-graph';
import { ItemView } from '../../../drive-core';
import { checkUploadFileIsBlacklisted, showInforDialog } from '../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-root-folders-list',
  templateUrl: './root-folders-list.component.html',
  styleUrls: ['./root-folders-list.component.scss']
})
export class RootFoldersListComponent implements OnInit, OnChanges {

  @Input() isDriveFolderSelect: boolean;
  @Input() stikeyFolders: { drive: Drive; root: DriveItem; folders: DriveItem[]; }[];
  @Input() activeView: ItemView;
  @Input() activeDrive: Drive;
  @Input() loading: boolean;
  @Input() isPopup: boolean;

  @Output() driveSearch = new EventEmitter();
  @Output() openItem = new EventEmitter();
  @Output() addNew = new EventEmitter();
  @Output() uploadItem = new EventEmitter();

  @ViewChild(MatInput) searchInput: MatInput;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDriveFolderSelect && changes.isDriveFolderSelect.currentValue === false) {
      this.searchInput.value = '';
    }
    // if (this.isPopup && changes.activeDrive && changes.stikeyFolders.firstChange &&
    //   changes.stikeyFolders.currentValue !== null && changes.stikeyFolders.currentValue.length > 0) {
    //   this.onOpenItem(this.stikeyFolders[0].root);
    // }
  }
  onSearch(value) {
    if (value) {
      this.driveSearch.emit({ drive: this.activeDrive, searchText: value });
    }
  }
  onOpenItem(item) {
    this.openItem.emit(item);
    this.searchInput.value = '';
  }
  onAddNew(type) {
    this.addNew.emit({ activeView: this.activeView, type });
  }
  onFileChange(files: File[]) {
    let notValidList = '';
    for (let i = 0; i < files.length; i++) {
      if (checkUploadFileIsBlacklisted(files[i].name)) {
        notValidList = `${notValidList} <br> ${files[i].name}`;
      } else {
        this.uploadItem.emit({ file: files[i], destItem: this.activeView.owner });
      }
    }
    if (notValidList) {
      showInforDialog('Harmful file detection',
        `You are try to upload harmful file type, please contact admin.
       <br> ${notValidList}`, InfoDialogType.warning, this.dialog);
    }

  }
}

