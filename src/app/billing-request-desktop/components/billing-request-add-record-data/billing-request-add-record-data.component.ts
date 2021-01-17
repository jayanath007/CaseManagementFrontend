import { InforDialogComponent } from './../../../shared/components/infor-dialog/infor-dialog.component';
import { InforDialogData } from './../../../shared/models/dialog';
import {
  RequestFormTypes, RecordTypes, PopupOpenMode, DropDownPropertyName,
  ImportGridIsSelectVal
} from './../../../billing-request-core/models/enums';
import { TableColumn } from './../../../shared/models/interface';
import {
  DpsSelectModel, FeeEarner, VatCode, DescriptionList,
  BillingRequestTimeProfitHeaderResponseModel,
  ValidationInfo,
  BillingRequestRequiredField,
  BillingRequestDisbursExpenseHeaderViewModel,
} from './../../../billing-request-core/models/interfaces';
import { BillingRequestState } from './../../../billing-request-core/reducers/billing-request';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-billing-request-add-record-data',
  templateUrl: './billing-request-add-record-data.component.html',
  styleUrls: ['./billing-request-add-record-data.component.scss']
})
export class BillingRequestAddRecordDataComponent implements OnInit, OnChanges {

  @Input() requestViewData: BillingRequestState;
  @Input() feeEarnerList: DpsSelectModel<FeeEarner>[];
  @Input() vatCodeList: DpsSelectModel<VatCode>[];
  @Input() descriptionList: DpsSelectModel<DescriptionList>[];
  @Input() userNominalCode: string;
  @Input() timeOffset: number;

  @Output() close = new EventEmitter<any>();
  @Output() profitCostOkButtonUpdate = new EventEmitter<any>();
  @Output() billingRequestDeleteRow = new EventEmitter<any>();
  @Output() billingRequestEditRow = new EventEmitter<any>();
  @Output() onDropDownChange = new EventEmitter<any>();

  cmbfeeEarnerColumns: TableColumn[];
  cmbNominalColumns: TableColumn[];
  cmbVatCodeColumns: TableColumn[];
  cmbDescriptionColumns: TableColumn[];

  popupMode = PopupOpenMode;

  feeEarnerSelectedValue = { key: null, value: null };
  descriptionSelectedValue = { key: null, value: null };
  vatCodeSelectedValue = { key: null, value: null };
  nominalSelectedValue = { key: null, value: null };

  vatRate = 0;
  isEdit = false;
  matterRef;
  matterFeeEarner;
  details;
  netVal;
  vatVal;
  grossVal;
  selectedRowId;
  itemDate;
  selectedRow;

