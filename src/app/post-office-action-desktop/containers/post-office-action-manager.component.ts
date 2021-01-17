import { BasePostOfficeActionManager } from './../../post-office-action-core/containers/base-post-office-action-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';

@Component({
  selector: 'dps-post-office-action-manager',
  template: '<ng-content></ng-content>',
})
export class PostOfficeActionManagerComponent extends BasePostOfficeActionManager implements OnInit {
  @Input() inputData;
  @Input() token;


  constructor(store: Store<any>, public popupService: SystemJsPopupLoaderService) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }



}
