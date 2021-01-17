import {
  BillingRequestProcessViewModel, FeeEarner, VatCode,
  DpsSelectModel,
  BillingRequestDisbursExpenseHeaderViewModel
} from './../../../billing-request-core/models/interfaces';
import {
  RowUpdateStatus,
  ImportGridIsSelectVal,
  RecordTypes, PopupOpenMode, DropDownPropertyName
} from './../../../billing-request-core/models/enums';
import { BillingRequestState } from './../../../billing-request-core/reducers/billing-request';
import { TableColumn, TableRow, InforDialogData, InforDialogComponent } from './../../../shared';
import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { RequestFormTypes } from '../../../billing-request-core/models/enums';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-billing-request-import-data',
  templateUrl: './billing-request-import-data.component.html',
  styleUrls: ['./billing-request-import-data.component.scss']
})
export class BillingRequestImportDataComponent implements OnInit {
  @Input() requestViewData: BillingRequestState;
  @Input() feeEarnerList: DpsSelectModel<FeeEarner>[];
  @Input() allocateList: DpsSelectModel<FeeEarner>[];
  @Input() vatCodeList: DpsSelectModel<VatCode>[];

  @Output() close = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();
  @Output() rowSelectedValUpdate = new EventEmitter<any>();
  @Output() timeOkButtonUpdate = new EventEmitter<any>();
  @Output() selectUnselectWriteOffUpdate = new EventEmitter<any>();
  @Output() allocateSelectChange = new EventEmitter<any>();
  @Output() onDropDownChange = new EventEmitter<any>();
  @Output() timeEntryEdit = new EventEmitter<any>();

  columns: TableColumn[];
  rows: TableRow<any>[];
  cmbAllocateToColumns: TableColumn[];
  cmbNominalColumns: TableColumn[];
  cmbVatCodeColumns: TableColumn[];

  importGridIsSelectVal: ImportGridIsSelectVal;

