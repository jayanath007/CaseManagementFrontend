import {
  ClientSearchResultViewModel, OpportunityGridDataViewModel,
  OpportunitySaveViewModel,
  OppertunityHistory
} from './../../opportunity-core/models/interfaces';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
// import { SystemJsPopupLoaderService } from 'src/app/shell-desktop';
import { MatDialog } from '@angular/material';
import { BaseOpportunityManager } from '../../opportunity-core/containers/base-opportunity-manager';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import { MatterCategoryWithhAppInfo } from '../../shared-data/model/interface';

@Component({
  selector: 'dps-opportunity-manager',
  template: '<ng-content></ng-content>'
})
export class OpportunityManagerComponent extends BaseOpportunityManager implements OnInit {

  @Input() opportunityToken;
  @Input() isPopup?: boolean;
  @Input() oppertunityId?: number;

  constructor(store: Store<any>, private popupService: SystemJsPopupLoaderService, private router: ActivatedRoute,
    private dialog: MatDialog) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.opportunityToken, this.isPopup, this.oppertunityId);
  }
  onChangeFeeEarner(item) {
    this.onFeeEarnerChange(this.opportunityToken, item);
  }
  onChangeIntroducer(item) {
    this.onIntroducerChange(this.opportunityToken, item);
  }
  onChangeDepartment(id: number) {
    this.onDepartmetChange(this.opportunityToken, id);
  }
  onChangeWorkType(item: MatterCategoryWithhAppInfo) {
    this.onWorkTypeChange(this.opportunityToken, item);
  }
  onChangeStatusList(item) {
    this.onStatusChange(this.opportunityToken, item);
  }
  onRefreshData() {
    this.onRefreshGridData(this.opportunityToken);
  }
  onInputChangeData(event) {
    this.onInputDataChange(this.opportunityToken, event);
  }
  onClientSearch(clientDataModel: ClientSearchResultViewModel) {
    this.onClientSearchData(this.opportunityToken, clientDataModel);
  }
  onChangeSelectedTab(tabIndex: number) {
    this.onChangeSelectedTabIndex(this.opportunityToken, tabIndex);
  }
  onClearInputData() {
    this.onClearInputOpportunity(this.opportunityToken);
  }
  onSendAndSaveData() {
    this.onSendAndSaveOpportunity(this.opportunityToken);
  }
  onSendAndQuote() {
    this.sendAndQuoteOpportunity(this.opportunityToken);
  }
  onCloseOpportunitty(selectedItem: OpportunitySaveViewModel) {
    this.closeOpportunity(this.opportunityToken, selectedItem);
  }
  onConflictRun(item: OpportunitySaveViewModel) {
    this.conflictRun(this.opportunityToken, item);
  }
  onQouteRun(info: { data: OpportunitySaveViewModel, isEdit: boolean }) {
    this.qouteRun(this.opportunityToken, info);
  }
  onCreateCaseFile(item: OpportunitySaveViewModel) {
    this.createCaseFile(this.opportunityToken, item);
  }
  onOpenLogFile(history: OppertunityHistory) {
    this.openLogFile(this.opportunityToken, history);
  }
  onChangePage(paginatorDef: PaginatorDef) {
    this.changePage(this.opportunityToken, paginatorDef);
  }
  onToggleSorting(columDef: ColumnDef) {
    this.ToggleSorting(this.opportunityToken, columDef);
  }
  onRowSelect(row) {
    this.onRowSelectedItem(this.opportunityToken, row);
  }
  onOpenMatter(item: OpportunitySaveViewModel) {
    this.openMatter(this.opportunityToken, item);
  }
  onSaveEditOpertunity(item: OpportunitySaveViewModel) {
    this.saveEditOpertunity(this.opportunityToken, item);
  }
  // onGetWorkTypeList(departmentId: number) {
  //   this.getWorkTypeList(this.opportunityToken, departmentId);
  // }
  onSendNotification(event: { email: string, feeEarnerCode: string, message: string, enquiryId: number }) {
    this.sendNotification(this.opportunityToken, event);
  }

  onChangeColumFilteration(event: { kind: string, columnDef: ColumnDef }) {
    this.changeColumFilteration(this.opportunityToken, event);
  }

}