  constructor(private dialog: MatDialog) { }
  ngOnInit() {
    if (this.requestViewData.importAndAddRecordPopupMode === PopupOpenMode.Edit) {
      this.netVal = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.netValue)
        ? this.requestViewData.popupEditDataMode.netValue : 0.00;
      this.vatCodeSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.vatCode)
        ? { key: this.requestViewData.popupEditDataMode.vatCode, value: null } : { key: 1, value: 1 };
      this.nominalSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.nominalVal)
        ? { key: this.requestViewData.popupEditDataMode.nominalVal, value: null } : { key: null, value: null };
      this.vatVal = this.requestViewData.popupEditDataMode ? this.requestViewData.popupEditDataMode.vatValue : 0.00;
      this.grossVal = (this.netVal + this.vatVal);
      // this.grossVal = parseFloat(parseFloat(this.grossVal).toFixed(2));
      this.descriptionSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.details)
        ? { key: this.requestViewData.popupEditDataMode.details, value: this.requestViewData.popupEditDataMode.details }
        : { key: null, value: null };
      this.feeEarnerSelectedValue = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.feeEarner)
        ? { key: this.requestViewData.popupEditDataMode.feeEarner, value: null } : { key: null, value: null };
      this.selectedRowId = this.requestViewData.popupEditDataMode ? this.requestViewData.popupEditDataMode.selectedRowId : null;
      this.itemDate = (this.requestViewData.popupEditDataMode && this.requestViewData.popupEditDataMode.itemDate)
        ? this.requestViewData.popupEditDataMode.itemDate : dpsNewDate(this.timeOffset).toDpsString();
      this.selectedRow = this.requestViewData.popupEditDataMode.selectedRow;

      this.netVal = this.netVal.toFixed(2);
      this.vatVal = this.vatVal.toFixed(2);
      this.grossVal = this.grossVal.toFixed(2);
    } else {
      this.netVal = 0.00;
      this.vatVal = 0.00;
      this.grossVal = 0.00;
      this.selectedRowId = null;
      this.vatCodeSelectedValue = { key: 1, value: 1 };
      if (this.requestViewData.requestFormTypes === RequestFormTypes.profitCost) {
        this.descriptionSelectedValue = { key: 'PROFIT COST', value: 'PROFIT COST' };
      } else {
        this.descriptionSelectedValue = { key: 'EXPENSE', value: 'EXPENSE' };
      }
      if (this.requestViewData && this.requestViewData.matterData) {
        this.matterRef = this.requestViewData.matterData.matterRef;
        this.matterFeeEarner = this.requestViewData.matterData.feeEarner;
        this.feeEarnerSelectedValue = { key: this.matterFeeEarner, value: this.matterFeeEarner };
      }
      this.nominalSelectedValue = (this.requestViewData && this.requestViewData.userNominalCode)
        ? { key: this.requestViewData.userNominalCode, value: null } : { key: null, value: null };
    }
    this.cmbfeeEarnerColumns = [
      { name: 'Code', propertyName: 'key', width: '30%' },
      { name: 'Name', propertyName: 'value', width: '70%' }
    ];
    this.cmbNominalColumns = [
      { name: 'Code', propertyName: 'noM_Account_Ref', width: '30%' },
      { name: 'Description', propertyName: 'noM_Account_Name', width: '70%' },
    ];
    this.cmbVatCodeColumns = [
      { name: 'Code', propertyName: 'vatCode', width: '20%' },
      { name: 'Description', propertyName: 'vatDescription', width: '60%' },
      { name: 'Rate', propertyName: 'vatRate', width: '20%' },
    ];
    this.cmbDescriptionColumns = [
      { name: 'Details', propertyName: 'sC_Desc', width: '100%' },
    ];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.userNominalCode) {
      if (this.userNominalCode) {
        this.nominalSelectedValue = { key: this.userNominalCode, value: null };
      } else {
        this.nominalSelectedValue = { key: null, value: null };
      }
    }
  }
  onClose(event) {
    this.close.emit();
  }
  getVatRate(vatCode) {
    if (this.vatCodeList && this.vatCodeList.length > 0) {
      // tslint:disable-next-line: triple-equals
      const rateItem = this.vatCodeList.filter(item => item.data.vatCode == vatCode);
      if (rateItem && rateItem.length > 0) {
        return rateItem[0].data.vatRate;
      }
    }
    return 0;
  }
  PopulateGrossAndVat() { // vat calculation
    this.netVal = +this.netVal;
    this.grossVal = (+this.netVal * (1 + (+ this.getVatRate(this.vatCodeSelectedValue.key) / 100)));
    this.vatVal = (+this.grossVal - +this.netVal);
    this.netVal = this.netVal.toFixed(2);
    this.vatVal = this.vatVal.toFixed(2);
    this.grossVal = this.grossVal.toFixed(2);
  }
  onNetFocusout(net) {
    this.netVal = net.value ? +net.value : 0.00;
    this.PopulateGrossAndVat();
  }
  onVatFocusout(vat) {
    this.vatVal = vat.value;
  }
  onGrossFocusout(gross) {
    this.grossVal = gross.value; // parseFloat(parseFloat(gross.value).toFixed(2));
    this.PopulateGrossAndVat();
  }
  onDelete(formType) {
    this.billingRequestDeleteRow.emit({ formType: formType, rowId: this.selectedRowId });
    this.close.emit();
  }
  onAddEdit(formType) {
    const requiredFieldValue: BillingRequestRequiredField = {
      feeEarnerSelectedValue: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
        this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
      descriptionSelectedValue: this.descriptionSelectedValue,
      vatCodeSelectedValue: this.vatCodeSelectedValue,
      nominalSelectedValue: this.nominalSelectedValue,
      netVal: this.netVal,
      vatVal: this.vatVal,
      grossVal: this.grossVal
    };
    const validInformation: ValidationInfo = this.dataValidation(requiredFieldValue, formType);
    if (validInformation.status) {
      if (formType === RequestFormTypes.profitCost) {
        const billingRequestHeaderDataRow: BillingRequestTimeProfitHeaderResponseModel[] = [{
          billFeeEarner: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
            this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
          feeEarner: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
            this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
          details: this.descriptionSelectedValue.key,
          itemNo: -1,
          mpu: null,
          net: parseFloat(parseFloat(this.netVal).toFixed(2)),
          nominal: this.nominalSelectedValue.key,
          notes: '',
          oNet: 0,
          oVat: 0,
          grossVal: this.grossVal,
          recordType: '',
          timTType: RecordTypes.ProfitCost,
          uniqueRef: '',
          units: null,
          urn: '',
          vat: parseFloat(parseFloat(this.vatVal).toFixed(2)),
          vatCode: this.vatCodeSelectedValue ? this.vatCodeSelectedValue.key : '',
          billingDetails: [{
            timMatterRef: this.matterRef ? this.matterRef : '',
            timUniqueRef: -1, // Rrequested suren -1
            timFeeEarner: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
              this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
            timDate: null,
            timUnits: null,
            timDetails: this.descriptionSelectedValue.key,
            timBilled: null,
            timRate: null,
            timVal: parseFloat(parseFloat(this.netVal).toFixed(2)),
            timShowVal: null,
            timTsURN: null,
            salVatCode: '',
            timTType: RecordTypes.ProfitCost,
            timInBill: null, // boolean
            timNotes: '',
            timMPU: null,
            timInBillrequest: null, // boolean
            timUNposted: null,
            uplift: null,
            timVat: parseFloat(parseFloat(this.vatVal).toFixed(2)),
            timBillEarner: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
              this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
            nominalCode: this.nominalSelectedValue.key ? +this.nominalSelectedValue.key : 0,
            nominal: this.nominalSelectedValue.key ? this.nominalSelectedValue.key : '',
            recordType: ImportGridIsSelectVal.selected
          }]
        }];
        const headerGridDataModel = {
          popupType: formType,
          dataModel: billingRequestHeaderDataRow,
          rowId: this.selectedRowId
        };
        if (this.requestViewData.importAndAddRecordPopupMode === PopupOpenMode.Edit) {
          this.billingRequestEditRow.emit(headerGridDataModel);
          this.onClose('');
        } else {
          this.profitCostOkButtonUpdate.emit(headerGridDataModel);
          this.onClose('');
        }
      } else if (formType === RequestFormTypes.expense) {
        const billingRequestDisbursExpenseModel: BillingRequestDisbursExpenseHeaderViewModel[] = [{
          feeEarner: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
            this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
          details: this.descriptionSelectedValue.key,
          net: parseFloat(parseFloat(this.netVal).toFixed(2)),
          vat: parseFloat(parseFloat(this.vatVal).toFixed(2)),
          vatCode: this.vatCodeSelectedValue ? this.vatCodeSelectedValue.key : '',
          nominal: this.nominalSelectedValue.key,
          itemDate: null,
          grossVal: this.grossVal,
          recordType: RecordTypes.Expense,
          disbursmentItemDetails: {
            feeEarner: (this.feeEarnerSelectedValue && this.feeEarnerSelectedValue.key) ?
              this.feeEarnerSelectedValue.key : this.matterFeeEarner ? this.matterFeeEarner : '',
            details: this.descriptionSelectedValue.key,
            net: parseFloat(parseFloat(this.netVal).toFixed(2)),
            vat: parseFloat(parseFloat(this.vatVal).toFixed(2)),
            nominal: this.nominalSelectedValue.key,
            itemDate: dpsNewDate(this.timeOffset).toDpsString(),
            uniqueRef: null,
            purRef: null,
            purAccountRef: null,
            recordType: RecordTypes.Expense,
            purUniqueRef: null,
            purBankCode: null,
            purInBillRequest: false, // check
            urN: 0,
            purPaid: 0, // check
            purInBill: false, // check
            vatCode: this.vatCodeSelectedValue ? this.vatCodeSelectedValue.key : '',
            onet: 0,
            ovat: 0,
            pdsb: 0,
            itemNo: -1,
            grossVal: this.grossVal,
            selectUnSelectVal: ''
          }
        }];
        const headerGridDataModel = {
          popupType: formType,
          dataModel: billingRequestDisbursExpenseModel,
          rowId: this.selectedRowId
        };
        if (this.requestViewData.importAndAddRecordPopupMode === PopupOpenMode.Edit) {
          this.billingRequestEditRow.emit(headerGridDataModel);
          this.onClose('');
        } else {
          this.profitCostOkButtonUpdate.emit(headerGridDataModel);
          this.close.emit();
        }
      } else if (formType === RequestFormTypes.selectDisbursement) {
        const disbursementModel = {
          vatCode: this.vatCodeSelectedValue ? this.vatCodeSelectedValue.key : '',
          vat: this.vatVal,
          grossVal: this.grossVal,
        };
        const headerGridDataModel = {
          popupType: formType,
          dataModel: disbursementModel,
          rowId: this.selectedRowId
        };
        if (this.requestViewData.importAndAddRecordPopupMode === PopupOpenMode.Edit) {
          this.billingRequestEditRow.emit(headerGridDataModel);
          this.onClose('');
        }
      }
    } else {
      this.showValidationMsg(validInformation.msg);
    }
  }
  onfeeEarnerSelectChange(val) {
    if (val && val.key && val.value) {
      this.feeEarnerSelectedValue = { key: val.key, value: val.value };
      this.onDropDownChange.emit({ propertyName: DropDownPropertyName.FeeEarner, selectedValue: this.feeEarnerSelectedValue });
    }
  }
  onDescriptionSelectChange(val) {
    if (val && val.value) {
      this.descriptionSelectedValue = { key: val.value, value: val.value };
    }
  }
  onNominalSelectChange(val) {
    if (val) {
      this.nominalSelectedValue = { key: val.key, value: val.value };
    }
  }
  onVatCodeSelectChange(val) {
    if (val) {
      this.vatCodeSelectedValue = { key: val.key, value: val.value };
      this.PopulateGrossAndVat();
    }
    //  else {
    //   this.vatCodeSelectedValue = { key: 0, value: 0 };
    //   this.PopulateGrossAndVat();
    // }
  }
  dataValidation(requiredField: BillingRequestRequiredField, formType: RequestFormTypes) {
    let validInformation: ValidationInfo;
    validInformation = {
      msg: 'Information is valid',
      status: true
    };
    if (!requiredField.descriptionSelectedValue.key) {
      validInformation = {
        msg: 'Please enter some details.',
        status: false
      };
    } else if (formType !== RequestFormTypes.selectDisbursement && !requiredField.nominalSelectedValue.key) {
      validInformation = {
        msg: 'Please select a nominal.',
        status: false
      };
    } else if (!requiredField.netVal) {
      validInformation = {
        msg: 'Please enter a net amount.',
        status: false
      };
    } else if (!requiredField.vatVal) {
      validInformation = {
        msg: 'Please enter a VAT amount.',
        status: false
      };
    } else if (!requiredField.grossVal) {
      validInformation = {
        msg: 'Please enter a gross amount.',
        status: false
      };
    }
    return validInformation;
    //  else if (!requiredField.feeEarnerSelectedValue.key) {
    //   validInformation = {
    //     msg: 'Please select a fee earner.',
    //     status: false
    //   };
    // }
    // else if (!requiredField.vatCodeSelectedValue.key) {
    //   validInformation = {
    //     msg: 'Please select a vat code.',
    //     status: false
    //   };
    // }
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
