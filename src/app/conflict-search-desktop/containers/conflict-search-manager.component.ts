import { Component, OnInit, Input } from '@angular/core';
import { BaseConflictSearchManager } from '../../conflict-search-core/containers/base-conflict-search-manager';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dps-conflict-search-manager',
  template: '<ng-content></ng-content>',
})
export class ConflictSearchManagerComponent extends BaseConflictSearchManager implements OnInit {
  @Input() inputData;
  @Input() token;

  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    console.log('ConflictSearchManagerComponent-ngOnInit');
    super.initSelectors(this.token, this.inputData);
  }



}
