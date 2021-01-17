import { BaseBillingNarrativeManager } from './../../billing-narrative-core/containers/billing-narrative-manager';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dps-billing-narrative-manager',
  template: '<ng-content></ng-content>'
})
export class BillingNarrativeManagerComponent extends BaseBillingNarrativeManager implements OnInit {
  @Input() inputData: string;
  @Input() narrativeToken: string;

  @Output() closePopup = new EventEmitter<any>();

  constructor(store: Store<any>) {
    super(store);
  }

  // public getOpportunity$: any;

  ngOnInit() {
    super.initSelectors(this.narrativeToken, this.inputData);

  }
  onClosePopup(info) {
    this.closePopup.emit(info);
  }

  onSelectClose(closeData) {

    this.closePopup.emit(closeData);

  }


}
