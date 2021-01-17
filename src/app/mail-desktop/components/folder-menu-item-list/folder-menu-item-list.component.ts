import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FolderItemWrapper } from '../../../mail-core';

@Component({
  selector: 'dps-folder-menu-item-list',
  templateUrl: './folder-menu-item-list.component.html',
  styleUrls: ['./folder-menu-item-list.component.scss']
})
export class FolderMenuItemListComponent implements OnInit {

  @Input() folders: FolderItemWrapper[];
  @Input() parentFolderId: string;

  @Output() selectFolder = new EventEmitter<FolderItemWrapper>();

  @ViewChild('childMenu') public childMenu;

  filtedFolders: FolderItemWrapper[] = [];

  constructor() { }

  ngOnInit() {
    this.filtedFolders = this.folders.filter(val => val.data.parentFolderId === this.parentFolderId);
  }
  onSelectFolder(folder: FolderItemWrapper) {
    this.selectFolder.emit(folder);
  }
  onCheckFolder(folder: FolderItemWrapper, event: Event) {
    event.preventDefault();
    this.selectFolder.emit(folder);
  }
  onClickFolder(folder: FolderItemWrapper, event: Event) {
    if (folder.data.childFolderCount > 0) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      this.selectFolder.emit(folder);
    }
  }
  getIcon(wellKnownName: string): string {
    switch (wellKnownName) {
      case 'inbox': return 'inbox';
      case 'drafts': return 'drafts';
      case 'sentitems': return 'unarchive';
      case 'deleteditems': return 'delete';
      case 'archive': return 'archive';
      case 'junkemail': return 'do_not_disturb';
      case 'outbox': return 'folder';
      default: return 'folder';
    }
  }
}
