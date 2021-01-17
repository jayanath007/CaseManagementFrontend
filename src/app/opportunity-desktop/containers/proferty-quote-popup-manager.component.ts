import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { BaseOpportunityManager } from './../../opportunity-core/containers/base-opportunity-manager';
import { PropertyQuoteRequestKey } from '../../opportunity-core/models/enums';
import { OpportunitySaveViewModel, PropertyQuReportview } from './../../opportunity-core/models/interfaces';

@Component({
  selector: 'dps-proferty-quote-popup-manager',
  template: `<dps-property-quote-layout 
              [isLoading]="isLoading$|async"
              [propertyQuoteType]="propertyQuoteType$|async"
              [propertyQuRequest]="propertyQuRequest$|async"
              [currency]="(homeCurrency$|async)|currencySymbols"
              [webQuoteData]="webQuoteData$|async"
              [selectedStep]="propertyQuStep$|async"
              [propertyQuReport]="propertyQuReport$|async"
              [closePopup]="closePopup$|async"
              [isEditQuote]="data.isEditQuote"
              [webQuoteCompany]="webQuoteCompany$|async"
              (chnageProQuoteRequest)="changeProQuoteRequest($event, data.isEditQuote)"
              (requestReport)="onRequestReport(data.isEditQuote)"
              (chnageSelectedStep)="onChangeProfertQuSelectedStep($event)"
              (sendQuote)="onSendQuote($event)"
              (changeReportData)="onChangeReport($event)"
              (close)="onClose()"
              >

            </dps-property-quote-layout>`
})
export class ProfertyQuotePopupManagerComponent extends BaseOpportunityManager implements OnInit {
  constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA)
  public data: { token: string, opportunity: OpportunitySaveViewModel, isEditQuote: boolean },
    public dialogRef: MatDialogRef<ProfertyQuotePopupManagerComponent>) {
    super(store);
  }


  ngOnInit() {
    this.initPropertyQuote(this.data.token, this.data.isEditQuote);
  }

  changeProQuoteRequest(item: { key: PropertyQuoteRequestKey, value: any }, isEditQuote: boolean) {
    this.onChangeProQuoteRequest(this.data.token, item, isEditQuote);
  }
  onRequestReport(isEdit: boolean) {
    this.requestReport(this.data.token, isEdit);
  }
  onChangeProfertQuSelectedStep(index: number) {
    this.changeProfertQuSelectedStep(this.data.token, index);
  }
  onSendQuote(reportContent: string) {
    this.sendPropertyQuote(this.data.token, reportContent, this.data.opportunity);
  }
  onChangeReport(data: { newReport: PropertyQuReportview, type: string }) {
    this.changeReportData(this.data.token, data);
  }
  onClose() {
    this.dialogRef.close();
  }

}
