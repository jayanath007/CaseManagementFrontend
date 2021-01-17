import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseMatterViewByClientManager } from '../../matter-view-by-client-core/containers/base-matter-view-by-client-manager';
import { GridData } from '../../matter-view-by-client-core/models/interface';


@Component({
  selector: 'dps-matter-view-by-client-manager',
  template: '<ng-content></ng-content>',
})
export class MatterViewByClientManagerComponent extends BaseMatterViewByClientManager implements OnInit {

  constructor(store: Store<any>) {
    super(store);
  }
  @Input() token: string;
  @Input() inputData: any;

  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }

  onViewChange(value) {
    this.viewChange(this.token, value);
  }

  onSelectRow(row: GridData): void {
    this.selectRow(this.token, row);
  }

}
