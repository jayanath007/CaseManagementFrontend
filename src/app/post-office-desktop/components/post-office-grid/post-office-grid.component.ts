import { GridButtonType } from '../../../post-office-core/models/enumeration';
import { PageEvent, MatDialog } from '@angular/material';

import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../../core/lib/grid-model';

import { Filter, Condition } from '../../../odata';
import { GridData, SelectedInfo, GridButtonAction } from '../../../post-office-core/models/interfce';
import { ViewChangeKind } from '../../../post-office-core/models/enumeration';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/index';
import { GroupMode } from './../../../post-office-core/models/enumeration';

@Component({
  selector: 'dps-post-office-grid',
  templateUrl: './post-office-grid.component.html',
  styleUrls: ['./post-office-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostOfficeGridComponent implements OnInit, OnChanges {
  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;
  @Input() isLoading: boolean;
  @Input() homeCurrancy;
  @Input() columnDef: ColumnDef[];
  @Input() paginatorDef: PaginatorDef;
  @Input() totalItem: Number;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() expandedRow: GridData;
  @Input() searchText: string;
  @Input() gridData: GridData[];
  @Input() groupData: GridGroupData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode: GroupMode;
  @Input() selectGroupHash: string[];

  @Output() viewChange = new EventEmitter<any>();
  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();

  GroupMode = GroupMode;
  @Output() loadMoreData = new EventEmitter<GridGroupData>();

  documentUrlLoadSuccess = true;
  documentUrlIsLoading = false;

  constructor(private popupService: SystemJsPopupLoaderService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  headerFlex(header) {
    if (header.extras.hidden) {
      return 0;
    }
    return header.extras.fxFlex;
  }


  isBrowserCompatibleExtentions(docPrivewRow: GridData) {
    const extentions = docPrivewRow.inboxDocPath.split('.');
    const extention = extentions[extentions.length - 1].toLocaleLowerCase();
    return 'pdf' === extention;
  }




  get columnDefVisibale(): ColumnDef[] {
    return this.columnDef.filter(p => p.extras.hidden !== true);
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index]
      && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  get getIsMuiltySelect() {
    if (this.gridData && this.gridData.length > 0) {
      const selectRow = this.gridData.filter(row => row.isChecked);
      return selectRow && selectRow.length > 1 ? true : false;
    }
    return false;
  }

  get selectedRows() {
    if (this.gridData && this.gridData.length > 0) {
      const selectRow = this.gridData.filter(row => row.isChecked);
      return selectRow;
    }
    return [];
  }


  get docPrivewRow() {
    if (this.gridData && this.gridData.length > 0) {
      return this.gridData.find((row) => row.view);
    }
    return null;
  }

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

  public gridRowExpan(row: GridData, event: MouseEvent): void {
    this.rowExpand.emit(row);
  }

  public onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  onOpenDocument(event: Event, item: GridData) {
    if (item.letter_icon) {
      event.stopPropagation();
      this.rowExpand.emit(item);
      this.clickGridButton.emit({ kind: GridButtonType.viewDocument, value: item });
    }
  }

  onCloseViewer() {
    const action: GridButtonAction = { kind: GridButtonType.closeViewer, value: null };
    this.clickGridButton.emit(action);
  }


  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }

}


