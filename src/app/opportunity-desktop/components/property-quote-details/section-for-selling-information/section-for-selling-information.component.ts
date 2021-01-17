import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuoteRequest, WebQuoteCost } from '../../../../opportunity-core/models/interfaces';
import { PropertyQuoteRequestKey, LeaseHold } from '../../../../opportunity-core/models/enums';
import { CostItemResolve } from '../cost-item-resolve';

@Component({
  selector: 'dps-section-for-selling-information',
  templateUrl: './section-for-selling-information.component.html',
  styleUrls: ['./section-for-selling-information.component.scss']
})
export class SectionForSellingInformationComponent extends CostItemResolve implements OnInit {


  @Input() propertyQuRequest: PropertyQuoteRequest;
  @Input() cost: WebQuoteCost[];
  @Output() changeProQuoteRequest = new EventEmitter<{ key: PropertyQuoteRequestKey, value: any }>();
  leaseHold = LeaseHold;
  key = PropertyQuoteRequestKey;

  ngOnInit() {

  }
  onChnageProQuoteRequest(key: PropertyQuoteRequestKey, value: any) {
    this.changeProQuoteRequest.emit({ key: key, value: value });
  }

}
