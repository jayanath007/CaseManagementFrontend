import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FeeEarnerList, OpportunitySaveViewModel, DropdownList } from './../../../opportunity-core/models/interfaces';
import { MasterDataViewModel, DropdownListItem } from '../../../shared-data/model/interface';

@Component({
  selector: 'dps-opportunity-quote-run-popup',
  templateUrl: './opportunity-quote-run-popup.component.html',
  styleUrls: ['./opportunity-quote-run-popup.component.scss']
})
export class OpportunityQuoteRunPopupComponent implements OnInit, OnChanges {

  @Input() feeEarnerList: FeeEarnerList[];
  @Input() isQuoteRunLoading: boolean;
  @Input() templete: string[];
  @Input() opportunity: OpportunitySaveViewModel;
  @Input() departmentList: MasterDataViewModel<DropdownListItem[]>;
  @Input() workTypeList: DropdownList[];
  @Input() homeCurrency: string;
  @Input() closePopup: number;
  @Output() generateProcess = new EventEmitter<OpportunitySaveViewModel>();
  @Output() quoteRunPopupClose = new EventEmitter<string>();
  opportunityTemp: OpportunitySaveViewModel;
  // quoteAmount = 0;
  // quoteDis: number;
  // otherFees: number;
  constructor() { }

  ngOnInit() {
    this.opportunityTemp = JSON.parse(JSON.stringify(this.opportunity));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.closePopup && !changes.closePopup.isFirstChange() && changes.closePopup.currentValue > 0) {
      setTimeout(() => {
        this.quoteRunPopupClose.emit('success');
      }, 100);
    }
  }
  onClose() {
    this.quoteRunPopupClose.emit('');
  }
  get department() {
    const department = this.departmentList ? this.departmentList.data.find(d => d.key === this.opportunityTemp.departmentId) : null;
    if (department) {
      return department.value;
    }
    return null;
  }
  get selectedFeeEarner() {
    if (this.feeEarnerList) {
      return this.feeEarnerList.find((f) => f.key === this.opportunityTemp.feeEarner);
    }
    return null;
  }
  get selectedTemplate() {
    if (this.templete) {
      return this.templete.find(t => t === this.opportunityTemp.templete);
    }
    return null;
  }
  onChangeFeeEarner(feeEarnerItem: FeeEarnerList) {
    this.opportunityTemp.feeEarner = feeEarnerItem.key;
  }
  onChangeTemplate(templete: string) {
    this.opportunityTemp.templete = templete;
  }
  onChangeAmount(amount) {
    this.opportunityTemp.amount = amount;
  }
  onChangeQuoteDis(amount) {
    this.opportunityTemp.quoteDis = amount;
  }
  onChangeOtherFees(amount) {
    this.opportunityTemp.otherFees = amount;
  }
  onGenerate() {
    this.generateProcess.emit(this.opportunityTemp);
  }
}
