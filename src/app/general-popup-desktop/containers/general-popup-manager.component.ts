import { ColumnDef } from './../../core/lib/grid-model';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseGeneralPopupManager } from '../../general-popup-core/containers/base-general-popup-manager';
import { PDFBundleCaseFileIdentityWithAppIdRequestViewModel } from '../../bundling-desktop/containers/bundling-existing-manager.component.component';


@Component({
  selector: 'dps-general-popup-manager',
  template: '<ng-content></ng-content>',
  styles: []
})

export class GeneralPopupManagerComponent extends BaseGeneralPopupManager implements OnInit {
  @Input() token: string;
  @Input() searchText: string;
  @Input() sitePath: any;
  @Input() popupTitle: any;
  @Input() colDefs: ColumnDef[];
  @Input() hideSearchBox: boolean;
  @Input() hidePaginator: boolean;
  @Input() isFrontEndFilter: boolean;
  @Input() request?: PDFBundleCaseFileIdentityWithAppIdRequestViewModel;


  constructor(protected store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.searchText, this.sitePath, this.popupTitle, this.isFrontEndFilter,
      this.colDefs, this.request);
  }

}
