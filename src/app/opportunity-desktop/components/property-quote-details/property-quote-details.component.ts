import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuoteRequest, PropertyQuoteType, WebQuoteData } from '../../../opportunity-core/models/interfaces';
import { PropertyQuoteRequestKey } from '../../../opportunity-core/models/enums';
import { LeaseHold } from './../../../opportunity-core/models/enums';

@Component({
  selector: 'dps-property-quote-details',
  templateUrl: './property-quote-details.component.html',
  styleUrls: ['./property-quote-details.component.scss']
})
export class PropertyQuoteDetailsComponent implements OnInit {

  @Input() propertyQuRequest: PropertyQuoteRequest;
  @Input() currency: string;
  @Input() selectedQuoteType: PropertyQuoteType;
  @Input() webQuoteData: WebQuoteData;
  @Input() isLoading: boolean;
  @Input() useBranch: boolean;
  @Output() chnageProQuoteRequest = new EventEmitter<{ key: PropertyQuoteRequestKey, value: any }>();
  @Output() next = new EventEmitter();

  leaseHold = LeaseHold;
  key = PropertyQuoteRequestKey;
  constructor() { }


  ngOnInit() {
  }

  onChnageProQuoteRequest(key: PropertyQuoteRequestKey, value: any) {
    if (key === PropertyQuoteRequestKey.branchId) {
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.sellShare, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.buyShare, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.martgage, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isNewBuild, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isBuyToLet, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isRightToBuy, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isFirstTimeBuyer, value: false });
      this.chnageProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isSecondProperty, value: false });
    }
    this.chnageProQuoteRequest.emit({ key: key, value: value });
  }
  clickOnNext() {
    this.next.emit();
  }
  getValueHeaderForHIP(): string {
    switch (this.propertyQuRequest[PropertyQuoteRequestKey.appId]) {
      case 'e': return 'Value of property to release Equity';
      case 'r': return 'Value of property being remortgaged';
      case 't': return 'Value of property for transfer of equity';
      default: return 'Value';
    }
  }
  get selectedBranch() {
    if (!!this.webQuoteData && !!this.webQuoteData.branch && this.propertyQuRequest[this.key.branchId]) {
      return this.webQuoteData.branch.find(i => i.branchId.toString() === this.propertyQuRequest[this.key.branchId].toString());
    }
    return null;
  }
  get selectedLas() {
    if (!!this.webQuoteData && !!this.webQuoteData.loclAuth && this.propertyQuRequest[this.key.lasId]) {
      return this.webQuoteData.loclAuth.find(i => i.localSearchRateId.toString() === this.propertyQuRequest[this.key.lasId].toString());
    }
    return null;
  }
}
