import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExplorerViewType } from '../../../safe-box-explorer-core';

@Component({
  selector: 'dps-drive-popup',
  templateUrl: './drive-popup.component.html',
  styleUrls: ['./drive-popup.component.scss']
})
export class DrivePopupComponent implements OnInit {
  ExplorerViewType = ExplorerViewType;
  constructor(public dialogRef: MatDialogRef<DrivePopupComponent>) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }
}
