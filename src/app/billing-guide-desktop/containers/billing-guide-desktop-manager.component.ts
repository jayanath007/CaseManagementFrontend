import { BaseBillingGuideManager } from '../../billing-guide-core/containers/base-billing-guide-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';


@Component({
  selector: 'dps-billing-guide-desktop-manager',
  template: '<ng-content></ng-content>',
})
export class BillingGuideDesktopManagerComponent extends BaseBillingGuideManager implements OnInit {
  @Input() inputData;
  @Input() token;

  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }
}
