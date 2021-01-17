import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  DeceasedInfo, DistributionViewItems, EstateOverViews, IhtFormsData, ProbateMatterInput, ResidenceNilRateBandData,
  SelectProRow,
  SpouseorCivilPatnerData, Transactions
} from '../../../probate-core/models/interfaces';
import { FormType, Mode, ProbateDealtBy } from '../../../probate-estate-overview/models/enums';
import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResultKind } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';


@Component({
  selector: 'dps-probate-layout',
  templateUrl: './probate-layout.component.html',
  styleUrls: ['./probate-layout.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ProbateLayoutComponent implements OnInit {
  @Input() token: string;
  @Input() loading: boolean;
  @Input() deceasedInfo: DeceasedInfo;
  @Input() distributionViewItems: DistributionViewItems[];
  @Input() estateOverViews: EstateOverViews;
  @Input() residenceNilRateBandData: ResidenceNilRateBandData;
  @Input() spouseorCivilPatnerData: SpouseorCivilPatnerData;
  @Input() transactions: Transactions;
  @Input() transactionsEditRow: any;
  @Input() distributionEditRow: any;
  @Input() selectedRow: SelectProRow;
  @Input() ihtFormsData: IhtFormsData[];
  @Input() inputData: any;
  @Input() selectedIhtRow: IhtFormsData;




  @Input() matterData: ProbateMatterInput;
  @Output() editEstateClick = new EventEmitter<any>();
  @Output() addProbateOverView = new EventEmitter<any>();
  @Output() rnrbDataUpdate = new EventEmitter<any>();
  @Output() submitSaveData = new EventEmitter<any>();
  @Output() edittransactionClick = new EventEmitter<any>();
  @Output() spouseCivilUpdate = new EventEmitter<any>();
  @Output() editDistributionClick = new EventEmitter<any>();
  @Output() selectedRowClick = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();
  @Output() deleteProbateRow = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  // IhT Form
  @Output() generateForm = new EventEmitter<any>();
  @Output() generateAccounts = new EventEmitter<any>();
  @Output() openIntForm = new EventEmitter<any>();



  @Output() closePopup = new EventEmitter<any>();

  FormType = FormType;
  isForce205 = false;
  isForce400 = false;

  constructor(private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }

  onClose() {

    this.closePopup.emit();
  }

  onChangeFirstName(value) {


  }

  onChangeSureName(value) {

  }
  onDeleteEstateOverview(type) {
    this.deleteRow.emit(type);

  }

  onRnrbDataUpdate(event) {
    this.rnrbDataUpdate.emit(event);
  }

  onSubmitSaveData(submitData) {
    this.submitSaveData.emit(submitData);
  }

  onEdittransactionClick(row) {
    if (row && (row.dealtBy.toString() === ProbateDealtBy.DistributionPecuniary ||
      row.dealtBy.toString() === ProbateDealtBy.DistributionResiduary ||
      row.dealtBy === ProbateDealtBy.Sold)) {
      const matterInfo = {
        fileID: this.inputData.fileID,
        branchID: this.inputData.branchID,
        appId: this.inputData.appId,
        matterReferenceNo: this.inputData.matterReferenceNo,
      };


      const editData = {
        amount: Math.abs(row.amount),
        contactId: row.contactId,
        credit: row.amount,
        dealtBy: row.dealtBy,
        details: row.details,
        id: row.id,
        itemDescription: row.itemDescription,
        quantitySold: row.quantitySold,
        receiptType: row.receiptType,
        date: row.soldDate,
        soldDate: row.soldDate,
        probateTransId: row.probatTransId,
        percent: 0,
        beneficiary: row.contactName,
        contactCompany: row.contactCompany,
        contactAddress1: row.contactAddress1,
        contactPostCode: row.contactPostCode,

      };
      let tite = '';
      if (row.dealtBy.toString() === ProbateDealtBy.DistributionResiduary) {
        tite = 'Residuary';
      } else if (row.dealtBy.toString() === ProbateDealtBy.DistributionPecuniary) {
        tite = 'Pecuniary';
      } else if (row.dealtBy === ProbateDealtBy.Sold) {
        tite = 'Sell';
      }
      this.popupService.openProbateAccountPopup('AssetProbateAccount', row.dealtBy, tite, true, matterInfo, editData,
        row.probatTransId).subscribe((result: any) => {
          if (result && result.data && result.data.id) {

          }
        });
      this.edittransactionClick.emit(null);
    } else {
      this.edittransactionClick.emit(row);

    }



  }

  onUpdateSpouseCivil(event) {
    this.spouseCivilUpdate.emit(event);
  }

  onEditDistributionClick(event) {
    this.editDistributionClick.emit(event);
  }

  onSelectedRowClick(event) {
    this.selectedRowClick.emit(event);
  }
  onAddProbateOverView(popupType: FormType) {
    if (this.matterData) {
      this.popupService.probateEstatePopup('ProbateEstatePopup', {
        matterData: this.matterData,
        type: popupType, mode: Mode.AddMode, editData: null
      }).subscribe((data) => {
        // inputData
      });
    } else {
      alert('No matter data');
    }
  }
  onEditEstateClick(gridRowData) {
    if (gridRowData && gridRowData.id) {
      this.popupService.probateEstatePopup('ProbateEstatePopup', {
        matterData: this.matterData,
        type: gridRowData.popupType, mode: Mode.EditMode, editData: { rowId: gridRowData.id }
      }).subscribe((data) => {
        // Grid refresh
      });
    } else {
      alert('No matter data');
    }
  }

  onDeleteSelectedRow(event) {
    this.deleteRow.emit(event);
  }

  onDeleteSelectedProbateRow() {

    if (this.selectedRow && this.selectedRow.selectedEstateRow
      && this.selectedRow.selectedEstateRow.id) {

      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Remove Contact',
          message: 'Are you sure you want to delete the selected item ? This will delete any accounts data associated with it.',
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


          this.deleteProbateRow.emit(this.selectedRow.selectedEstateRow.id);

        }
      });



    } else {


    }

  }
  onClear() {
    this.clear.emit();

  }

  onChangeIHT205(value) {
    this.isForce205 = value;
  }
  onChangeIHT400(value) {
    this.isForce400 = value;
  }
  onGenerateForm(value) {
    this.generateForm.emit({ isForce205: this.isForce205, isForce400: this.isForce400 });
  }
  onGenerateAccounts(value) {
    this.generateAccounts.emit({});
  }

  onOpenIntForm(event: IhtFormsData) {
    this.openIntForm.emit(event);
  }

}
