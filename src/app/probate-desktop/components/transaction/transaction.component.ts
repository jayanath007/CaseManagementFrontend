import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProbateDealtBy } from '../../../probate-account-core/models/enum';
import { TransactionGridRow, Transactions } from '../../../probate-core/models/interfaces';
import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResultKind } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @Input() token: string;
  @Input() transactions: Transactions;
  @Input() transactionsEditRow: any;
  @Input() matterData: any;
  @Input() selectedRow: TransactionGridRow;


  @Output() edittransactionClick = new EventEmitter<any>();
  @Output() submitSaveData = new EventEmitter<any>();
  @Output() selectedRowClick = new EventEmitter<any>();
  @Output() deleteSelectedRow = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();


  toggleActive = false;
  probateDealtBy = ProbateDealtBy;
  openDrewer = true;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  slideTogle(drawer) {
    this.toggleActive = !this.toggleActive;
    drawer.toggle();
  }

  onSubmitSaveData(submitData) {
    this.submitSaveData.emit(submitData);
  }

  onEdittransactionClick(row) {
    if (row && (row.dealtBy.toString() === ProbateDealtBy.DistributionPecuniary ||
      row.dealtBy.toString() === ProbateDealtBy.DistributionResiduary)) {
      this.openDrewer = false;

    } else {
      this.openDrewer = true;
    }

    this.edittransactionClick.emit(row);
  }

  onClear() {
    this.clear.emit();
  }

  // clickPopup() {
  //   const title = 'Payment';
  //   const matterData: any = {
  //     appId: 1,
  //     fileID: 2,
  //     branchID: 3,
  //     matterRef: null
  //   };

  //   this.popupService.openProbateAccountPopup('ProbateAccount', this.probateDealtBy.Payment, 'Payment', true, matterData, null)
  //     .subscribe((result: any) => {
  //       if (!result) {
  //         return '';
  //       }
  //     });

  // }

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