  allocateSelectedValue = { key: null, value: null };
  descriptionSelectedValue = { key: null, value: null };
  vatCodeSelectedValue = { key: null, value: null };
  nominalSelectedValue = { key: null, value: null };
  isEdit = false;
  billTo;
  matterRef;
  matterFeeEarner;
  gridShow = true;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    if (this.requestViewData.importAndAddRecordPopupMode === PopupOpenMode.Edit) {
      this.billTo = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.billTo)
        ? this.requestViewData.popupEditDataMode.billTo : '0.00';
      this.vatCodeSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.vatCode)
        ? { key: this.requestViewData.popupEditDataMode.vatCode, value: null } : { key: 20, value: 1 };
      this.nominalSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.nominalVal)
        ? { key: this.requestViewData.popupEditDataMode.nominalVal, value: null } : { key: null, value: null };
      this.allocateSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.allocateTo)
        ? { key: this.requestViewData.popupEditDataMode.allocateTo, value: null } : { key: null, value: null };
      this.gridShow = false;
    } else {
      this.billTo = '0.00';
      this.vatCodeSelectedValue = { key: 1, value: 1 };
      this.gridShow = true;
      this.nominalSelectedValue = (this.requestViewData && this.requestViewData.userNominalCode)
        ? { key: this.requestViewData.userNominalCode, value: null } : { key: null, value: null };
    }
    if (this.requestViewData && this.requestViewData.matterData) {
      this.matterRef = this.requestViewData.matterData.matterRef;
      this.matterFeeEarner = this.requestViewData.matterData.feeEarner;
    }
    this.cmbAllocateToColumns = [
      { name: 'Code', propertyName: 'key', width: '30%' },
      { name: 'Name', propertyName: 'value', width: '70%' }
    ];
    this.cmbNominalColumns = [
      { name: 'Code', propertyName: 'noM_Account_Ref', width: '30%' },
      { name: 'Description', propertyName: 'noM_Account_Name', width: '70%' },
    ];
    this.cmbVatCodeColumns = [
      { name: 'Code', propertyName: 'vatCode', width: '30%' },
      { name: 'Description', propertyName: 'vatDescription', width: '45%' },
      { name: 'Rate', propertyName: 'vatRate', width: '25%' },
    ];
    if (this.requestViewData && this.requestViewData.requestFormTypes === RequestFormTypes.selectTime) {
      this.columns = [
        { name: 'F/E', propertyName: 'timFeeEarner', width: '5%' },
        { name: 'Bill F/E', propertyName: 'timBillEarner', width: '5%' },
        { name: 'Date', propertyName: 'timDate', width: '15%', isDate: true, dateFormat: 'dd/MM/yyyy' },
        { name: 'Details', propertyName: 'timDetails', width: '15%', textAlign: 'left' },
        { name: 'Nominal', propertyName: 'nominal', width: '10%', textAlign: 'right' },
        { name: 'Units', propertyName: 'timUnits', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
        { name: 'Rate', propertyName: 'timRate', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
        { name: 'Value', propertyName: 'timShowVal', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
        { name: 'Uplift', propertyName: 'uplift', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
        { name: 'Sel', propertyName: 'recordType', width: '10%', textAlign: 'right' }
      ];
    } else if (this.requestViewData && this.requestViewData.requestFormTypes === RequestFormTypes.selectDisbursement) {
      this.columns = [
        { name: 'F/E', propertyName: 'feeEarner', width: '10%' },
        { name: 'Ref', propertyName: 'purRef', width: '15%' },
        { name: 'Date', propertyName: 'itemDate', width: '15%', isDate: true, dateFormat: 'dd/MM/yyyy' },
        { name: 'Details', propertyName: 'details', width: '10%', textAlign: 'left' },
        { name: 'Paid', propertyName: 'purPaid', width: '10%', textAlign: 'right', isCheckBox: true },
        { name: 'Net', propertyName: 'net', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
        { name: 'VAT', propertyName: 'vat', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
        { name: 'Sel', propertyName: 'selectUnSelectVal', width: '10%', textAlign: 'right' }
      ];
    }
  }
  get valuTotal() {
    let totalValue = 0;
    if (this.requestViewData.requestFormTypes === RequestFormTypes.selectDisbursement) {
      this.requestViewData.disbursementGridData.gridData.filter(val => val.data.selectUnSelectVal === ImportGridIsSelectVal.selected)
        .forEach((val) => {
          totalValue += val.data.net + val.data.vat;
        });
      return parseFloat(totalValue.toString()).toFixed(2);
    } else {
      this.requestViewData.timeGridModel.gridData.filter(val => val.data.recordType === ImportGridIsSelectVal.selected)
        .forEach((val) => {
          totalValue += val.data.timShowVal;
        });
      return parseFloat(totalValue.toString()).toFixed(2);
    }
  }
  get unitTotal() {
    let totalValue = 0;
    this.requestViewData.timeGridModel.gridData.filter(val => val.data.recordType === ImportGridIsSelectVal.selected)
      .forEach((val) => {
        totalValue += val.data.timUnits;
      });
    return parseFloat(totalValue.toString()).toFixed(2);
  }
  onExpanButtonClick() {
    this.gridShow = !this.gridShow;
  }
  onClose(event) {
    this.close.emit();
  }
  onOk(formType) {
    let selectedValSum = 0;
    let selectedUnitSum = 0;
    this.requestViewData.timeGridModel.gridData.filter(val => val.data.recordType !== ImportGridIsSelectVal.selected)
      .forEach((val) => {
        selectedValSum += val.data.timShowVal;
        selectedUnitSum += val.data.timUnits;
      });
    if (formType === RequestFormTypes.selectTime) {
      const billingRequestProcessModel: BillingRequestProcessViewModel = {
        billTo: this.billTo,
        vatCode: '', // this.vatCodeSelectedValue.key ? this.vatCodeSelectedValue.key : 0, need to change key and data
        uplift: '0',
        sumOfSelectedUnits: selectedUnitSum,
        sumOfSelectedValues: selectedValSum,
        allocatedTo: this.allocateSelectedValue.key,
        nominal: this.nominalSelectedValue.key,
        nominalCode: this.nominalSelectedValue.value ? +this.nominalSelectedValue.value : null,
        vatId: this.vatCodeSelectedValue.value ? +this.vatCodeSelectedValue.value : 0,
        timFeeEarner: this.matterFeeEarner,
        recordType: RecordTypes.TimeType,
        billingDetails: (this.requestViewData.importAndAddRecordPopupMode === PopupOpenMode.Edit) ?
          this.requestViewData.timeGridModel.gridData.map(val => val.data)
            .filter(data => data.recordType === ImportGridIsSelectVal.unSelected)
          : this.requestViewData.timeGridModel.gridData.map(val => val.data)
            .filter(data => data.recordType !== ImportGridIsSelectVal.unSelected) // neet change ==??
      };
      this.timeOkButtonUpdate.emit(billingRequestProcessModel);
      this.close.emit();
    } else if (formType === RequestFormTypes.selectDisbursement) {
      if (this.requestViewData.disbursementGridData && this.requestViewData.disbursementGridData.gridData.length > 0) {
        this.timeOkButtonUpdate.emit(
          this.requestViewData.disbursementGridData.gridData
            .filter(data => data.data.selectUnSelectVal !== ImportGridIsSelectVal.unSelected)
            .map((item) => ({
              feeEarner: item.data.feeEarner,
              details: item.data.details,
              net: item.data.net,
              vat: item.data.vat,
              vatCode: item.data.vatCode,
              itemDate: item.data.itemDate,
              grossVal: item.data.grossVal,
              recordType: RecordTypes.Disbursment,
              disbursmentItemDetails: item.data // [item.data]
            }))
        );
        this.close.emit();
      }
    }
  }
  onSelectUnselectWriteOff(selectType) {
    this.selectUnselectWriteOffUpdate.emit(selectType);
  }
  setSelectRow(event) {
    this.rowSelected.emit(event);
  }
  rowSelectedValueUpdate(status) {
    this.rowSelectedValUpdate.emit(status);
  }
  onRowClick(event) {
    this.setSelectRow({ row: event.row, isMultiSelect: false, requestFormTypes: this.requestViewData.requestFormTypes });
  }
  onRowDblClick(event) {
    this.setSelectRow({ row: event.row, isMultiSelect: false, requestFormTypes: this.requestViewData.requestFormTypes });
    if (this.requestViewData.requestFormTypes === RequestFormTypes.selectTime && event.row
      && event.row.data && event.row.data.timUniqueRef) {
      this.timeEntryEdit.emit(event.row.data);
    }
  }
  onRowCtrlClick(event) {
    this.setSelectRow({ row: event.row, isMultiSelect: true, requestFormTypes: this.requestViewData.requestFormTypes });
  }
  onRowRightClick(event) {
    if (event && event.row && !event.row.selected) {
      this.setSelectRow({ row: event.row, isMultiSelect: false, requestFormTypes: this.requestViewData.requestFormTypes });
    }
  }
  onSelect() {
    this.rowSelectedValueUpdate({ rowUpdateStatus: RowUpdateStatus.Select, requestFormTypes: this.requestViewData.requestFormTypes });
  }
  onUnselect() {
    this.rowSelectedValueUpdate({ rowUpdateStatus: RowUpdateStatus.Unselect, requestFormTypes: this.requestViewData.requestFormTypes });
  }
  onWriteOff() {
    if (this.requestViewData.requestFormTypes === 'Disbursement') {
      this.showValidationMsg('Cannot WriteOff Disbursement in billing request.');
    } else {
      this.rowSelectedValueUpdate({ rowUpdateStatus: RowUpdateStatus.WriteOff, requestFormTypes: this.requestViewData.requestFormTypes });
    }
  }
  onBillToFocusout(val) {
    this.billTo = val.value;
  }
  onAllocateSelectChange(val) {
    if (val && val.key && val.value) {
      this.allocateSelectedValue = { key: val.key, value: val.value };
      this.allocateSelectChange.emit({ key: val.key, value: val.value });
    }
  }
  onNominalSelectChange(val) {
    if (val && val.key && val.value) {
      this.nominalSelectedValue = { key: val.key, value: val.value }; // value=noM_Account_Ref key=noM_Account_Name
      this.onDropDownChange.emit({ propertyName: DropDownPropertyName.Nominal, selectedValue: this.nominalSelectedValue });
    }
  }
  onVatCodeSelectChange(val) {
    if (val && val.value) {
      this.vatCodeSelectedValue = { key: val.key, value: val.value }; //  key: val.vatRate, value: val.vatCode
    } else {
      this.vatCodeSelectedValue = { key: 0, value: 0 };
    }
  }
  showValidationMsg(errorMsg) {
    if (errorMsg) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Message',
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
