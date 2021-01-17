import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MailFolder, User } from '../../../core/lib/microsoft-graph';
import { FolderPermissions, FolderPermission, PermissionLevel, ReadItems, EditDeleteItems } from '../../../mail-core';
import { MatSelectChange, MatDialog } from '@angular/material';
import { AddMailBoxPopupComponent } from '../../../mail-desktop-shared/components/add-mail-box-popup/add-mail-box-popup.component';

@Component({
  selector: 'dps-folder-permissions-layout',
  templateUrl: './folder-permissions-layout.component.html',
  styleUrls: ['./folder-permissions-layout.component.scss']
})
export class FolderPermissionsLayoutComponent implements OnInit {
  @Input() selectedFolder: MailFolder;
  @Input() folderPermissions: FolderPermissions;

  @Output() close = new EventEmitter();
  @Output() valueChange = new EventEmitter();
  @Output() selectUserPermission = new EventEmitter();
  @Output() permissionLevelChange = new EventEmitter();
  @Output() addPermission = new EventEmitter();
  @Output() removeSelectedPermission = new EventEmitter();
  @Output() saveFolderPermissions = new EventEmitter();

  PermissionLevel = PermissionLevel;
  ReadItems = ReadItems;
  EditDeleteItems = EditDeleteItems;
  get selectedPermission(): FolderPermission {
    return this.folderPermissions ? this.folderPermissions.permissionSet.find(val => val.isSelected) : null;
  }
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  onAdd() {
    const dialogRef = this.dialog.open(AddMailBoxPopupComponent, {
      width: '500px',
      height: '215px',
      panelClass: 'dps-organizer-fld-shared-dialog',
      disableClose: true,
      data: {
        icon: 'person_pin',
        title: 'Add permissions',
        message: 'Enter the name or email address of the person you want to give permissions to this folder.'
      }
    });
    dialogRef.afterClosed().subscribe((result: User) => {

      if (result) {
        const folderPermission = this.folderPermissions.permissionSet
          .find(val => val.userId.userId.toLowerCase() === result.mail.toLowerCase());
        if (folderPermission) {
          this.onSelectUserPermission(folderPermission);
        } else {
          this.addPermission.emit(result);
        }
      }
    });
  }
  onRemove() {
    this.removeSelectedPermission.emit();
  }
  onOk() {
    this.saveFolderPermissions.emit(this.folderPermissions);
    this.close.emit();
  }
  onClose() {
    this.close.emit();
  }
  onSelectUserPermission(folderPermission: FolderPermission) {
    this.selectUserPermission.emit(folderPermission.userId);
  }
  onValueChange(value, key) {
    this.valueChange.emit({ value, key });
  }
  onPermissionLevelChange(event: MatSelectChange) {
    this.permissionLevelChange.emit(event.value);
  }
}
