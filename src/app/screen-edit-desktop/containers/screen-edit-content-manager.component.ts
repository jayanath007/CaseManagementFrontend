import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseScreenEditManager } from '../../screen-edit-core/containers/base-screen-edit-manager';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { Store } from '@ngrx/store';
import { ScreenEditCloseInfo } from '../../screen-edit-core/models/enum';

@Component({
  selector: 'dps-screen-edit-content-manager',
  template: '<ng-content></ng-content>',

})
export class ScreenEditContentManagerComponent extends BaseScreenEditManager implements OnInit {
  @Input() type;
  @Input() token;
  @Output() close = new EventEmitter();

  columnDef: any;
  lookupDataModel: any;

  constructor(store: Store<any>) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.type);
  }

  onClose(event) {
    this.screenEditClose();
    this.close.emit(event);
  }

  onSubmit(event) {
    this.updateControlList(event);
  }
}
