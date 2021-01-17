import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog } from '@angular/material';
import { TreeDataWrapper } from '../../models/interfce';
import { TreeItemType, ItemChangeKind } from '../../models/enums';

@Component({
  selector: 'dps-forms-library-tree',
  templateUrl: './forms-library-tree.component.html',
  styleUrls: ['./forms-library-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsLibraryTreeComponent implements OnInit {

  @Input() formsLibrarytree: TreeDataWrapper;

  @Output() itemChange = new EventEmitter<any>();

  doubleClick = false;
  TreeItemType = TreeItemType;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  public dpsTreeNodeExpandClick(event, selectedNode: TreeDataWrapper) {
    event.preventDefault();
    event.stopPropagation();
    this.itemChange.emit({ kind: ItemChangeKind.RowNodeExpand, value: selectedNode });
  }
  public onDpsTreeRowClick(event, selectedNode: TreeDataWrapper) {
    setTimeout(() => {
      if (this.doubleClick) {
        this.dpsTreeNodeExpandClick(event, selectedNode);
        this.doubleClick = false;
      }
      this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
      // if (selectedNode.data.nodeStatus === 2) {
      //   const dialogData: InforDialogData = {
      //     content: {
      //       title: MatDialogMessage.title,
      //       message: MatDialogMessage.message
      //     },
      //     data: { messageType: 'general' }
      //   };

      //   // popup dialog
      //   this.dialog.open(InforDialogComponent, {
      //     data: dialogData,
      //     width: '400px',
      //     disableClose: true,
      //     hasBackdrop: true,
      //     panelClass: 'dps-notification'
      //   });
      //   // return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
      //   //   return false;
      //   // });
      // } else {
      //   this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
      // }
    }, 280);
  }
  public onDpsTreeRowDoubleClick(event, selectedNode: TreeDataWrapper) {
    event.preventDefault();
    event.stopPropagation();
    this.doubleClick = true;
    this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
  }
  onItemChange(event) {
    if (event.kind === 'ROW_EDIT') {
      this.itemChange.emit(event);
    } else {
      this.itemChange.emit(event);
    }
  }
}
