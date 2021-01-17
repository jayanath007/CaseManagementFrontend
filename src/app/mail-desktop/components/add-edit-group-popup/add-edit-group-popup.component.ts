import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Group } from '../../../core/lib/microsoft-graph';
import { AddEditGroupManagerComponent } from '../../containers/add-edit-group-manager.component';
import { InforDialogData, InforDialogComponent } from '../../../shared';

@Component({
  selector: 'dps-add-edit-group-popup',
  templateUrl: './add-edit-group-popup.component.html',
  styleUrls: ['./add-edit-group-popup.component.scss']
})
export class AddEditGroupPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { groupId: string },
    public dialogRef: MatDialogRef<AddEditGroupPopupComponent>, public dialog: MatDialog) { }

  ngOnInit() {
  }
  onDelete() {

  }
  onSave(group: Group, mailNickname: string, manager: AddEditGroupManagerComponent) {
    if (!group.displayName) {
      const inforDialogData: InforDialogData = {
        content: {
          title: `Required`,
          message: group.id ? `You need to name this group before you can save it.` :
            `The group name can't be empty. Please enter a group name.`
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: inforDialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'dps-notification'
      });
    } else if (!group.id && !mailNickname) {
      const inforDialogData: InforDialogData = {
        content: {
          title: `Required`,
          message: `The email address can't be empty. Please enter an email address.`
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: inforDialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'dps-notification'
      });
    } else if (!group.id && mailNickname !== mailNickname.replace(/\W/g, '')) {
      const inforDialogData: InforDialogData = {
        content: {
          title: `Invalid`,
          message: `The email address includes invalid characters.`
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: inforDialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'dps-notification'
      });
    } else {
      if (group.id) {
        manager.onSaveGroup(group);
      } else {
        manager.onSaveGroup({ ...group, mailNickname: mailNickname, description: group.description || group.displayName });
      }
    }
  }
}
