import { TableColumn, CommonOverlayTriggerForDirective, InforDialogData, InforDialogComponent } from './../../../shared';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { RequestFormTypes } from '../../../billing-request-core/models/enums';
import {
  MatterData, TotalValues,
  TimeProfitHeaderResponseModel,
  BillingRequestTimeProfitHeaderResponseModel
} from './../../../billing-request-core/models/interfaces';
import { BillingRequestState } from './../../../billing-request-core/reducers/billing-request';
import { MatDialog } from '@angular/material';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-billing-details-data',
  templateUrl: './billing-details-data.component.html',
  styleUrls: ['./billing-details-data.component.scss']
})
export class BillingDetailsDataComponent implements OnInit {

  @Input() mainLoader: boolean;
  @Input() matterInfo: MatterData;
  @Input() requestViewData: BillingRequestState;
  @Input() totalValues: TotalValues;
  @Input() timeHeaderGridOrderData: TimeProfitHeaderResponseModel<BillingRequestTimeProfitHeaderResponseModel>[];
  @Input() timeOffset: number;
  @Input() matterDisplyName: string;
  @Input() clientDisplyName: string;
  @Output() narrativeItemText = new EventEmitter<any>();

  @Output() importPopupOpen = new EventEmitter<any>();
  @Output() expenseOrProfitCostPopupOpen = new EventEmitter<any>();
  @Output() billingNarrativePopupOpen = new EventEmitter<any>();
  @Output() matterSearchData = new EventEmitter<string>();
  @Output() timeAndCostGridSelectRowUpdate = new EventEmitter<any>();
  @Output() headerGridRowDoubleClick = new EventEmitter<any>();
  @Output() addToBillUpdate = new EventEmitter<any>();
  @Output() removeAllGridDataByGridType = new EventEmitter<any>();
  @Output() updateControllerValue = new EventEmitter<any>();
  @Output() billingRequestSave = new EventEmitter<any>();
  @Output() deleteBillRequest = new EventEmitter();


  @ViewChild(CommonOverlayTriggerForDirective) overlayTrigger: CommonOverlayTriggerForDirective;

