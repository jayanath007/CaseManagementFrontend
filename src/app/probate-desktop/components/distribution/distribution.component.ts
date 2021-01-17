import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DistributionViewItems } from '../../../probate-core/models/interfaces';
import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResultKind } from '../../../shared';

@Component({
  selector: 'dps-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements OnInit {
  @Input() token: string;
  @Input() matterData: any;
  @Input() distributionViewItems: DistributionViewItems[];
  @Input() distributionEditRow: any;
  @Input() selectedRow: any;

  @Output() editDistributionClick = new EventEmitter<any>();
  @Output() deleteSelectedRow = new EventEmitter<any>();
  @Output() selectedRowClick = new EventEmitter<any>();

  toggleActive = false;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }
  slideTogle(drawer) {
    this.toggleActive = !this.toggleActive;
    drawer.toggle();
  }


  onEditDistributionClick(rowData) {
    this.editDistributionClick.emit(rowData);

  }

  onSelectedRowClick(event) {
    this.selectedRowClick.emit(event);
  }

  onDelete() {
    if (this.selectedRow && this.selectedRow.id) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Remove Contact',
          message: 'Are you sure you want to delete the selected item ?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {


        } else if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {


          this.deleteSelectedRow.emit(this.selectedRow.id);

        }
      });


    } else {


    }


  }




}
