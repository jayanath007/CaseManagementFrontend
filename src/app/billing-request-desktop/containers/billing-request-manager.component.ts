import { BaseBillingRequestManager } from './../../billing-request-core/containers/billing-request-manager';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dps-billing-request-manager',
  template: '<ng-content></ng-content>'
})
export class BillingRequestManagerComponent extends BaseBillingRequestManager implements OnInit {

  @Input() inputData: any;
  @Input() billingRequestToken: string;

  @Output() closePopup = new EventEmitter<any>();

  matterData; // temp
  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    if (this.inputData && this.inputData.matterData) {
      super.initSelectors(this.billingRequestToken, this.inputData);
    } else {
      super.initSelectors(this.billingRequestToken, '');
    }
  }
  onClosePopup(info) {
    this.onCloseRequestPopup(this.billingRequestToken, info);
    this.closePopup.emit(info);
  }
  onMatterSearchData(matterData) {
    this.setMatterData(this.billingRequestToken, matterData);
  }
  onOpenDataImportPopup(formType) {
    this.importPopupOpen(this.billingRequestToken, formType);
  }
  onTimeAndCostGridSelectRow(row) {
    this.onTimeAndCostGridSelectRowUpdate(this.billingRequestToken, row);
  }
  onHeaderGridDoubleClick(selectModel) {
    this.onHeaderGridRowDoubleClick(this.billingRequestToken, selectModel);
  }
  onAddDataPopup(input) {
    this.onAddDataPopupOpen(this.billingRequestToken, input);
  }
  onNarrativeItemText(inputText) {
    this.onNarrativeItemTextChange(this.billingRequestToken, inputText);
  }
  onChangeunProforma(check) {
    this.onProformaCheckChange(this.billingRequestToken, check);
  }
  onChangeunBill(check) {
    this.onBillCheckChange(this.billingRequestToken, check);
  }
  onPrintSettingPopupOpen() {
    this.onOpenPrintSettingPopup(this.billingRequestToken);
  }
  onAddToBillClick(model) {
    this.onAddToQuickBillProcess(this.billingRequestToken, model);
  }
  onRemoveAllGridDataByGridType(gridType) {
    this.onRemoveAllGridData(this.billingRequestToken, gridType);
  }
  onUpdateControllerValue(event) {
    this.onUpdateControllerValues(this.billingRequestToken, event);
  }
  onBillingRequestSave(totalsAndbuttonTypeModel) {
    this.onBillingRequestSaveData(this.billingRequestToken, totalsAndbuttonTypeModel);
  }
  onDeleteBillRequest() {
    this.deleteBillRequest(this.billingRequestToken);
  }
}
