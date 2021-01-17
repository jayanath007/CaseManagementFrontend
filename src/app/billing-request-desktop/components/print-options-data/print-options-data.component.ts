import { AddressType, AddewssChangeView } from './../../../billing-request-core/models/enums';
import { PrintAllDropDownData, BillingAddressResponceModel } from './../../../billing-request-core/models/interfaces';
import { BillingRequestState } from './../../../billing-request-core/reducers/billing-request';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'dps-print-options-data',
  templateUrl: './print-options-data.component.html',
  styleUrls: ['./print-options-data.component.scss']
})
export class PrintOptionsDataComponent implements OnInit, OnChanges {

  @Input() requestViewData: BillingRequestState;
  @Input() printAllDropDownData: PrintAllDropDownData;

  @Output() close = new EventEmitter<any>();
  @Output() printSaveAddress = new EventEmitter<any>();
  @Output() printMakeDefaultAllBill = new EventEmitter<any>();
  @Output() updatePrintControllersValue = new EventEmitter<any>();
  @Output() billingAddressTypeChange = new EventEmitter<any>();
  @Output() saveAddress = new EventEmitter<any>();

  bilingAddressType = AddressType;
  addewssChangeView = AddewssChangeView;

  disableShowFESubTotals: boolean;
  disableShowPreviousDPB: boolean;

  printLayOutDropDownColumns = [
    { name: 'ID', propertyName: 'userRepID', width: '30%' },
    { name: 'Name', propertyName: 'userRepName', width: '30%' },
    { name: 'Location', propertyName: 'userRepLocation', width: '70%' }
  ];

  addresType: AddressType;
  addressBillingAddr1: string;
  addressBillingAddr2: string;
  addressBillingAddr3: string;
  addressBillingAddr4: string;
  addressBillingPostcode: string;

  isDurty: boolean;
  constructor() { }
  ngOnInit() {

    this.setAddressData();

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestViewData && !changes.requestViewData.isFirstChange()) {
      this.setAddressData();
    }

  }

  setAddressData() {
    if (this.requestViewData.selectedprintSettingAddress) {
      this.addresType = this.requestViewData.selectedprintSettingAddress.addresType;
      this.addressBillingAddr1 = this.requestViewData.selectedprintSettingAddress.addressBillingAddr1;
      this.addressBillingAddr2 = this.requestViewData.selectedprintSettingAddress.addressBillingAddr2;
      this.addressBillingPostcode = this.requestViewData.selectedprintSettingAddress.addressBillingPostcode;
      this.addressBillingAddr3 = this.requestViewData.selectedprintSettingAddress.addressBillingAddr3;
      this.addressBillingAddr4 = this.requestViewData.selectedprintSettingAddress.addressBillingAddr4;
    }


  }
  onClose() {
    this.close.emit();
  }
  onPrintSaveAddress() {
    const selectedModel: BillingAddressResponceModel = {
      addresType: this.addresType,
      addressBillingAddr1: this.addressBillingAddr1,
      addressBillingAddr2: this.addressBillingAddr2,
      addressBillingAddr3: this.addressBillingAddr3,
      addressBillingAddr4: this.addressBillingAddr4,
      addressBillingPostcode: this.addressBillingPostcode,
    };
    this.printSaveAddress.emit(selectedModel);
  }
  onMakeDefaultForAll(event) {
    this.isDurty = false;
    // if (this.requestViewData.printSettingModel) {
    this.printMakeDefaultAllBill.emit();
    // }
  }
  onDropDownValueChange(statePropertyName, selectModel) {
    if (selectModel && selectModel.data) {
      this.updatePrintControllersValue.emit({ key: statePropertyName, value: selectModel.data });
    }
  }
  onCheckBoxValueChange(statePropertyName, selectModel) {
    this.isDurty = true;
    if (statePropertyName === 'chkGroupTimeReportByFeeEarner' && !selectModel) {
      this.disableShowFESubTotals = true;
    } else if (statePropertyName === 'chkGroupTimeReportByFeeEarner' && selectModel) {
      this.disableShowFESubTotals = false;
    }

    if (statePropertyName === 'chkShowDisbBreakdown' && !selectModel) {
      this.disableShowPreviousDPB = true;
    } else if (statePropertyName === 'chkShowDisbBreakdown' && selectModel) {
      this.disableShowPreviousDPB = false;
    }
    this.updatePrintControllersValue.emit({ key: statePropertyName, value: selectModel });
  }
  onBillingAddressTypeChange(value) {
    this.billingAddressTypeChange.emit(value);
  }
}


