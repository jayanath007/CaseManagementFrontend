
import { BaseAdvancedSearchManager } from '../../advanced-search-core/containers/base-advanced-search-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MainMenuService } from '../../layout-desktop';




@Component({
  selector: 'dps-advanced-search-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class AdvancedSearchManagerComponent extends BaseAdvancedSearchManager implements OnInit {

  @Input() token;

  constructor(store: Store<any>, pageService: MainMenuService) {
    super(store, pageService);

  }
  ngOnInit() {
    super.initSelectors(this.token, this.paginatorDef);
    // this.user$ = this.store.select(getUser);
  }




  // onClickGridRow(action) {


  //   this.viewDocument(this.token, action);

  // }
  // onAddFilterRow() {

  //   this.addDocumentFilterRow(this.token);

  // }

  // onFilterItemChange(event) {

  //   this.filterItemChange(this.token, event);

  // }

  // onChangeSearchText(event) {

  //   this.changeSearchTextValue(this.token, event);
  // }


  // onSearchDocument(event) {

  //   this.documentSearch(this.token, event);

  // }
  // onCloseViewer() {

  //   this.closeDocumentViewer(this.token);

  // }

  // onRemoveFilterRow(value) {

  //   this.removeFilterRow(this.token, value);
  // }

  // onViewChange(value) {


  //   this.globalSearchviewChange(this.token, value);

  // }

  // onDocumentClear(event) {


  //   this.globalSearchDocumentClear(this.token);

  // }

  // onRefresh() {
  //   this.onRefreshGrid(this.token);

  // }

  // onOpenInPopup(event) {

  //   this.openInPopup(this.token);

  // }
  // onShareClick(item){
  //   this.share(this.token,item);
  // }

  // onOpenCaseClick(item) {

  //   this.openCaseClick(this.token,item);

  // }



}
