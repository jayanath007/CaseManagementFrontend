import { ItemChangeKind, MatDialogMessage } from '../../../workflow-menu-core/models/enums';
import { WorkflowMenuMetaDataWrapper } from '../../../workflow-menu-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-workflow-menu-view',
  templateUrl: './workflow-menu-view.component.html',
  styleUrls: ['./workflow-menu-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowMenuViewComponent implements OnInit {

  @Input() menuTreeItems: any;
  @Input() gridFontSize: any;

  @Output() itemChange = new EventEmitter<any>();

  doubleClick = false;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  public dpsTreeNodeExpandClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    event.preventDefault();
    event.stopPropagation();
    if (selectedNode.data.nodeStatus === 2) {
      const dialogData: InforDialogData = {
        content: {
          title: MatDialogMessage.title,
          message: MatDialogMessage.message
        },
        data: { messageType: 'general'}
      };

      // popup dialog
      this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification' 
      });
    } else {
      this.itemChange.emit({ kind: ItemChangeKind.RowNodeExpand, value: selectedNode });
    }
  }

  public onDpsTreeRowClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    setTimeout(() => {
      if (this.doubleClick) {
        this.dpsTreeNodeExpandClick(event, selectedNode);
        this.doubleClick = false;
      }
      if (selectedNode.data.nodeStatus === 2) {
        const dialogData: InforDialogData = {
          content: {
            title: MatDialogMessage.title,
            message: MatDialogMessage.message
          },
          data: { messageType: 'general'}
        };

        // popup dialog
        this.dialog.open(InforDialogComponent, {
          data: dialogData,
          width: '400px',
          disableClose: true,
          hasBackdrop: true,
          panelClass: 'dps-notification' 
        });
        // return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
        //   return false;
        // });
      } else {
        this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
      }
    }, 280);
  }
  // ).do((result) => result === false ? this.dialogRef.close() : null)
  //     } else {
  //   this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
  // }
  //   }

  public onDpsTreeRowDoubleClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    event.preventDefault();
    event.stopPropagation();
    this.doubleClick = true;
    this.itemChange.emit({ kind: ItemChangeKind.RowEdit, value: selectedNode });
  }

  onItemChange(event) {
    if (event.kind === 'ROW_EDIT') {
      this.itemChange.emit(event);
    } else {
      this.itemChange.emit(event);
    }
  }
  // isMenuItemExist(item: WorkflowMenuMetaDataWrapper) {
  //   if (item.items.length > 0) {
  //     item.items.map((_item) => {
  //       if (_item.data.atN_Type === 1) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   } else {
  //     return false;
  //   }
  // }

}
