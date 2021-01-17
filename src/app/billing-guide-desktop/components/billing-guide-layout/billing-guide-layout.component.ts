import { EventEmitter, Component, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogData, ConfirmDialogComponentWithCancel, ConfirmDialogWithCancelResultKind } from '../../../shared';
import { BillingGuideAnalysisType, BillingGuideSortBy, BillingGuideShowTime } from '../../../billing-guide-core/models/enum';
import {
  BillingGuideViewModel, BillingGuidePopupData, BilledValueResponse,
  BillValue
} from '../../../billing-guide-core/models/interfaces';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-billing-guide-layout',
  templateUrl: './billing-guide-layout.component.html',
  styleUrls: ['./billing-guide-layout.component.scss']

})
export class BillingGuideLayoutComponent implements OnInit, OnChanges {

  @Input() inputData: BillingGuidePopupData;
  @Input() matterRef: string;
  @Input() clientName: string;
  @Input() isLoading: boolean;
  @Input() billedValueData: BillValue;
  @Input() billingGuideData: BillingGuidePopupData;
  @Input() billingGuideNoFile: boolean;
  @Input() timeOffset: number;
  @Input() matterDisplyName: string;

  @Output() closePopup = new EventEmitter<any>();
  @Output() submit = new EventEmitter();
  @Output() saveFile = new EventEmitter();
  @Output() analysisTypeChange = new EventEmitter<string>();

  isdurty: boolean;

  activity = true;
  fromDate;
  toDate;
  analysisType: BillingGuideAnalysisType;
  billingGuideSortBy = BillingGuideSortBy.FeeEarner;
  billingGuideShowTime = BillingGuideShowTime.UnBilled;
  chkFeeEarner = true;
  chkActivity = false;
  chkType = false;
  chkHideZeroValues = false;
  chkBillingSummaryReport = false;
  chkIncludeDisbursement = true;
  selected;


  AnalysisType = BillingGuideAnalysisType;
  SortBy = BillingGuideSortBy;
  ShowTime = BillingGuideShowTime;

  color = 'accent';
  checked = false;
  disabled = false;

  constructor(private store: Store<any>, private dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.toDate = dpsNewDate(this.timeOffset).toDpsString();
    const curentYear = dpsNewDate(this.timeOffset).getFullYear();
    this.fromDate = new Date(dpsNewDate(this.timeOffset).setFullYear(curentYear - 1)).toDpsString();
    this.analysisType = this.billingGuideData.analysisType;

    if (this.billingGuideData.analysisType === BillingGuideAnalysisType.BillingGuide) {
      this.billingGuideSortBy = BillingGuideSortBy.FeeEarner;
      this.billingGuideShowTime = BillingGuideShowTime.UnBilled;
      this.selected = this.billingGuideData.analysisType;
    } else {
      this.chkFeeEarner = true;
      this.selected = this.billingGuideData.analysisType;
    }

  }

  onAnalysisTypeChange(event) {

    this.analysisTypeChange.emit(event);

    if (event.value === BillingGuideAnalysisType.BillingGuide) {
      this.billingGuideSortBy = BillingGuideSortBy.FeeEarner;
      this.billingGuideShowTime = BillingGuideShowTime.UnBilled;
      this.selected = event.value;
    } else {
      this.chkFeeEarner = true;
      this.selected = event.value;
    }
  }

  onSummaryReportChange(event) {

    // if (event.checked === true) {

    //   this.chkActivity = true;

    // } else {

    //   this.chkFeeEarner = true;

    // }
    // if (event.checked === true && this.chkFeeEarner === true) {
    //   this.chkType = true;

    // }


  }


  updateSearchState() {
  }

  onFeeEarnerChange(event) {
    if (event.checked === false) {

      this.chkType = true;

    }
    // if (event.checked === true && this.chkBillingSummaryReport === true) {
    //   this.chkType = true;

    // }
  }

  onTypeChange(event) {
    if (event.checked === false) {

      this.chkFeeEarner = true;
      // this.chkBillingSummaryReport = true;

    }

    if (this.chkFeeEarner === true && this.chkBillingSummaryReport === true) {
      // this.chkIncludeDisbursement = false;

    }
  }

  onIncludeDisbursementChange() {
    if (this.chkFeeEarner === true && this.chkBillingSummaryReport === true) {
      //  this.chkType = true;

    }

  }


  // else {

  // this.chkFeeEarner;

  // }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchState && !changes.searchState.isFirstChange() && changes.searchState.currentValue) {
      this.updateSearchState();
    }

  }




  onClose() {
    if (this.isdurty === true && this.billingGuideNoFile !== true
      && this.billingGuideData.analysisType !== BillingGuideAnalysisType.Time) {


      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Report',
          message: `Save Report to ${this.matterDisplyName}?`,
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
          this.saveFile.emit();
          this.closePopup.emit();
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
          this.closePopup.emit();
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
        }
      });


    } else {
      this.closePopup.emit();
    }

  }

  onSubmit() {
    const billingGuideViewModel: BillingGuideViewModel = {
      activity: this.activity,
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') + 'T00:00:00',
      toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd') + 'T00:00:00',
      clientName: this.billingGuideData.clientName,
      matterRef: this.billingGuideData.matterRef,
      analysisType: this.analysisType,
      billingGuideSortBy: this.billingGuideSortBy,
      billingGuideShowTime: this.billingGuideShowTime,
      chkFeeEarner: this.chkFeeEarner,
      chkActivity: this.chkActivity,
      chkType: this.chkType,
      chkHideZeroValues: this.chkHideZeroValues,
      chkBillingSummaryReport: this.chkBillingSummaryReport,
      chkIncludeDisbursement: this.chkIncludeDisbursement,
      caseFileIdentityWithAppIdViewModel: {
        branchId: this.billingGuideData.branchId,
        appId: this.billingGuideData.appId,
        fileId: this.billingGuideData.fileId,
      }
    };
    // if (this.analysisType === BillingGuideAnalysisType.Time && this.billingGuideShowTime === BillingGuideShowTime.BilledTime
    //   && this.billedValueData.billedValue === 0.00) {
    //   const dialogData: InforDialogData = {
    //     content: {
    //       title: 'WIP Transactions',
    //       message: 'No transactions found for matter ' + this.billingGuideData.matterRef,
    //     },
    //     data: { messageType: 'warning' }
    //   };
    //   const dialogRef = this.dialog.open(InforDialogComponent, {
    //     data: dialogData,
    //     width: '300px',
    //     disableClose: true,
    //     panelClass: 'dps-notification'
    //   });
    // } else {
    this.isdurty = true;
    this.submit.emit(billingGuideViewModel);

    // }


  }

}
