import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseEChitManager } from '../../e-chit-core/containers';
import { MainMenuItemResolverService } from '../../layout-desktop';

@Component({
  selector: 'dps-e-chit-desktop-manager',
  template: '<ng-content></ng-content>',
})
export class EChitDesktopManagerComponent extends BaseEChitManager implements OnInit {
  @Input() inputData;
  @Input() token;

  constructor(store: Store<any>, menu: MainMenuItemResolverService) {
    super(store, menu);
  }
  ngOnInit() {
    console.log('EChitDesktopManagerComponent-ngOnInit');
    super.initSelectors(this.token, this.inputData);
  }



}
