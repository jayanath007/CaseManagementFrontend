import { Component, OnInit, Input } from '@angular/core';
import { BaseScreenViewManager } from '../../screen-view-core/containers';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { UserScreenMediator } from '../../workflow-core';

@Component({
  exportAs: 'screenViewManage',
  selector: 'dps-screen-view-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class ScreenViewManagerComponent extends BaseScreenViewManager implements OnInit {

  constructor(store: Store<any>, private matDialog: MatDialog) {
    super(store);
  }

  @Input() inputData: UserScreenMediator;
  @Input() token;

  ngOnInit() {
     super.onInitScreenViewPopup(this.token);
  }


}
