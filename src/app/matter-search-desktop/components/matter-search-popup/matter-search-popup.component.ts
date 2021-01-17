import { LocalStorageKey } from './../../../core/lib/local-storage';
import { BasePopupType } from '../../../shared/models/consol-error';
import { Filter, Condition } from '../../../odata/interfaces';
import { PageEvent, MatRadioGroup, MatRadioChange } from '@angular/material';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatterViews } from '../../../matter-search-core';
import { GridRowItemWrapper } from '../../../matter-search-core';
import { ViewChangeKind } from '../../../matter-search-core';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';

@Component({
  selector: 'dps-matter-search-popup',
  templateUrl: './matter-search-popup.component.html',
  styleUrls: ['./matter-search-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSearchPopupComponent implements OnInit {
  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;

  @Input() matterData: any;
  @Input() activeView;
  @Input() columnDef: ColumnDef;
  @Input() paginatorDef: PaginatorDef;
  @Input() totalItems: Number;
  @Input() searchText: string;
  @Input() isClosedMatters: boolean;
  @Input() isDepartmentLoading: boolean;
  @Input() isGridLoading: boolean;
  @Input() isMatterCreate: boolean;
  @Input() basePopupType: BasePopupType;
  @Input() isPlotUser: boolean;
  @Input() plotVarValues: string[];

  @Output() viewChange = new EventEmitter();
  @Output() rowSelect = new EventEmitter();
  @Output() toggleExpand = new EventEmitter();
  @Output() matterPopupClosed = new EventEmitter<string>();
  @Output() selectedRowData = new EventEmitter();

  MatterViews = MatterViews;
  @ViewChild(MatRadioGroup) matRadioGroup: MatRadioGroup;

  clickedItem: any;
  BasePopupType: BasePopupType;
  menuItem: MainMenuItem<any>[];
  constructor() { }

  ngOnInit() {
    if (this.basePopupType === BasePopupType.EmailAttachDPSfile) {
      this.matRadioGroup.value = MatterViews.Suggested;
      this.BasePopupType = BasePopupType.EmailAttachDPSfile;
    } else {
      this.matRadioGroup.value = this.activeView ? this.activeView : MatterViews.Recent;
    }
    this.menuItem = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
  }

  public popupRowdblclick(row: GridRowItemWrapper): void {
    this.selectedRowData.emit({ item: row, gridData: this.matterData });
  }

  public popupRowclick(row: GridRowItemWrapper): void {
    this.clickedItem = row;
  }


  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
    console.log('onNextPage', pageEvent);
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      console.log('apply column filter', data);
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
  changeMatterView(event: MatRadioChange) {
    if (event.value) {
      this.viewChange.emit({ kind: ViewChangeKind.MainView, value: event.value });
    }
  }
  onSearchTextChanged(value) {
    if (!value) {
      this.matRadioGroup.value = MatterViews.Recent;
    } else {
      this.matRadioGroup.value = null;
    }
    this.viewChange.emit({ kind: ViewChangeKind.SearchText, value: value });
  }
  onClosedMattersChange(value) {
    this.viewChange.emit({ kind: ViewChangeKind.ClosedMatters, value: value });
  }

  onCompletedMattersChange(value) {
    this.viewChange.emit({ kind: ViewChangeKind.CompletedMatters, value: value });
  }

  onClose() {
    this.matterPopupClosed.emit('close');
  }
  get matterSearchTitle(): string {
    return !this.menuItem ? 'Matter' : this.menuItem.find(i => i.id === 'matter_search').label;
  }

}
