import { Component, OnInit, Input } from '@angular/core';
import { BaseGlobalDocumentSearchManager } from '../../global-document-search-core/containers/base-global-document-search-manager';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MainMenuService } from '../../layout-desktop';
import { GridRowItemWrapper } from '../../core/lib/matter';



@Component({
  selector: 'dps-global-document-search-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class GlobalDocumentSearchManagerComponent extends BaseGlobalDocumentSearchManager implements OnInit {

  @Input() token;
  loginguser;
  user$;

  constructor(store: Store<any>, private pageService: MainMenuService
    , private popupService: SystemJsPopupLoaderService) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.columnDef, this.paginatorDef);
    // this.user$ = this.store.select(getUser);
  }

  onClickGridRow(action) {


    this.viewDocument(this.token, action);

  }
  onAddFilterRow() {

    this.addDocumentFilterRow(this.token);

  }

  onFilterItemChange(event) {

    this.filterItemChange(this.token, event);

  }

  onChangeSearchText(event) {

    this.changeSearchTextValue(this.token, event);
  }


  onSearchDocument(event) {

    this.documentSearch(this.token, event);

  }
  onCloseViewer() {

    this.closeDocumentViewer(this.token);

  }

  onRemoveFilterRow(value) {

    this.removeFilterRow(this.token, value);
  }

  onViewChange(value) {


    this.globalSearchviewChange(this.token, value);

  }

  onDocumentClear(event) {


    this.globalSearchDocumentClear(this.token);

  }

  onRefresh() {
    this.onRefreshGrid(this.token);

  }

  onOpenInPopup(event) {

    this.openInPopup(this.token);

  }
  onShareClick(item) {
    this.share(this.token, item);
  }

  onOpenCaseClick(item) {

    this.openCaseClick(this.token, item);

    //   const matter: GridRowItemWrapper = {
    //     data: {
    //         branchID: selectedMatter.data.branchID,
    //         app_Code: selectedMatter.data.app_Code, fileID: selectedMatter.data.fileID,
    //         matterReferenceNo: selectedMatter.data.matterReferenceNo,
    //         appID: selectedMatter.data.appID ? selectedMatter.data.appID : null,
    //         closed: null,
    //         lastUsed: null,
    //         feeEarner: selectedMatter.data.feeEarner,
    //         reviewDate: null,
    //         clientName: null,
    //         reviewNote: null,
    //         company_Name: null,
    //         matterDetails: selectedMatter.data.matterDetails,
    //         matterCounter: selectedMatter.data.matterCounter,
    //         ufnValue: selectedMatter.data.ufnValue,
    //         eBilling: selectedMatter.data.eBilling,
    //     },
    //     selected: selectedMatter.selected,
    //     expanded: selectedMatter.expanded,
    //     financeDetails: null
    // };
    // this.pageService.gotoOpenCase(matter);

    //  this.pageService.gotoOpenCase(selectedMatter);

  }



}
