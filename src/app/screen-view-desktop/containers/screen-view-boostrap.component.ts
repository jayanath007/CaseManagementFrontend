import { Component, OnInit } from '@angular/core';
import { BaseScreenViewManager } from '../../screen-view-core/containers';
import { Store } from '@ngrx/store';
import { ScreenViewInitials } from '../../core/lib/screen-view';

@Component({
  selector: 'dps-screen-view-boostrap',
  template: ` `,
  styles: []
})
export class ScreenViewBoostrapComponent extends BaseScreenViewManager implements OnInit {

  constructor(store: Store<any>) {
    super(store);
  }

  inputData: ScreenViewInitials;
  token: string;

  ngOnInit() {
   // alert('ok' + this.token + this.inputData.screenIds.toString());
    super.OnInit(this.token, this.inputData);
  }

}
