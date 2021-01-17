import { DifferentFirstPage, DifferentPageHeaderFooter } from './../actions/core';
import {
  getPageSetupLoadingByToken, getPageSetupDataByToken, getPopupCloseByToken,
  getfirstPageByToken, getDifferentPageHeaderFooterByToken
} from './../reducers/index';

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';


import { InitPageSetup, SetChangePagesetupValue, SaveSetupChanges } from '../actions/core';

@Component({
  selector: 'dps-page-setup-manager',
  template: '<ng-content></ng-content>'
})
export class PageSetupManagerComponent implements OnInit {

  @Input() inputData: string;
  @Input() pageSetupToken: string;

  @Output() closePopup = new EventEmitter<any>();

  public PageSetupLoading$: any;
  public PageSetupData$: any;
  public PopupClose$: any;
  public DifferentPage$: any;
  public isDifferentPageHeaderFooter$: any;

  constructor(protected store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new InitPageSetup(this.pageSetupToken, { inputData: '' }));

    this.PageSetupLoading$ = this.store.select(getPageSetupLoadingByToken(this.pageSetupToken));
    this.PageSetupData$ = this.store.select(getPageSetupDataByToken(this.pageSetupToken));
    this.PopupClose$ = this.store.select(getPopupCloseByToken(this.pageSetupToken));
    this.DifferentPage$ = this.store.select(getfirstPageByToken(this.pageSetupToken));
    this.isDifferentPageHeaderFooter$ = this.store.select(getDifferentPageHeaderFooterByToken(this.pageSetupToken));
  }
  onChangePageSetupValue(changeValue) {
    this.store.dispatch(new SetChangePagesetupValue(this.pageSetupToken, changeValue));
  }
  onSaveChanges() {
    this.store.dispatch(new SaveSetupChanges(this.pageSetupToken));
  }
  onDifferentFirstPage(defferentFirstPage) {
    this.store.dispatch(new DifferentFirstPage(this.pageSetupToken, defferentFirstPage));
  }
  onDifferentPageHeaderFooter(defferentPageHeaderFooter) {
    this.store.dispatch(new DifferentPageHeaderFooter(this.pageSetupToken, defferentPageHeaderFooter));
  }
}
