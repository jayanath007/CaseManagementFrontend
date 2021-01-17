import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FolderItemWrapper, MailBox } from '../../../mail-core';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { FolderPermissionsPopupComponent } from '../folder-permissions-popup/folder-permissions-popup.component';
import { User } from '../../../core/lib/microsoft-graph';
import { AddMailBoxPopupComponent } from '../../../mail-desktop-shared/components/add-mail-box-popup/add-mail-box-popup.component';

@Component({
  selector: 'dps-mailbox-item',
  templateUrl: './mailbox-item.component.html',
  styleUrls: ['./mailbox-item.component.scss']
})
export class MailboxItemComponent implements OnInit, OnChanges {
  @Input() folders: FolderItemWrapper[];
  @Input() deleteItemsFolder: FolderItemWrapper;
  @Input() mailBox: MailBox;
  @Input() isGroupMode: boolean;
  @Input() profile: { upn: string, name: string };

  @Output() itemToggleExpand = new EventEmitter();
  @Output() itemSelect = new EventEmitter();
  @Output() itemEditOperations = new EventEmitter();
  @Output() newRootFolder = new EventEmitter();
  @Output() moveItems = new EventEmitter();
  @Output() mailboxToggle = new EventEmitter();
  @Output() removeSharedFolder = new EventEmitter();
  @Output() addSharedFolder = new EventEmitter();
  @Output() mailboxRefresh = new EventEmitter();
  @Output() itemRefresh = new EventEmitter();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  showProfileImg = false;
  showInput = false;

  get mailBoxFolders() {
    return this.folders.filter(folder => folder.owner === this.mailBox.mail);
  }
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.mailBox) {
      this.showProfileImg = false;
    }
  }
  onNewRootFolder(displayName) {
    this.newRootFolder.emit(displayName);

  }

  onMoveItems(event) {
    this.moveItems.emit(event);
  }
  onFolderEditOperation(event) {
    this.itemEditOperations.emit(event);
  }

  onFolderSelect(event) {
    this.itemSelect.emit(event);
  }
  onFolderRefresh(event) {
    this.itemRefresh.emit(event);
  }
  onFolderToggle(event) {
    this.itemToggleExpand.emit(event);
  }
  onMailboxToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.mailBox.loading) {
      this.mailboxToggle.emit(this.mailBox);
    }
  }
  onRefreshMailBox() {
    if (!this.mailBox.loading) {
      this.mailboxRefresh.emit(this.mailBox);
    }
  }
  contextmenuOpen(event) {
    event.preventDefault();
    this.contextMenu.openMenu();
  }
  onAddSharedFolder() {
    const dialogRef = this.dialog.open(AddMailBoxPopupComponent, {
      width: '500px',
      height: '215px',
      panelClass: 'dps-organizer-fld-shared-dialog',
      disableClose: true,
      data: {
        icon: 'folder_shared',
        title: 'Add Shared folder',
        message: 'Enter the name or email address of a user who has shared folders with you.'
      }
    });
    dialogRef.afterClosed().subscribe((result: User) => {
      if (result && result.mail.toLowerCase() !== this.profile.upn.toLowerCase()) {
        this.addSharedFolder.emit(result);
      }
    });
  }
  onRemoveSharedFolder() {
    this.removeSharedFolder.emit(this.mailBox);
  }
  onCreateRootFolder(displayName) {
    this.showInput = false;
    if (displayName) {
      this.newRootFolder.emit(displayName);
    }
  }

  onKey(event: KeyboardEvent, value) {
    if (event.keyCode === ESCAPE) {
      event.stopPropagation();
      event.preventDefault();
      this.showInput = false;
    } else if (event.keyCode === ENTER) {
      this.onCreateRootFolder(value);
      event.stopPropagation();
      event.preventDefault();
    }
  }
  permissions() {
    const deleteDialogRef = this.dialog.open(FolderPermissionsPopupComponent, {
      data: { id: 'msgfolderroot', displayName: this.mailBox.displayName },
      width: '600px',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-folder-permissions-popup'
    });
  }
}
