
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { BaseScreenDesingnerManager } from '../../screen-desingner-core/containers/base-screen-desingner-manager';


@Component({
  exportAs: 'screenDesingnerManage',
  selector: 'dps-screen-desingner-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class ScreenDesingnerManagerComponent extends BaseScreenDesingnerManager implements OnInit {

  constructor(store: Store<any>, private matDialog: MatDialog) {
    super(store);
  }

  @Input()
  inputData;

  @Input()
  ovItemToken: string;

  @Input() token;

  ngOnInit() {
    super.onInitScreenDesingnerPopup(this.token, this.inputData);
  }

}
