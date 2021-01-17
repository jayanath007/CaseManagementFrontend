import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-matter-linked-dialog',
  templateUrl: './matter-linked-dialog.component.html',
  styleUrls: ['./matter-linked-dialog.component.scss']
})
export class MatterLinkedDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatterLinkedDialogComponent>, private menu: MainMenuItemResolverService) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  onCreateLinkedMatter(plotNo: string) {
    this.dialogRef.close(plotNo);
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }

}
