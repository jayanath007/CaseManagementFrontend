
import { PageEvent } from '@angular/material';
import { GridRowItemWrapper, MatterFinance } from '../../../matter-search-core';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ViewChangeKind } from '../../../matter-search-core';
import { Filter, Condition } from '../../../odata';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';



@Component({
  selector: 'dps-matter-search-grid',
  templateUrl: './matter-search-grid.component.html',
  styleUrls: ['./matter-search-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSearchGridComponent implements OnInit, OnChanges {
  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;
  // matterFinanceData: any;

  @Input() homeCurrancy;
  @Input() matterData: GridRowItemWrapper[]; // = process(matters, this.state);
  @Input() activeView;
  @Input() columnDef: ColumnDef;
  @Input() paginatorDef: PaginatorDef;
  @Input() totalItems: Number;
  @Input() matterFinance: MatterFinance;
  @Input() searchText: string;
  @Input() isDepartmentLoading: boolean;
  @Input() isGridLoading: boolean;
  @Input() isPlotUser: boolean;
  @Input() plotVarValues: string[];

  @Output() viewChange = new EventEmitter();
  @Output() rowSelect = new EventEmitter();
  @Output() toggleExpand = new EventEmitter();
  @Output() updateOpenCaseClick = new EventEmitter<GridRowItemWrapper>();
  @Output() updateTimeRecordingClick = new EventEmitter<GridRowItemWrapper>();
  @Output() updateNewMailClick = new EventEmitter<GridRowItemWrapper>();
  @Output() ledgerCardClick = new EventEmitter<GridRowItemWrapper>();
  @Output() openMLS = new EventEmitter<GridRowItemWrapper>();
  @Output() openEChitWithMatter = new EventEmitter<GridRowItemWrapper>();
  @Output() openBillingRequest = new EventEmitter<GridRowItemWrapper>();
  @Output() openReferralNoteAndDate = new EventEmitter<GridRowItemWrapper>();

  module = Module;

  constructor(private access: AccessControlService) {
  }
  //  ---------- Matter search page-----------

  ngOnChanges(changes: SimpleChanges) {

  }

  public gridRowExpan(row: GridRowItemWrapper, event: MouseEvent): void {
    // if (row && row.financeDetails) {

    // } else {
    // event.preventDefault();
    // event.stopPropagation();
    this.toggleExpand.emit(row);
    // }
  }

  public gridRowClick(row: GridRowItemWrapper): void {
    this.rowSelect.emit(row);
  }

  public openCaseClick(selectedMatterData: GridRowItemWrapper) {
    this.updateOpenCaseClick.emit(selectedMatterData);
  }

  public timeRecordingClick(selectedMatterData: GridRowItemWrapper) {
    this.updateTimeRecordingClick.emit(selectedMatterData);
  }

  public newMailClick(selectedMatterData: GridRowItemWrapper) {
    this.updateNewMailClick.emit(selectedMatterData);
  }

  //  ---------- Matter search page end -----------

  //  ---------- Matter search popup -----------
  // public popupRowClick(row: GridRowItemWrapper): void {
  //   console.log('popupRowClick', row);
  // }



  //  ---------- Matter search popup end -----------

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  ngOnInit() {
    // console.log('component init', this.matterData);
  }

  onOpenLedgerCard(matterData) {
    this.ledgerCardClick.emit(matterData);
  }

  onOpenMLS(row: GridRowItemWrapper) {
    this.openMLS.emit(row);
  }

  onOpenEChitWithMatter(row: GridRowItemWrapper) {
    this.openEChitWithMatter.emit(row);
  }
  onOpenBillingRequestPopup(row: GridRowItemWrapper) {
    this.openBillingRequest.emit(row);
  }

  onOpenReferralNoteAndDate(row: GridRowItemWrapper) {
    this.openReferralNoteAndDate.emit(row);
  }

  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

}


