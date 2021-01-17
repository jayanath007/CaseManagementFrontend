import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { getVisibleOutlet } from '../../layout-desktop';
import { BaseSafeBoxExplorerManager } from '../../safe-box-explorer-core';
import { IS_GOOGLE } from '../../shared';


@Component({
  selector: 'dps-safe-box-explorer-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})

export class SafeBoxExplorerManagerComponent extends BaseSafeBoxExplorerManager implements OnInit {

  @Input() token;

  public activeOutlet$: any;

  constructor(store: Store<any>, @Inject(IS_GOOGLE) public isGoogle: boolean) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token);
    this.activeOutlet$ = this.store.select(getVisibleOutlet);
  }

}

