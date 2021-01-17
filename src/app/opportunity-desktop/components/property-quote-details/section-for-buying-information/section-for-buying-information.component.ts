import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LeaseHold, PropertyQuoteRequestKey } from '../../../../opportunity-core/models/enums';
import { PropertyQuoteRequest, WebQuoteCost } from '../../../../opportunity-core/models/interfaces';
import { CostItemResolve } from '../cost-item-resolve';


@Component({
  selector: 'dps-section-for-buying-information',
  templateUrl: './section-for-buying-information.component.html',
  styleUrls: ['./section-for-buying-information.component.scss']
})
export class SectionForBuyingInformationComponent extends CostItemResolve implements OnInit {


  @Input() propertyQuRequest: PropertyQuoteRequest;
  @Input() cost: WebQuoteCost[];
  @Output() changeProQuoteRequest = new EventEmitter<{ key: PropertyQuoteRequestKey, value: any }>();
  leaseHold = LeaseHold;
  key = PropertyQuoteRequestKey;

  ngOnInit() {

  }
  onChnageProQuoteRequest(key: PropertyQuoteRequestKey, value: any) {
    this.changeProQuoteRequest.emit({ key: key, value: value });
    if (key === PropertyQuoteRequestKey.isFirstTimeBuyer && value === true) {
      this.changeProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isSecondProperty, value: false });
      this.changeProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isBuyToLet, value: false });
    } else if ((key === PropertyQuoteRequestKey.isSecondProperty || key === PropertyQuoteRequestKey.isBuyToLet) && value === true) {
      this.changeProQuoteRequest.emit({ key: PropertyQuoteRequestKey.isFirstTimeBuyer, value: false });
    }
  }

}
