import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { GroupListItem } from '../../../mail-core';
import { AddEditGroupPopupComponent } from '../add-edit-group-popup/add-edit-group-popup.component';

@Component({
  selector: 'dps-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {
  @Input() groups: GroupListItem[];
  @Input() isExpanded: boolean;
  @Input() isGroupMode: boolean;

  @Output() groupsToggle = new EventEmitter();
  @Output() selectGroup = new EventEmitter();
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  onGroupsToggle(event) {
    event.preventDefault();
    this.contextMenu.closeMenu();
    this.groupsToggle.emit();
  }
  contextmenuOpen(event) {
    event.preventDefault();
    // this.contextMenu.openMenu();
    // group creation
  }
  onCreateNewGroup() {
    const dialogRef = this.dialog.open(AddEditGroupPopupComponent, {
      width: '500px',
      height: '100%',
      maxHeight: '620px',
      panelClass: 'dps-add-edit-group-dialog',
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  onSelectGroup(event) {
    this.selectGroup.emit(event);
  }
}
