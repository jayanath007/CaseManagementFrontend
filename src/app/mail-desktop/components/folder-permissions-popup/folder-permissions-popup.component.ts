import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MailFolder } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-folder-permissions-popup',
  templateUrl: './folder-permissions-popup.component.html',
  styleUrls: ['./folder-permissions-popup.component.scss']
})
export class FolderPermissionsPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: MailFolder, public dialogRef: MatDialogRef<FolderPermissionsPopupComponent>) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }
}