  // new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  timeGridcolumns: TableColumn[] = [
    { name: 'Details', propertyName: 'details', width: '20%' },
    { name: 'F/E', propertyName: 'feeEarner', width: '15%' },
    { name: 'Bill F/E', propertyName: 'billFeeEarner', width: '15%' },
    { name: 'Units', propertyName: 'units', width: '10%', textAlign: 'right' },
    { name: 'Minutes', propertyName: 'mpu', width: '10%', textAlign: 'right' },
    { name: 'Net', propertyName: 'net', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'VAT', propertyName: 'vat', width: '15%', textAlign: 'right', numberFormat: '1.2-2' }
  ];
  disbursmentGridcolumns: TableColumn[] = [
    { name: 'F/E', propertyName: 'feeEarner', width: '20%' },
    { name: 'Details', propertyName: 'details', width: '40%' },
    { name: 'Net', propertyName: 'net', width: '20%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'VAT', propertyName: 'vat', width: '20%', textAlign: 'right', numberFormat: '1.2-2' }
  ];
  billToDate;
  billAmount;
  billingOptions;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.billingOptions = 'QuickBillEverything';
    if (this.requestViewData) {
      this.billToDate = this.requestViewData.quickBillDate;
      this.billAmount = this.requestViewData.quickBillAmmount;
    }
  }
  onFromMatterSearchBlur(event) {

  }
  onMatterSearchKeypress(event) {

  }
  onMatterSearch(event) {
    this.matterSearchData.emit(event);
  }
  onChangeunProforma(event) {
    // BillingRequestImportDataComponent
  }
  onSelectTime() {
    if (this.requestViewData && this.requestViewData.matterData && this.requestViewData.matterData.matterRef) {
      this.onOpenDataImportPopup(RequestFormTypes.selectTime);
    }
  }
  onDisbursements() {
    if (this.requestViewData && this.requestViewData.matterData && this.requestViewData.matterData.matterRef) {
      this.onOpenDataImportPopup(RequestFormTypes.selectDisbursement);
    }
  }
  onOpenDataImportPopup(popupInputData) {
    this.importPopupOpen.emit(popupInputData);
  }
  onAddProfitCost(formType) {
    this.onExpenseOrProfitCostPopup({ formType: RequestFormTypes.profitCost, inputData: this.requestViewData });
  }
  onAddExpences(formType) {
    this.onExpenseOrProfitCostPopup({ formType: RequestFormTypes.expense, inputData: this.requestViewData });
  }
  onExpenseOrProfitCostPopup(popupInputData) {
    this.expenseOrProfitCostPopupOpen.emit(popupInputData);
  }
  onOpenBillingNarrativePopup(event) {
    this.billingNarrativePopupOpen.emit();
  }
  onRowClick(event) {
    this.timeAndCostGridSelectRowUpdate.emit(event.row);
  }
  onRowDblClick(event) {
    if (this.requestViewData && this.requestViewData.billRequestID > 0 && !this.requestViewData.enableEditData) {
      return;
    }
    let popupType = RequestFormTypes.selectTime;
    if (event.row && event.row.isTimeHeaderGrid && event.row.isTimeItem) {
      popupType = RequestFormTypes.selectTime;
    } else if (event.row && event.row.isTimeHeaderGrid && !event.row.isTimeItem) {
      popupType = RequestFormTypes.profitCost;
    } else if (event.row && event.row.isDisbursmenGrid && event.row.isDisbursmenItem) {
      popupType = RequestFormTypes.selectDisbursement;
    } else if (event.row && event.row.isDisbursmenGrid && !event.row.isDisbursmenItem) {
      popupType = RequestFormTypes.expense;
    }
    const HeaderGridDataModel = {
      popupType: popupType,
      selectedRow: event.row
    };
    this.timeAndCostGridSelectRowUpdate.emit(event.row);
    this.headerGridRowDoubleClick.emit(HeaderGridDataModel);
  }
  onBillToAmountFocusout(value) {
    this.billAmount = value;
  }
  onBillTodddAmountFocusout(value) {
    this.billAmount = value;
  }
  onBillToDateChange(date: Date) {
    this.billToDate = date.toDpsString();
  }
  onRadioButtonChange(value) {
    this.billingOptions = value;
  }
  onAddToBill() {
    if (this.requestViewData.matterData && this.requestViewData.matterData.matterRef) {
      const billingRequestViewModel = {
        billingOption: this.billingOptions ? this.billingOptions : 'QuickBillEverything',
        billToAmount: this.billAmount ? this.billAmount : 0,
        billToDate: this.billToDate ? this.billToDate : dpsNewDate(this.timeOffset).toDpsString(),
        matterRef: this.requestViewData.matterData ? this.requestViewData.matterData.matterRef : '',
        timRef: 0 // As requested by Suren
      };
      this.addToBillUpdate.emit(billingRequestViewModel);
      this.overlayTrigger.closeOverlay();
    } else {
      this.showValidationMsg('Please enter a' + this.matterDisplyName + 'ref first.');
    }
  }
  onRemoveAllGridDataByGridType(gridType) {
    this.removeAllGridDataByGridType.emit(gridType);
  }
  onChangeNarrativeItemText(text) {
    this.narrativeItemText.emit(text);
  }
  onControllerFocusOut(controllerName, Value) {
    this.updateControllerValue.emit({ controllerName: controllerName, value: Value });
  }
  onRequestSave(buttonType) {
    this.billingRequestSave.emit(buttonType);
  }
  onDeleteBillRequest() {
    this.deleteBillRequest.emit();
  }
  showValidationMsg(errorMsg) {
    if (errorMsg) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Billing',
          message: errorMsg
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
    }
  }
}
